import HeroSection from "@/components/hero-section"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      <HeroSection />
      <Footer />
    </main>
  )
}
