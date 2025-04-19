import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import style from './Profile.module.css'
import { toast } from 'react-hot-toast'


import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
 signoutUserSuccess,
} from "../redux/user/userslice";

import { useDispatch } from "react-redux";
 
// import { useNavigate } from "react-router-dom";

export default function Profile() {

  const fileRef = useRef(null);
  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploaderror, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingerror, setShowLisitngError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
   

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    if (confirm("do you want to update your profile")) {
      console.log("update button is clicked");
      e.preventDefault();
       
      try {
        dispatch(updateUserStart());
        console.log(currentuser._id);
        const res = await fetch(`/api/user/update/${currentuser._id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log("updated data", data);
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }
        else{
           toast.success("user profile updated")
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (err) {
        dispatch(updateUserFailure(err.message));
      }
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete account ?");
  if (!confirmDelete) {
    // Call your delete function
    return
  }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentuser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } else {
        toast.success("account deleted successfully")
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignoutUser = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      else {
        dispatch(signoutUserSuccess(data));
        // navigate('/sign-in')

      }
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  }

   

  useEffect(() => {
    const showListing = async () => {
      try {
        setShowLisitngError(false);
        const res = await fetch(`api/user/listings/${currentuser._id}`);
        const data = await res.json();
        if (data.success === false) {
                showListingerror(true);
                return;
              }
              setUserListings(data);
              console.log(data);
              
            } catch (error) {
              setShowLisitngError(true);
    }};
     
    showListing();
  }, []);

  

  const handleListingDelete = async (listingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
  if (!confirmDelete) {
     
    return
  }
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        
      });
       const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      toast.success("blog deleted successfully")
      setUserListings((prev) => prev.filter((listing)=> listing._id !== listingId));
    

  } catch (error) {
    console.log(error.message)
      
  }
}

  return (
    <div className={`p-3 max-w-lg mx-auto ${style.container} `}>
      <h1 className="text-3xl font-semiblod text-center my-7 ">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 place-items-center">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        ></input>
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentuser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        ></img>

        <p className="text-sm self-center">
          {fileUploaderror ? (
            <span className="text-red-700">
              Error Image upload (image must be lass than 2mb){" "}
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{` Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          className="border p-3 "
          defaultValue={currentuser.username}
          id="username"
          onChange={handleChange}
        ></input>
        <input
          type="text"
          placeholder="email"
          className="border p-3 "
          defaultValue={currentuser.email}
          id="email"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          className="border p-3 "
          id="password"
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className={` ${style.button} p-3 uppercase `}
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          className={` ${style.button} p-3 uppercase `}
          to={"/create-listing"}
        >
          Create your blog
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5"> {error ? error : ""}</p>
       




      
      {
       userListings && userListings.length < 1 && <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow-md border border-gray-200 max-w-md mx-auto my-20">
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

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Blogs
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                {listing.imagesURLs[0] && <img
                  src={listing.imagesURLs[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                /> }
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.title}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
