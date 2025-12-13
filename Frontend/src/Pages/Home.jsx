import React from 'react'
import Hero from '../Components/Hero'
import MostPicked from '../Components/MostPicked'
import PopularRooms from '../Components/PopularRooms'
import TextReviews from '../Components/TextReviews'

function Home() {
  return (
    <div className='py-24'>
      <Hero/>
      <MostPicked/>
      <PopularRooms/>
      <TextReviews/>
    </div>
  )
}

export default Home