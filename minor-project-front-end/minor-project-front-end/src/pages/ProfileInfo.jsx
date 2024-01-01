import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, ProfileSidebar, UpdateUser } from '../components';

const ProfileInfo = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  return (
    <div>
      <Navbar />
      <main className='flex items-center'>
        <ProfileSidebar user={currentUser} />
        <div className='w-[1120px] ml-64 min-h-[91vh] bg-white shadow-inner ring-[1px] ring-gray-300 dark:ring-gray-700 dark:bg-neutral-800 dark:text-gray-100'>
          <h4 className='w-max mx-auto text-2xl mt-3'>Welcome {currentUser.username}</h4>
          <div className="flex mt-8 items-center">
            <div className="basis-1/2 border-[2px] rounded-md mx-4 border-gray-300">
              <div className='w-max mx-auto my-4'>
                <img className='h-36 object-contain' src={currentUser.images[0].url} alt={currentUser.username} />
              </div>
              <div className='profile__info--box'>
                <span className='font-medium'>First Name: </span>
                <span>{currentUser.firstName}</span>
              </div>
              <div className='profile__info--box'>
                <span className='font-medium'>Last Name: </span>
                <span>{currentUser.lastName}</span>
              </div>
              <div className='profile__info--box'>
                <span className='font-medium'>Username: </span>
                <span>{currentUser.username}</span>
              </div>
              <div className='profile__info--box'>
                <span className='font-medium'>Email: </span>
                <span>{currentUser.email}</span>
              </div>
              <div className='profile__info--box'>
                <span className='font-medium'>Phone No: </span>
                <span>{currentUser.phoneNumber}</span>
              </div>
            </div>
            <div className="basis-1/2 border-[2px] rounded-md mr-4 border-gray-300">
              <UpdateUser />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfileInfo;