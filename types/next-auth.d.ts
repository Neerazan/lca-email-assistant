import { DefaultSession, DefaultJWT } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string
    appToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string
    appToken: string
    refreshToken: string
    expiresAt: number
  }
}
