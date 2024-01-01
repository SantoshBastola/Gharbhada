import React, { useState } from 'react';
import { SearchIcon, SunIcon, MoonIcon } from "@heroicons/react/outline";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from "../store/themeSlice";
import Gharbhada from "../public/images/gharbhada.png";
import { useNavigate, createSearchParams } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector(state => state.theme);
  const { currentUser } = useSelector(state => state.user);
  const [search, setSearch] = useState("");
  const handleSunClick = () => {
    localStorage.setItem("rental-theme", "light");
    dispatch(setTheme("light"));
  };
  const handleMoonClick = () => {
    localStorage.setItem("rental-theme", "dark");
    dispatch(setTheme("dark"));
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate({
      pathname: "/allProperties",
      search: `?${createSearchParams({
        q: search
      })}`
    });
    setSearch("");
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className='flex dark:bg-neutral-900 dark:text-gray-100 bg-gray-50 items-center justify-between space-x-10 px-12 py-1.5 sticky top-0 shadow dark:shadow dark:shadow-slate-800 z-20'>
      {/* left section  */}
      <Link to="/">
        <div className='shrink-0 cursor-pointer flex items-center space-x-4'>
          <div className='h-12'>
            <img src={Gharbhada} alt="gharbhada" className='h-12 w-12' />
          </div>
          <p className='capitalize text-2xl font-medium text-red-500'>gharbhada</p>
        </div>
      </Link>
      {/* center section  */}
      <form onSubmit={handleSearch} className="grow flex relative rounded-md overflow-hidden items-center">
        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
        </div>
        <input type="text" onChange={handleSearchChange} value={search} placeholder="search.." className="bg-slate-100 dark:bg-neutral-800 block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-md border-2 focus:ring-slate-900 focus:border-slate-900 dark:focus:border-slate-400 dark:focus:ring-slate-400" />
      </form>

      {/* right section  */}
      <div className='shrink-0 flex space-x-6 items-center'>
        <Link to="/addProperty">
          <div className='navbar__links'>add property</div>
        </Link>
        <Link to="/allProperties">
          <div className='navbar__links'>all properties</div>
        </Link>
        <div className='flex items-center space-x-3'>
          {mode === "dark" ? (
            <div className='cursor-pointer transition-all duration-[400ms] ease-in'>
              <SunIcon onClick={handleSunClick} className='h-6 w-6' />
            </div>
          ) : (
            <div className='cursor-pointer transition-all duration-[400ms] ease-in'>
              <MoonIcon onClick={handleMoonClick} className='h-6 w-6' />
            </div>
          )}
        </div>

        {currentUser ? (
          <Link to="/profile/profile">
            <div className='flex items-center space-x-2'>
              <div className='h-9 w-9 flex items-center justify-center border-[2px] rounded-full border-gray-600 dark:border-gray-300 cursor-pointer'>
                <img className='h-8 w-8 rounded-full object-cover' src={currentUser.images[0].url} alt={currentUser.username} />
              </div>
              <p className='capitalize'>{currentUser.username}</p>
            </div>
          </Link>
        ) : (
          <Link to="/register">
            <button className='text-lg green--btn capitalize'>Sign Up</button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar;