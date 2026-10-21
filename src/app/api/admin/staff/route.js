import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import User from '@/models/User';
import { logActivity } from '@/lib/utils/activityLogger';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

/**
 * GET /api/admin/staff
 * Exclusively accessible by super-admin to view all administrators & super-administrators.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Super Admin credentials required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const staff = await User.find({ role: { $in: ['admin', 'super-admin'] } })
      .select('-passwordHash -resetPasswordToken -verificationToken')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      staff: staff.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        isActive: u.isActive !== false,
        createdAt: u.createdAt,
        lastActive: u.lastActive || u.updatedAt,
      })),
    });
  } catch (error) {
    console.error('[/api/admin/staff GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

/**
 * POST /api/admin/staff
 * Create a new admin or super-admin profile with mandatory super-admin password verification.
 */
export async function POST(req) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Super Admin authorization required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, role, password, superAdminPassword } = body;

    // Validate fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and temporary password are required.' },
        { status: 400 }
      );
    }

    if (!['admin', 'super-admin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be either admin or super-admin.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (!superAdminPassword?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Current Super Admin verification password is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1. Verify caller super-admin password against DB
    const callingSuperAdmin = await User.findById(session.user.id);
    if (!callingSuperAdmin || !callingSuperAdmin.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Calling Super Admin account record not found or has no password set.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(superAdminPassword, callingSuperAdmin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Super Admin password verification failed. Action rejected.' },
        { status: 401 }
      );
    }

    // 2. Check if email already registered
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `An account with email "${normalizedEmail}" already exists.` },
        { status: 400 }
      );
    }

    // 3. Hash password and persist user
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newStaff = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
      passwordHash,
      role,
      isVerified: true,
      isActive: true,
      rewardPoints: 100,
    });

    logActivity({
      action: 'SUPER_ADMIN_CREATED_STAFF',
      module: 'admin',
      targetId: newStaff._id.toString(),
      description: `Super Admin ${session.user.email} provisioned new ${role} profile: ${newStaff.email}`,
      adminId: session.user.id,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Successfully created ${role === 'super-admin' ? 'Super Administrator' : 'Administrator'} account for ${newStaff.email}.`,
      staff: {
        id: newStaff._id.toString(),
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        isActive: newStaff.isActive,
        createdAt: newStaff.createdAt,
      },
    });
  } catch (error) {
    console.error('[/api/admin/staff POST Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
