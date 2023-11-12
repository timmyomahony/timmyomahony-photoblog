import Link from "next/link";

import InstagramIcon from "@/icons/Instagram.svg";

const Header = () => {
  return (
    <header className="w-full py-8">
      <section className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-medium">
          <Link href="/">Timmy O&apos;Mahony</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href="https://instagram.com/timmy.omahony">
                <InstagramIcon className="w-6 h-6" />
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </header>
  );
};

export default Header;
