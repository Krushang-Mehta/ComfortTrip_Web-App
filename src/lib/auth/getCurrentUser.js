import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { connectToDatabase } from '@/lib/db/mongodb';
import { findUserById } from '@/repositories/userRepository';

/**
 * Get the current NextAuth session on the server
 * @returns {Promise<import('next-auth').Session|null>}
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the currently authenticated user document directly from MongoDB
 * @returns {Promise<Object|null>} Safe user object or null
 */
export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return null;
    }

    await connectToDatabase();
    const user = await findUserById(session.user.id);
    return user;
  } catch (error) {
    console.error('[getCurrentUser Error]', error);
    return null;
  }
}
