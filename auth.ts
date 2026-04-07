import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          // Request Gmail scopes alongside login — one step
          scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
          ].join(" "),
          access_type: "offline",  // get refresh token
          prompt: "consent",       // always show consent to get refresh token
        },
      },
    }),
  ],

  callbacks: {
    // Runs when JWT is created or updated
    async jwt({ token, account }) {
      // On first sign in, account contains Google tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at

        // Send Google token to FastAPI, get back your app JWT
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              }),
            }
          )
          const data = await res.json()
          if (data.app_token) {
            token.appToken = data.app_token  // your FastAPI JWT
          } else {
            console.error("No app_token in response:", data);
          }
        } catch (error) {
          console.error("Failed to sync with backend:", error)
        }
      }
      return token
    },

    // Runs when session is accessed in the app
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.appToken = token.appToken as string  // pass app JWT to client
      return session
    },
  },

  pages: {
    signIn: "/",   // our root page acts as login
    error: "/",    // redirect errors to root
  },
})
