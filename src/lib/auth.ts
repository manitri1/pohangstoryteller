import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// 환경변수 검증
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://your-project.supabase.co';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'your_supabase_service_role_key_here';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        username: { label: 'Username', type: 'text' },
        interests: { label: 'Interests', type: 'text' },
        travelDuration: { label: 'Travel Duration', type: 'text' },
        companion: { label: 'Companion', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 먼저 기존 사용자 확인
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (existingUser) {
            // 기존 사용자 - 비밀번호 검증 (실제 구현에서는 해시된 비밀번호 비교)
            // 현재는 간단한 검증만 수행
            if (!credentials.password || credentials.password.length < 6) {
              throw new Error('비밀번호는 6자 이상이어야 합니다.');
            }

            return {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
            };
          } else {
            // 새 사용자 - 회원가입 처리
            if (!credentials.name || credentials.name.trim() === '') {
              throw new Error('회원가입을 위해서는 이름이 필요합니다.');
            }

            // 비밀번호 검증
            if (!credentials.password || credentials.password.length < 6) {
              throw new Error('비밀번호는 6자 이상이어야 합니다.');
            }

            const { data: newUser, error } = await supabase
              .from('profiles')
              .insert({
                email: credentials.email,
                name: credentials.name,
                preferences: {
                  interests: credentials.interests
                    ? credentials.interests.split(',')
                    : [],
                  travelDuration: credentials.travelDuration,
                  companion: credentials.companion,
                },
              })
              .select()
              .single();

            if (error) {
              console.error('회원가입 오류:', error);
              throw new Error(
                `회원가입 중 오류가 발생했습니다: ${error.message}`
              );
            }

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
            };
          }
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || '인증 중 오류가 발생했습니다.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};
