import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from "react-redux";
import 'swiper/css/bundle';
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaWhatsapp,
  FaMapMarker,
} from "react-icons/fa";
 



let whatURL="";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams()
  const [listing, setListing] = useState(null);
      const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
   const [copied, setCopied] = useState(false);
   const [contact, setContact] = useState(false);
   const [formData, setFormData] = useState({});
   const { currentuser } = useSelector((state) => state.user);

   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: listing.listingId });
    console.log(formData);
    handleSubmit()
  };
   
  const handleSubmit = async (e) => {
    if (confirm("do you want to save this Blog")) {
      console.log("update button is clicked");
      e.preventDefault();
      console.log("currentuser is", currentuser);
      try {
        dispatch(updateUserStart());
        console.log(currentuser._id);
        const res = await fetch(`/api/user/update/${currentuser._id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({savings:listing.listingId}),
        });
        const data = await res.json();
        console.log("updated data", data);
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (err) {
        dispatch(updateUserFailure(err.message));
      }
    }
  };




  useEffect(() => {
    const fetchListing = async () => {
      
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await response.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
         
          return;
        }
        setListing(data);
        whatURL=` https://wa.me/${data.contact}?text= Hello I am interested in your property listed on MARG estate by name ${data.name}`
        console.log(data)
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  },[params.listingId])




  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
    {loading && (
      <p className="text-center text-2xl font-medium text-gray-700">Loading...</p>
    )}
    {error && (
      <p className="text-center text-2xl font-medium text-red-600">Something went wrong!</p>
    )}
  
    {!loading && !error && listing && (
      <div className="max-w-5xl mx-auto">
        
        {/* Blog Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {listing.title}
          </h1>
        </div>
  
        {/* Image Carousel */}
        {listing.imagesURLs && (
          <Swiper navigation className="rounded-lg shadow-md overflow-hidden mb-10">
            {listing.imagesURLs.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[350px] sm:h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
  
        {/* Blog Content */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-10 border border-gray-200">
          <div className="prose max-w-none text-gray-800">
            <p className="text-lg leading-relaxed whitespace-pre-line">{listing.content}</p>
          </div>
        </div>
      </div>
    )}
  </main>
  
  );
}
