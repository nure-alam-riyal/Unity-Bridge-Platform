import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Financial Reports', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Impact Methodology', href: '#' },
    { label: 'Contact Us', href: '#' },
  ];

  return (
    <footer className="w-full bg-[#E2E7E2] text-[#2D5A43] py-8 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* Left Side: Brand and Copyright */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#1E4631]">
            {/* Custom Hands + Heart Icon */}
            <svg 
              className="w-6 h-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 11h.01" />
            </svg>
            <span>UnityBridge</span>
          </div>
          <p className="text-xs md:text-sm text-[#4A6B58] font-medium">
            &copy; {currentYear} UnityBridge. Built for Radical Transparency.
          </p>
        </div>

        {/* Right Side: Navigation Links */}
        <nav>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#3B5E4A] font-medium">
            {links.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.href} 
                  className="hover:text-[#1E4631] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </footer>
  );
}