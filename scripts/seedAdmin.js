import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../src/lib/db/mongodb.js';
import User from '../src/models/User.js';

async function setupAdmin() {
  try {
    await connectToDatabase();

    const targetEmail = process.argv[2] || 'admin@comforttrip.com';
    const rawPassword = process.argv[3] || 'Admin@12345';
    const role = process.argv[4] || 'super-admin';

    const existingUser = await User.findOne({ email: targetEmail.toLowerCase() });

    if (existingUser) {
      existingUser.role = role;
      if (process.argv[3]) {
        existingUser.passwordHash = await bcrypt.hash(rawPassword, 12);
      }
      await existingUser.save();
      console.log(`\n[SUCCESS] Updated existing user "${targetEmail}" to role: "${role}"`);
    } else {
      const passwordHash = await bcrypt.hash(rawPassword, 12);
      await User.create({
        name: 'Comfort Trip Super Admin',
        email: targetEmail.toLowerCase(),
        passwordHash,
        phone: '+91 98250 00000',
        role,
        rewardPoints: 1000,
        isVerified: true,
        isActive: true,
      });
      console.log(`\n[SUCCESS] Created new ${role} account:`);
      console.log(`  Email:    ${targetEmail}`);
      console.log(`  Password: ${rawPassword}`);
      console.log(`  Role:     ${role}\n`);
    }

    process.exit(0);
  } catch (err) {
    console.error('\n[ERROR]', err.message);
    process.exit(1);
  }
}

setupAdmin();
