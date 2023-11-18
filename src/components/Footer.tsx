import Link from "next/link";
import {version} from '@/../package.json';
import { format } from 'date-fns';

const Footer = () => {
  const lastBuilt = format(new Date(), "EEEE do MMMM 'at' HH:mm");
  return (
    <footer className="w-full mt-24 py-12 lg:pt-24 lg:pb-8 bg-gray-100">
      <section className="container px-4">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 text-xl lg:text-2xl">
          <div className="w-1/2">
            <h2>
              &copy;{" "}
              <Link className="hover:underline" href="https://timmyomahony.com">
                Timmy O&apos;Mahony
              </Link>
            </h2>
          </div>
          <nav className="w-1/2">
            <ul className="flex flex-col gap-2 lg:gap-4">
              <li>
                <Link
                  href="https://instagram.com/timmy.omahony"
                  className="hover:underline"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:hey@timmyomahony.com"
                  className="hover:underline"
                >
                  Email
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <section className="container px-4 mt-28">
        <p className="text-xs text-gray-300 w-full flex justify-between">
          <span>
            <Link
              href="https://github.com/timmyomahony/timmyomahony-photoblog"
              className="hover:underline"
            >
              Interested in how this site is built?
            </Link>
          </span>
          <span>
            <Link href="https://github.com/timmyomahony/timmyomahony-photoblog">
              Version <span className="underline">{version}</span>
            </Link>{" "}
            &mdash; Last Updated: {lastBuilt}
          </span>
        </p>
      </section>
    </footer>
  );
};

export default Footer;
