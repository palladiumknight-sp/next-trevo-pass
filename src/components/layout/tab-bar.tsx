import Image from "next/image";
import { LINKS_MENU } from "@/data";
import Link from "next/link";

export const TabBar = () => {
  return (
    <div className="flex flex-row justify-around gap-3 p-4 md:hidden z-10 fixed bg-slate-100 w-full bottom-0">
      {LINKS_MENU.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="flex flex-col justify-center items-center"
        >
          <Image
            src={link.image}
            width={32}
            height={32}
            className="w-8 h-8"
            alt={link.alt}
          />
          <span className="text-xs text-violet-900 font-ubuntu font-medium">
            {link.text}
          </span>
        </Link>
      ))}
    </div>
  );
};
