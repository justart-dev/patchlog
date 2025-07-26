import Link from "next/link";

const navItems = {
  "/": {
    name: "Home",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  "/patch": {
    name: "Marvel Rivals",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
};

export function Navbar() {
  return (
    <nav className="w-full">
      <div className="flex items-center space-x-6">
        {Object.entries(navItems).map(([path, { name, icon }]) => (
          <Link
            key={path}
            href={path}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
          >
            <span>{icon}</span>
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
