import React from 'react'
import { useSelector } from 'react-redux'
import Courses from './Courses';

const Home = () => {
  const {status, userData} = useSelector((state)=>state.user);

//   console.log("home", userData);
//   if(userData) return <p>Loading.....</p>;
  return (
    <>  
        <Courses/>
    </>
  )
}

export default Home