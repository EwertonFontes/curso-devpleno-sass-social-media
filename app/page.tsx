'use client';

import Link from "next/link";
import Seo from "components/Seo";
import { signIn, useSession, signOut } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession()
  console.log(session)
  return (
    <div>
      <Seo title='Social Media Belt' description='alguma coisa'/>
      <main>
        <h1 className={'font-bold text-3xl'}>Welcome to NEXTJS</h1>

        <ul>
          <li><Link href='/app'>App</Link></li>
          <li><Link href='/devpleno'>Tenant devpleno</Link></li>
        </ul>
        <button onClick={() => signIn(null,  {callbackUrl: '/app'})}>Sign In</button>
        <p>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        </p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
