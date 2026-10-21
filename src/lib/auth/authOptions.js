import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db/mongodb';
import { validateUserCredentials, buildSessionUser } from '@/services/authService';
import { findUserByEmail, createUser, updateLastActive } from '@/repositories/userRepository';
import { logActivity } from '@/lib/utils/activityLogger';

const Google = typeof GoogleProvider === 'function' ? GoogleProvider : GoogleProvider?.default;
const Credentials = typeof CredentialsProvider === 'function' ? CredentialsProvider : CredentialsProvider?.default;

const providers = [];

// 1. Google OAuth Provider (Configured if valid client ID & secret exist)
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const isGoogleConfigured =
  googleClientId &&
  googleClientSecret &&
  !googleClientId.includes('your_google_client_id') &&
  !googleClientSecret.includes('your_google_client_secret') &&
  typeof Google === 'function';

if (isGoogleConfigured) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// 2. Email & Password Credentials Provider
if (typeof Credentials === 'function') {
  providers.push(
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        await connectToDatabase();
        const user = await validateUserCredentials({
          email: credentials.email,
          password: credentials.password,
        });

        const sessionUser = buildSessionUser(user);
        sessionUser.rememberMe = credentials.rememberMe === 'true' || credentials.rememberMe === true;
        return sessionUser;
      },
    })
  );
}

export const authOptions = {
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: '/Login',
    error: '/Login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabase();
          const email = user.email?.toLowerCase().trim();
          let existingUser = await findUserByEmail(email);

          if (!existingUser) {
            // Strict governance policy: External registrations are strictly assigned role: 'user'
            existingUser = await createUser({
              name: user.name || profile?.name || 'Customer',
              email,
              avatarUrl: user.image || profile?.picture || '',
              role: 'user',
              isVerified: true,
              rewardPoints: 100, // 100 welcome bonus points
              isActive: true,
            });

            logActivity({
              action: 'USER_REGISTERED_GOOGLE',
              module: 'auth',
              targetId: existingUser._id?.toString(),
              description: `New customer registered via Google: ${email}`,
            }).catch(() => {});
          } else {
            await updateLastActive(existingUser._id?.toString());
          }

          // Populate user instance for jwt callback
          user.id = existingUser._id?.toString();
          user.role = existingUser.role;
          user.phone = existingUser.phone || '';
          user.avatarUrl = existingUser.avatarUrl || user.image || '';
          user.rewardPoints = existingUser.rewardPoints ?? 100;
          return true;
        } catch (error) {
          console.error('[Google SignIn Callback Error]', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.phone = user.phone || '';
        token.avatarUrl = user.avatarUrl || '';
        token.rewardPoints = user.rewardPoints ?? 100;
        token.rememberMe = user.rememberMe ?? true;
      }

      // Handle client-side session updates (e.g. points earned, name change)
      if (trigger === 'update' && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.phone !== undefined) token.phone = session.user.phone;
        if (session.user.avatarUrl !== undefined) token.avatarUrl = session.user.avatarUrl;
        if (session.user.rewardPoints !== undefined) token.rewardPoints = session.user.rewardPoints;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'user';
        session.user.phone = token.phone || '';
        session.user.avatarUrl = token.avatarUrl || '';
        session.user.rewardPoints = token.rewardPoints ?? 0;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
