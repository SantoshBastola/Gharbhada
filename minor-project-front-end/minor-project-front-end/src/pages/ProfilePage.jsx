import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar, ProfileSidebar } from '../components';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  return (
    <div>
      <Navbar />
      {!currentUser ? <div></div> : (
        <main>
          <ProfileSidebar user={currentUser} />
        </main>
      )}
    </div>
  )
}

export default ProfilePage;