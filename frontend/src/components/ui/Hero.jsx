import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className='bg-linear-to-r from-blue-600 to-purple-600 text-white py-16'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid md:grid-cols-2 gap-8 items-center'>
                    <div >
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>Latest Electronics at Best Prices</h1>
                        <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge technology with unbeatable  deals on smartphones, laptops, and more!</p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Button variant='outline'
                                onClick={() => navigate("/products")}
                                className=' border-white text-blue-600 hover:bg-gray-300 cursor-pointer'>Shop Now</Button>
                            <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent '>View Deals</Button>
                        </div>
                    </div>
                    <div className='realtive '>
                        <img
                            src="/logohome.png"
                            alt="NexeraStore"
                            width={400}
                            height={300}
                            className="
                            rounded-lg 
    shadow-2xl 
    mt-15
    transition-all 
    duration-500 
    hover:scale-105 
    hover:rotate-1 
    hover:shadow-pink-500/50
    cursor-pointer
  "
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero