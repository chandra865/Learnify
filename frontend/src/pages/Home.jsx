import React from 'react'
import { useSelector } from 'react-redux'
import Courses from './Courses';
import Hero from '../component/Hero';
import Categories from '../component/Categories';
import WhyChooseUs from '../component/WhyChooseUs';

const Home = () => {
  const {status, userData} = useSelector((state)=>state.user);

  return (
    <> 
        <Hero/>
        <Courses/>
        <Categories/>
        <WhyChooseUs/>
    </>
  )
}

export default Home