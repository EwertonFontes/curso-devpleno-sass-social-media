
import Link from "next/link";
import Seo from "components/Seo";

export default function Home() {
  return (
    <div>
      <Seo title='Social Media Belt' description='alguma coisa'/>
      <main>
        <h1 className={'font-bold text-3xl'}>Welcome to NEXTJS</h1>

        <ul>
          <li><Link href='/app'>App</Link></li>
          <li><Link href='/devpleno'>Tenant devpleno</Link></li>
        </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
