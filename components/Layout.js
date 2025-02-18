import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <header className="bg-gray-600 bg-opacity-80 text-white py-4 shadow">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link href="/">Tickr</Link>
          </h1>
          <nav className="flex space-x-4 items-center">
            <Link
              href="/dashboard"
              className="hover:text-orange-300 transition-colors"
            >
              Dashboard
            </Link>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="px-2 py-1 rounded bg-gray-100 text-gray-800 focus:outline-none"
            />
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-orange-800 text-white px-3 py-1 rounded hover:bg-orange-700"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow p-6 min-h-[400px]">
          {children}
        </div>
      </main>
      <footer className="bg-gray-600 bg-opacity-80 text-white py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Todo App
        </div>
      </footer>
    </div>
  );
}
