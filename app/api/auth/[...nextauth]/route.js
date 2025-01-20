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
    async jwt({ token, user, account, profile, isNewUser}) {
      console.log({user, isNewUser, token})
      if (isNewUser) {
        // createNewTenant
        // TODO
        console.log('create new account')
        const tenants = await prisma.tenant.findFirst({
          where: {
            userId: user.id
          }
        })
        console.log(tenants)
        if(!tenants){
          console.log('create new tenant')
          await prisma.tenant.create({
            data: {
              name: 'Meu Tenant',
              image: '',
              slug: 'meutenant',
              plano: 'free',
              userId: user.id,
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