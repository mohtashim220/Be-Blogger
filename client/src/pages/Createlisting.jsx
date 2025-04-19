import React from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import  { toast } from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
 


export default function Creatlisting() {
  const { currentuser } = useSelector((state) => state.user);
  const [files, setfFiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imagesURLs: [],
    title: '',
    content: '',
  });

  const [imageUploadError, setImageUploadError] = useState(null);
  console.log(formData);
  console.log(formData.imagesURLs.length);


  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imagesURLs.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imagesURLs: formData.imagesURLs.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('image upload failed (5 mb max per image )');
        setUploading(false);
      });
    }
    else {
      setImageUploadError('you can only upload 6 images per Blog');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    setUploading(true);
    return new Promise((resolve, reject) => {
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
          // setFilePerc(Math.round(progress))
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imagesURLs: formData.imagesURLs.filter((_, i) => i !== index),
    })
  }
  
  const handleChange = (e) => {
  
 

    if ( e.target.type === 'textarea' || e.target.type === 'text') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
   


  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (formData.imagesURLs.length < 1) {
         
      //   setError('you must upload atleast one image');
      //   return
        
      // }
       
      
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,postBy:currentuser.username,
          userRef: currentuser._id
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      toast.success("blog created successfully")
      navigate(`/listing/${data._id}`)
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  

  return (
    <main className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-2xl mt-10 mb-10">
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-10">
        ✍️ Create Blog Post
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col lg:flex-row gap-10"
      >
        <div className="flex flex-col gap-6 flex-1">
          <input
            type="text"
            placeholder="Enter a blog title"
            className="border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            id="title"
            maxLength="100"
            minLength="4"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            type="textarea"
            placeholder="Write your blog content here..."
            className="w-full h-[400px] p-4 border border-gray-300 rounded-lg shadow-sm resize-y font-sans text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="content"
            required
            onChange={handleChange}
            value={formData.content}
          />
          </div>
           
           
           
 
           <div className="flex flex-col flex-1 gap-6">
          <div>
            <p className="font-semibold text-lg text-gray-800 mb-2">Images:</p>
            <div className="flex gap-4 items-center">
              <input
                onChange={(e) => setfFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {imageUploadError && (
              <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>
            )}
          </div>

          {formData.imagesURLs.length > 0 && (
            <div className="space-y-4">
              {formData.imagesURLs.map((url, index) => (
                <div
                  key={url}
                  className="flex items-center justify-between border rounded-md p-2 bg-gray-50"
                >
                  <img
                    src={url}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={loading || uploading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Posting" : "Post Your Blog"}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </form>
    </main>
  );
}
