// lib/auth.ts
import NextAuth, {
  type NextAuthOptions,
  User as NextAuthUser,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CustomUser extends NextAuthUser {
  role: string;
  accessToken: string;
  cpf?: string;
  CRM?: string;
  specialty?: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  bio?: string;
}

interface ApiResponse {
  success?: boolean;
  data?: {
    pacient?: {
      id?: string;
      email?: string;
      name?: string;
      cpf?: string;
      token?: string;
      phone?: string;
      address?: string;
    };
    doctor?: {
      id?: string;
      email?: string;
      name?: string;
      CRM?: string;
      specialty?: string;
      token?: string;
      phone?: string;
      address?: string;
      experience?: string;
      education?: string;
      bio?: string;
    };
    token?: string;
  };
  token?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Email ou CPF", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Email/CPF e senha são obrigatórios");
        }

        try {
          // Tentar login como paciente
          let response = await fetch(`${API_BASE_URL}/api/pacient/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              login: credentials.login,
              password: credentials.password,
            }),
          });

          let data: ApiResponse = await response.json();

          if (response.ok && data.success) {
            const userInfo = data.data?.pacient;
            return {
              id: userInfo?.id || "",
              email: userInfo?.email || "",
              name: userInfo?.name || "",
              role: "pacient",
              accessToken: data.data?.token || data.token || "",
              cpf: userInfo?.cpf,
              phone: userInfo?.phone,
              address: userInfo?.address,
            } as CustomUser;
          }

          // Tentar login como médico
          response = await fetch(`${API_BASE_URL}/api/doctor/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              login: credentials.login,
              password: credentials.password,
            }),
          });

          data = await response.json();

          if (response.ok && data.success) {
            const userInfo = data.data?.doctor;
            return {
              id: userInfo?.id || "",
              email: userInfo?.email || "",
              name: userInfo?.name || "",
              role: "doctor",
              accessToken: data.data?.token || data.token || "",
              CRM: userInfo?.CRM,
              specialty: userInfo?.specialty,
              phone: userInfo?.phone,
              address: userInfo?.address,
              experience: userInfo?.experience,
              education: userInfo?.education,
              bio: userInfo?.bio,
            } as CustomUser;
          }

          throw new Error("Credenciais inválidas");
        } catch (error) {
          console.error("Erro no authorize:", error);
          throw new Error("Erro ao fazer login. Tente novamente.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 JWT Callback:", { token, user });
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("🔄 Session Callback:", { session, token });
      if (token.user) {
        session.user = { ...session.user, ...token.user };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
};

export default NextAuth(authOptions);
