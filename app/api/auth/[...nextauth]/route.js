import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "lib/prisma"


export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session ({ session, token, user }){
      session.user.id = token.sub
      return session
    },
    async jwt({ token, user, account, profile, isNewUser}) {
      console.log({user, isNewUser, token})
      if (isNewUser) {
        // createNewTenant
        // TODO
        console.log('create new account')
        const accounts = await prisma.tenant.findMany({
          where: {
            users: {
              some: {
                userId: user.id
              }
            }
          }
        })

        console.log({accounts})
        if (!accounts === false) {
          console.log('create new tenant')
          const tenant = await prisma.tenant.create({
            data: {
              name: 'Meu Tenant',
              image: '',
              slug: 'meutenant',
              plano: 'free',
            }
          })
          
          console.log('Create Users on Tenants')
          const userOnTenant = await prisma.usersOnTenants.create({
            data: {
              userId: user.id,
              tenantId: tenant.id,
              role: 'owner',
            }
          })
        }
      }
      return token 
    }
  },
  pages: {},
  events: {},
  debug: true
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };