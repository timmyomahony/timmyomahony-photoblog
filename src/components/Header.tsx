"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import InstagramIcon from "@/icons/Instagram.svg";

const Header = () => {
  return (
    <motion.header
      className="w-full py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 10 },
      }}
    >
      <section className="container px-4 flex justify-between items-center">
        <h1 className="text-xl font-medium">
          <Link href="/" className="hover:underline">
            Timmy O&apos;Mahony
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href="https://instagram.com/timmy.omahony">
                <InstagramIcon className="w-7 h-7" />
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </motion.header>
  );
};

export default Header;
