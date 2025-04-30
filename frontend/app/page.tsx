import HeroSection from '@/components/HeroSection'
import NavBar from '@/components/NavBar'
import React from 'react'

const HomePage = () => {
  return (
    <div className="bg-background text-textPrimary">
      <NavBar />
      <HeroSection />
    </div>
  )
}

export default HomePage
