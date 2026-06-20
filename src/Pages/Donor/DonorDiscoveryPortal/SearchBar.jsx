const Navbar = () => {
  return (
    <header className="fixed top-0 w-full bg-white border-b z-50 px-6 h-16 flex items-center justify-between">
      <div className="flex gap-6 items-center">
        <h1 className="font-bold text-green-700 text-xl">UnityBridge</h1>
        <nav className="hidden md:flex gap-4">
          <a className="font-semibold border-b-2 border-green-700">Projects</a>
          <a>Volunteer</a>
          <a>Transparency</a>
          <a>About</a>
        </nav>
      </div>

      <div className="flex gap-3">
        <button className="border px-4 py-1 rounded-full">Sign In</button>
        <button className="bg-green-700 text-white px-4 py-1 rounded-full">
          Donate Now
        </button>
      </div>
    </header>
  );
};

export default Navbar;