"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, MenuIcon, XIcon } from "./icons"

function NavBar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md text-white py-4 px-6 md:px-8 sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            PromptPlay
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-sm">
         
          <li>
            <Link href="#" className="hover:text-blue-400 transition-colors py-2">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-400 transition-colors py-2">
              Resources
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-400 transition-colors py-2">
              About Us
            </Link>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost" className="text-white hover:text-blue-400 hover:bg-transparent">
              Log In
            </Button>
          </Link>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            onClick={() => router.push("/auth")}
          >
            Try It Free →
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-lg">
          <div className="px-4 py-3">
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="#" className="block py-2 hover:text-blue-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#" className="block py-2 hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="block py-2 hover:text-blue-400 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="block py-2 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="w-full justify-center border-gray-700 text-white hover:bg-gray-800"
                >
                  Log In
                </Button>
              </Link>
              <Button
                className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={() => router.push("/auth")}
              >
                Try It Free →
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
