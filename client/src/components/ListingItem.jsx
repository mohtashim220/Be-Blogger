import React from 'react';
import { Link } from 'react-router-dom';

export default function ListingItem({ listing }) {
 
  const formattedDate = new Date(listing.updatedAt).toLocaleDateString();

  return (
    <div className="mt-10 flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 bg-white">
      {listing.imagesURLs[0] && <img
        src={listing.imagesURLs[0]}
        alt="listing cover"
        className="w-full lg:w-1/3 h-60 object-cover"
      /> }

      <div className="flex flex-col justify-between p-5 w-full">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
            {listing.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.content}
          </p>
        </div>

        {/* Date and View Button in Same Line */}
        <div className="flex items-center justify-between mt-2">
          {listing.postBy && <span className="text-sm text-black-500">Posted By- {listing.postBy}</span> }
          <span className="text-sm text-black-500">Posted on {formattedDate}</span>
          <Link
            to={`/listing/${listing._id}`}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
