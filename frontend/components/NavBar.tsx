import Image from 'next/image';

function NavBar() {
  return (
    <nav className="bg-black text-white py-4 px-8 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">PromptPlay</span>
      </div>
      <ul className="flex gap-6 text-sm">
        <li><a href="#" className="hover:text-blue-500">Products</a></li>
        <li><a href="#" className="hover:text-blue-500">Pricing</a></li>
        <li><a href="#" className="hover:text-blue-500">Resources</a></li>
      </ul>
      <div className="flex items-center gap-4">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          Try It Free →
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
