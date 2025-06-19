import Link from "next/link";

const navItems = {
  "/": {
    name: "Home",
  },
  "/patch": {
    name: "Marvel Rivals",
  },
};

export function Navbar() {
  return (
    <nav className="w-full">
      <div className="flex items-center space-x-6">
        {Object.entries(navItems).map(([path, { name }]) => (
          <Link
            key={path}
            href={path}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
          >
            {name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
