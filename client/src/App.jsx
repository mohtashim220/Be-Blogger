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
        <Route path="https://be-blogger-api.vercel.app" element={<Home/>}></Route>
        <Route path="https://be-blogger-api.vercel.app/sign-in" element={<SignIn/>}></Route>
        <Route path="https://be-blogger-api.vercel.app/sign-up" element={<SignUp/>}></Route>
        <Route path="https://be-blogger-api.vercel.app/about" element={<About />}></Route>
        <Route path="https://be-blogger-api.vercel.app/search" element={<Search/>}></Route>
        <Route path="https://be-blogger-api.vercel.app/home" element={<Home/>}></Route>
        <Route path="https://be-blogger-api.vercel.app/listing/:listingId" element={<Listing />}></Route>
        <Route element={<PrivateRoute/>}>
          <Route path="https://be-blogger-api.vercel.app/profile" element={<Profile />}></Route>
          <Route path="https://be-blogger-api.vercel.app/create-listing" element={<Createlisting />}></Route>
          <Route path="https://be-blogger-api.vercel.app/update-listing/:listingId" element={<UpdateListing />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    
  )
}
