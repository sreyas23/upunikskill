// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white py-4 shadow">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link href="/">Todo App</Link>
          </h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/new" className="hover:underline">
              Create New
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content (Centered) */}
      <main className="flex-1 flex items-center justify-center p-6">
        {/* Card Container */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-600 text-white py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Todo App
        </div>
      </footer>
    </div>
  );
}
