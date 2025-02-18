import { useState, useEffect } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <header className="bg-gray-600 bg-opacity-80 text-white py-4 shadow">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link href="/">Todo App</Link>
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-orange-800 text-white px-3 py-1 rounded hover:bg-orange-700"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow p-6">
          {children}
        </div>
      </main>
      <footer className=" bg-opacity-80 text-white py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Todo App
        </div>
      </footer>
    </div>
  );
}
