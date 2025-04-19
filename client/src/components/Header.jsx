import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import style from './Header.module.css'
import { useEffect, useState } from 'react';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentuser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log("handlesubmit is called");
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    urlParams.set('searchTerm', searchTerm);
    console.log(searchTerm);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`);

  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get('searchTerm');
    if (searchTermFormUrl) {
      setSearchTerm(searchTermFormUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
  <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-4 py-3">
    
    {/* Logo */}
    <Link to="/" className="flex items-center mb-2 sm:mb-0">
      <h1 className="font-extrabold text-white text-2xl tracking-tight">
        <span className="text-indigo-400">Be</span>
        <span>Blogger</span>
      </h1>
    </Link>

    {/* Search */}
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-gray-800 px-3 py-2 rounded-full text-white w-full sm:w-auto mb-2 sm:mb-0"
    >
      <FaSearch className="text-white mr-2" />
      <button type="submit" className="text-sm whitespace-nowrap">
        Find Your Favourite Blogs
      </button>
    </form>

    {/* Navigation */}
    <ul className="flex items-center gap-6">
      <Link to="/home">
        <li className="hidden sm:inline text-white hover:text-indigo-400 transition-colors duration-200">
          Home
        </li>
      </Link>
      <Link to="/about">
        <li className="hidden sm:inline text-white hover:text-indigo-400 transition-colors duration-200">
          About
        </li>
      </Link>
      <Link to="/profile">
        {currentuser ? (
          <img
            className="rounded-full h-8 w-8 object-cover border-2 border-indigo-400 hover:scale-105 transition-transform duration-200"
            src={currentuser.avatar}
            alt="profile"
          />
        ) : (
          <li className="text-white hover:text-indigo-400 transition-colors duration-200">
            Sign In
          </li>
        )}
      </Link>
    </ul>
  </div>
</header>

  );
}
