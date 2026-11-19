export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          Loomiva
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <a
            href="/"
            className="hover:text-gray-500 transition"
          >
            Home
          </a>

          <a
            href="/products"
            className="hover:text-gray-500 transition"
          >
            Products
          </a>

          <a
            href="/cart"
            className="hover:text-gray-500 transition"
          >
            Cart
          </a>

        </div>

      </div>

    </nav>
  );
}