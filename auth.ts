import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          // Request Gmail scopes alongside login — single consent step
          scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
          ].join(" "),
          access_type: "offline",  // get refresh token
          prompt: "consent",       // always show consent → ensures refresh token
        },
      },
    }),
  ],

  callbacks: {
    // Runs when JWT is created or updated
    async jwt({ token, account }) {
      // On first sign-in, `account` contains all Google tokens.
      // Store them in the JWT — they will be forwarded to the backend
      // via the server-side /api/auth/sync route (never exposed to browser).
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
        token.needsSync = true
      }

      // NO backend API calls here — that's an anti-pattern.
      // The sync happens in a controlled frontend lifecycle step.
      return token
    },

    // Runs when session is accessed in the app
    async session({ session, token }) {
      // Expose ONLY safe, non-sensitive data to the frontend.
      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      session.needsSync = token.needsSync as boolean

      // NEVER expose refreshToken to the client.
      // It stays in the server-side JWT only, accessible via auth() on the server.

      return session
    },
  },

  pages: {
    signIn: "/",   // root page acts as login
    error: "/",    // redirect errors to root
  },
})
