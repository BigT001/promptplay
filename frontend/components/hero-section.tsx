"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

function HeroSection() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const typingTextRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setIsLoaded(true)

    // Start the typewriter effect after component mounts
    const typingText = typingTextRef.current
    const cursor = cursorRef.current

    if (typingText && cursor) {
      setTimeout(() => {
        typingText.classList.add("typing-animation")
        cursor.classList.add("cursor-animation")
      }, 800)
    }

    // Create floating code snippets animation
    const snippetsContainer = document.querySelector(".code-snippets")
    if (snippetsContainer) {
      const createCodeSnippet = () => {
        const codeElements = [
          "if (story.hasBlockage())",
          "while (creating) {",
          "function enhance(story) {",
          "return inspiration;",
          "const ideas = AI.generate();",
          "plot.refine(character);",
          "scene.visualize();",
          "AI.collaborate(writer);",
          "</script>",
          "<narrative>",
          "dialogue.improve()",
        ]

        const snippet = document.createElement("div")
        snippet.className = "code-snippet"
        snippet.textContent = codeElements[Math.floor(Math.random() * codeElements.length)]

        // Improved random positioning with better distribution
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 40 + 20 // 20-60% from center
        const x = 50 + Math.cos(angle) * radius
        const y = 50 + Math.sin(angle) * radius

        snippet.style.cssText = `
          left: ${x}%;
          top: ${y}%;
          opacity: 0;
          transform: translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.7}) rotate(${Math.random() * 30 - 15}deg);
        `

        snippetsContainer.appendChild(snippet)

        // Trigger reflow for smooth animation
        snippet.offsetHeight

        // Fade in
        requestAnimationFrame(() => {
          snippet.style.opacity = `${Math.random() * 0.3 + 0.1}`
          snippet.style.transition = "opacity 1s ease, transform 8s ease"
          snippet.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.3 + 0.5}) rotate(${Math.random() * 45 - 22.5}deg)`
        })

        // Remove after animation
        setTimeout(() => {
          snippet.style.opacity = "0"
          snippet.style.transform += " translateY(-50px)"
          setTimeout(() => snippet.remove(), 1000)
        }, Math.random() * 4000 + 3000)
      }

      // Create initial snippets with staggered timing
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createCodeSnippet(), i * 300)
      }

      // Create new snippets periodically with smoother timing
      const interval = setInterval(() => {
        if (document.visibilityState === "visible" && Math.random() > 0.3) {
          createCodeSnippet()
        }
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [])

  const navigateToAuth = () => {
    router.push("/auth")
  }

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* AI/Code-themed animated background */}
      <div
        className={`absolute inset-0 opacity-0 ${isLoaded ? "animate-fadeIn" : ""}`}
        style={{ background: "radial-gradient(circle at center, rgba(16,24,39,1) 0%, rgba(0,0,0,1) 100%)" }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>

      {/* Floating code snippets container */}
      <div className="code-snippets absolute inset-0 pointer-events-none z-0"></div>

      {/* Glowing orb representing AI */}
      <div
        className={`absolute opacity-0 ${isLoaded ? "animate-orb-appear" : ""}`}
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(16,24,39,0) 70%)",
          filter: "blur(40px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      ></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center">
        {/* Hero Content */}
        <div className="text-center max-w-3xl mx-auto">
          <div
            className={`mb-2 text-blue-500 font-mono text-sm uppercase tracking-wider opacity-0 ${isLoaded ? "animate-fadeIn" : ""}`}
            style={{ animationDelay: "400ms" }}
          >
            AI-Powered Story Creation
          </div>

          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 leading-tight opacity-0 ${isLoaded ? "animate-slideUp" : ""}`}
            style={{ animationDelay: "600ms" }}
          >
            Empowering{" "}
            <div className="inline-flex relative">
              <span ref={typingTextRef} className="text-blue-500 typing-text">
                Storytelling
              </span>
              <span ref={cursorRef} className="typing-cursor">
                |
              </span>
            </div>{" "}
            Through AI
          </h1>

          <p
            className={`text-lg md:text-xl mb-10 text-gray-300 max-w-2xl mx-auto opacity-0 ${isLoaded ? "animate-fadeIn" : ""}`}
            style={{ animationDelay: "800ms" }}
          >
            Revolutionize your scriptwriting process with AI-powered tools. Overcome creative blocks, collaborate
            seamlessly, and craft compelling narratives effortlessly.
          </p>

          <div
            className={`flex flex-col sm:flex-row justify-center gap-4 opacity-0 ${isLoaded ? "animate-fadeIn" : ""}`}
            style={{ animationDelay: "1000ms" }}
          >
            <Button
              className="btn-primary relative overflow-hidden group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
              onClick={navigateToAuth}
            >
              <span className="relative z-10">Get Started Now</span>
              <div className="btn-glow"></div>
            </Button>

            <Button
              variant="outline"
              className="btn-secondary bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-6 py-3 rounded-lg"
            >
              Learn More
            </Button>
          </div>

          {/* AI Features Icons */}
          <div
            className={`mt-16 flex justify-center gap-8 opacity-0 ${isLoaded ? "animate-fadeIn" : ""}`}
            style={{ animationDelay: "1200ms" }}
          >
            {[
              { icon: "✍️", label: "Write" },
              { icon: "🔄", label: "Edit" },
              { icon: "💡", label: "Ideate" },
              { icon: "🤝", label: "Collaborate" },
            ].map((item, index) => (
              <div key={index} className="feature-icon">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for animations and styling */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease forwards;
        }
        
        .animate-orb-appear {
          animation: orbAppear 1.5s ease forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes orbAppear {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Typing animation */
        .typing-text {
          display: inline-block;
          overflow: hidden;
          border-right: none;
          white-space: nowrap;
          width: 0;
        }
        
        .typing-text.typing-animation {
          animation: typing 1.5s steps(12) forwards;
        }
        
        .typing-cursor {
          display: inline-block;
          color: #3b82f6;
          opacity: 0;
        }
        
        .typing-cursor.cursor-animation {
          animation: blinking 0.8s step-end infinite;
          opacity: 1;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blinking {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Code snippets */
        .code-snippet {
          position: absolute;
          font-family: monospace;
          font-size: 12px;
          color: rgba(59, 130, 246, 0.7);
          transition: opacity 2s ease;
          user-select: none;
          z-index: 1;
        }
        
        /* Buttons */
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }
        
        .btn-primary:active {
          transform: translateY(1px);
        }
        
        .btn-glow {
          position: absolute;
          top: -50%;
          left: -25%;
          width: 150%;
          height: 200%;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent
          );
          transform: translateX(-100%);
          transition: 0.5s;
        }
        
        .btn-primary:hover .btn-glow {
          transform: translateX(100%);
          transition: 0.5s;
        }
        
        .btn-secondary:hover {
          transform: translateY(-2px);
        }
        
        .btn-secondary:active {
          transform: translateY(1px);
        }
        
        /* Feature icons */
        .feature-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .feature-icon:hover {
          background-color: rgba(31, 41, 55, 0.6);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

export default HeroSection
