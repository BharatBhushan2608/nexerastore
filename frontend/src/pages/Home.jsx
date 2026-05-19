import { Hero } from '@/components/ui/Hero'
import Features from '@/components/ui/Features'
import React from 'react'
import Products from './Products'

const Home = () => {
  return (
    <div>
      <Hero />
      <Products/>
      <Features />
    </div>
  )
}

export default Home