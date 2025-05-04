"use client"

import type React from "react"
import { useState, useEffect } from "react"
import LoginForm from "./login-form"
import SignUpForm from "./sign-up-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AuthTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup")
  }

  return (
    <div className="w-full max-w-md px-4 sm:px-6 relative z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-dotted-pattern opacity-20 ${mounted ? "animate-fadeIn" : ""}`}></div>
        <div className={`absolute inset-0 ${mounted ? "animate-slideUp" : ""}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl transform -translate-y-1/2"></div>
        </div>
      </div>

      {/* Auth Card with Glow Effect */}
      <div className={`rounded-2xl overflow-hidden shadow-2xl relative ${mounted ? "animate-fadeIn" : ""}`}>
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-30 blur-sm"></div>

        <div className="relative bg-gray-900/90 backdrop-blur-lg rounded-2xl">
          {/* Tabs */}
          <Tabs defaultValue="login" onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger
                value="login"
                className={`py-4 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-gray-400 hover:text-gray-300`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={`py-4 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-gray-400 hover:text-gray-300`}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-0 border-none">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="p-0 border-none">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Additional Info */}
      <div
        className={`mt-6 text-center text-gray-400 text-sm ${mounted ? "animate-fadeIn" : ""}`}
        style={{ animationDelay: "0.5s" }}
      >
        <p>Secure authentication powered by our AI platform</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            Secure
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bg-dotted-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @media (max-width: 640px) {
          .bg-dotted-pattern {
            background-size: 15px 15px;
          }
        }
        
        @media (min-width: 1024px) {
          .bg-dotted-pattern {
            background-size: 30px 30px;
          }
        }
      `}</style>
    </div>
  )
}

export default AuthTabs
