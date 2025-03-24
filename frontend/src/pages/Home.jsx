import React from 'react'
import { useSelector } from 'react-redux'
import Courses from './Courses';
import Hero from '../component/Hero';

const Home = () => {
  const {status, userData} = useSelector((state)=>state.user);

//   console.log("home", userData);
//   if(userData) return <p>Loading.....</p>;
  return (
    <> 
        <Hero/>
        <Courses/>
    </>
  )
}

export default Home