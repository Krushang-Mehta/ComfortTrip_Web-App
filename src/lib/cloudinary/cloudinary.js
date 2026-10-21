import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file buffer or base64 data to Cloudinary
 * @param {Buffer|string} fileBufferOrBase64
 * @param {object} options
 * @returns {Promise<{ url: string, publicId: string, format: string, bytes: number }>}
 */
export async function uploadToCloudinary(fileBufferOrBase64, options = {}) {
  const uploadOptions = {
    folder: options.folder || 'comfort-trip/cars',
    resource_type: options.resource_type || 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
    ...options,
  };

  if (Buffer.isBuffer(fileBufferOrBase64)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          });
        }
      );
      uploadStream.end(fileBufferOrBase64);
    });
  }

  // Handle base64 or remote URL string
  const result = await cloudinary.uploader.upload(fileBufferOrBase64, uploadOptions);
  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
  };
}

/**
 * Delete an asset from Cloudinary
 * @param {string} publicId
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
