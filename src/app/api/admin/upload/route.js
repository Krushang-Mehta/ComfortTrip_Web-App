import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/getCurrentUser';
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinary';
import { logActivity } from '@/lib/utils/activityLogger';

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'comfort-trip/cars';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'No image file was provided for upload.' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Please upload JPG, PNG, WEBP, or AVIF.' },
        { status: 400 }
      );
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Image size exceeds maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await uploadToCloudinary(buffer, {
      folder: String(folder),
    });

    logActivity({
      action: 'ADMIN_IMAGE_UPLOADED',
      module: 'fleet',
      targetId: uploadResult.publicId,
      description: `Uploaded fleet asset to Cloudinary: ${uploadResult.publicId}`,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });
  } catch (error) {
    console.error('[Cloudinary Upload Route Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image upload failed.' },
      { status: 500 }
    );
  }
}
