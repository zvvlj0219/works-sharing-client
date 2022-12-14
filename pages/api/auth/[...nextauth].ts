import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { RedirectParams } from '../../../types/next-auth'

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
        }),
        CredentialsProvider({
            name: 'Credential',
            async authorize(credentials) {
                const { email } = credentials as {
                    email: string
                }

                const user = {
                    name: 'ゲストユーザー',
                    email: 'guest@example.com',
                    id: 'guest_id'
                }

                if (email !== 'guest@example.com') {
                    return null
                }

                return user
            },
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'jsmith@com'
                }
            }
        })
        // ...add more providers here
    ],
    callbacks: {
        /**
         * @param  {object} user     User object
         * @param  {object} account  Provider account
         * @param  {object} profile  Provider profile
         * @return {boolean|string}  Return `true` to allow sign in
         *                           Return `false` to deny access
         *                           Return `string` to redirect to (eg.: "/unauthorized")
         */
        async signIn() {
            return true
        },
        /**
         * @param  {object}  token     Decrypted JSON Web Token
         * @param  {object}  user      User object      (only available on sign in)
         * @param  {object}  account   Provider account (only available on sign in)
         * @param  {object}  profile   Provider profile (only available on sign in)
         * @param  {boolean} isNewUser True if new user (only available on sign in)
         * @return {object}            JSON Web Token that will be saved
         */
        async jwt({ token, account }) {
            // Add access_token to the token "right after signin"
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        /**
         * @param {object} url
         * @param {object} baseUrl
         */
        async redirect({ url, baseUrl }: RedirectParams): Promise<string> {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXT_AUTH_SERECT,
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30
        // You can define your own encode/decode functions for signing and encryption
        // async encode() {},
        // async decode() {},
    },
    session: {
        strategy: 'jwt'
    }
})
