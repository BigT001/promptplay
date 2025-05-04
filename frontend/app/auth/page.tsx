import AuthTabs from "@/components/auth-tabs"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"

export default function AuthPage() {
  return (
    <main className="min-h-screen flex flex-col bg-black overflow-hidden">
      <NavBar />
      <div className="flex-1 flex items-center justify-center">
        <AuthTabs />
      </div>
      {/* <Footer /> */}
    </main>
  )
}
