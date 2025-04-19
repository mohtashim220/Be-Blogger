import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [Listings, setListings] = useState([]);
 
  SwiperCore.use([Navigation]);
  console.log(Listings);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/get");
        const data = await res.json();
         
        setListings(data);
        console.log(Listings.length)
         
      } catch (error) {
        console.log(error);
      }
    };
     
    fetchListings();
  }, []);

  return (
    <div>
      {
       Listings && Listings.length < 1 && <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow-md border border-gray-200 max-w-md mx-auto my-20">
       <h2 className="text-2xl font-bold text-slate-700 mb-4">
         No Blog Posted Yet
       </h2>
       <p className="text-slate-600 mb-6">Looks like you haven’t shared anything yet.</p>
       <Link
         to="/create-listing"
         className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition duration-300"
       >
         Post a Blog
       </Link>
     </div> }
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        { Listings && Listings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent blogs
              </h2>
               
            </div>
            <div className=" ">
              {Listings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
            
          </div>
        )}
         
      </div>
    </div>
  );
}
