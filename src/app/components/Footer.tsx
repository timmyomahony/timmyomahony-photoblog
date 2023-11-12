import Link from "next/link";

const Footer = () => {
  return <footer className="w-full mt-24 py-24 bg-gray-100">
    <section className="container mx-auto flex">
        <div className="w-1/2 text-2xl font-medium"><h2>&copy; Timmy O&apos;Mahony</h2></div>
        <nav className="w-1/2">
            <ul className="flex flex-col gap-4 text-2xl">
                <li><Link href="https://instagram.com/timmyomahony" className="hover:underline">Instagram</Link></li>
                <li><Link href="mailto:hey@timmyomahony.com" className="hover:underline">Email</Link></li>
            </ul>
        </nav>
    </section>
  </footer>;
};

export default Footer;
