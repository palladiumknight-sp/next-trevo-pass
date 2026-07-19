import Image from "next/image";
import { LINKS_MENU } from "@/data/links-menu";
import Link from "next/link";

export const SideBar = () => {
  return (
    <aside className="hidden fixed md:flex w-64 h-screen shrink-0 flex-col bg-violet-200/60 px-4 py-4">
      <ul className="flex flex-col gap-2">
        {LINKS_MENU.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="flex flex-row justify-start items-center gap-2"
          >
            <Image
              src={link.image}
              width={32}
              height={32}
              className="w-10 h-10"
              alt={link.alt}
            />
            <span className="text-sm text-violet-900 font-ubuntu font-medium">
              {link.text}
            </span>
          </Link>
        ))}
      </ul>
    </aside>
  );
};
