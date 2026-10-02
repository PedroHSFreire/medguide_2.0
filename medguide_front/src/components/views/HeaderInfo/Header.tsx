import Link from "next/link";
export default function Header() {
  return (
    <nav className="flex p-6 bg-zinc-500 justify-center gap-20">
      <Link
        className="inline-block px-6 py-3  hover:bg-gray-600 text-white text-base font-bold border-none rounded-lg cursor-pointer transition-colors duration-300"
        href="/"
      >
        Início
      </Link>
      <Link
        className="inline-block px-6 py-3  hover:bg-gray-600 text-white text-base font-bold border-none rounded-lg cursor-pointer transition-colors duration-300"
        href="/doubts"
      >
        Dúvidas
      </Link>
      <Link
        className="inline-block px-6 py-3  hover:bg-gray-600 text-white text-base font-bold border-none rounded-lg cursor-pointer transition-colors duration-300"
        href="#"
      >
        Ajuda
      </Link>
    </nav>
  );
}
