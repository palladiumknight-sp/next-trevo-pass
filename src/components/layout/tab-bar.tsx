import Image from "next/image";
import Link from "next/link";

export const TabBar = () => {
  const arrayLinks = [
    {
      id: 1,
      href: "/dashboard",
      image: "/icons/home.png",
      alt: "home",
      text: "Inicio",
    },
    {
      id: 2,
      href: "/points",
      image: "/icons/points.png",
      alt: "points",
      text: "Pontos",
    },
    {
      id: 3,
      href: "/rewards",
      image: "/icons/rewards.png",
      alt: "rewards",
      text: "Resgates",
    },
    {
      id: 4,
      href: "/profile",
      image: "/icons/profile.png",
      alt: "profile",
      text: "Perfil",
    },
  ];
  return (
    <div className="flex flex-row justify-around gap-3 p-4 md:hidden">
      {arrayLinks.map((link) => (
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
