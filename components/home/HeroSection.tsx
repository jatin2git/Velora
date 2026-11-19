export default function HeroSection() {
  return (
    <section className="w-full min-h-screen bg-[#f5f1ea]">

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div>

          <p className="uppercase tracking-[4px] text-sm text-gray-500 mb-4">
            Luxury Handloom Collection
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">

            Comfort &
            <br />
            Elegance
            <br />
            For Your Home

          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-lg">

            Premium bedsheets and comforters crafted
            to transform your bedroom into a luxury space.

          </p>

          <div className="flex gap-4">

            <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition">
              Shop Now
            </button>

            <button className="border border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition">
              Explore
            </button>

          </div>

        </div>

        {/* Right Image Area */}
        <div className="flex justify-center">

          <div className="w-full h-[500px] bg-[#ddd6cb] rounded-[40px] flex items-center justify-center">

            <p className="text-gray-600 text-lg">
              Product Image Here
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}