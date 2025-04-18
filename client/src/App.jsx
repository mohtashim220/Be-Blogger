import React from 'react'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Createlisting from './pages/Createlisting';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';


export default function App() {
  return (
    <BrowserRouter>
  <Header />
      <Routes>  
        <Route path="/" element={<Home/>}></Route>
        <Route path="/sign-in" element={<SignIn/>}></Route>
        <Route path="/sign-up" element={<SignUp/>}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/search" element={<Search/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/listing/:listingId" element={<Listing />}></Route>
        <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create-listing" element={<Createlisting />}></Route>
          <Route path="/update-listing/:listingId" element={<UpdateListing />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    
  )
}
