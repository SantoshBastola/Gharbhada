import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Navbar, ProfileSidebar, SetAppointmentBox } from '../components';
import { publicRequest } from '../request';

function ActiveAppointment({ appointment }) {
  return (
    <div className='w-[29rem] p-1.5 rounded-md ring-[1px] ring-gray-400 dark:text-gray-100 mx-auto mt-4'>
      <div className='w-max mx-auto mb-3'>
        <span>Appointment with </span>
        <span>{appointment.appointmentFor.username}</span>
      </div>
      <div className="flex items-center space-x-4">
        <img src={appointment.appointmentFor.images[0].url} alt="app" className='h-28 w-36 rounded' />
        <div className='self-start'>
          <div>
            <span>Appointment date: </span>
            <span>{appointment?.appointmentDate.substring(0, 10)}</span>
          </div>
          <div>
            <span>Appointment locaton: </span>
            <span>{appointment?.location}</span>
            <div className='mt-3'>
              <Link to={`/allProperties/${appointment?.property}`}>
                <p className='orange--btn w-max text-sm py-1 px-2'>show property</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileAppointment = () => {
  const { currentUser } = useSelector(state => state.user);
  const [foundUser, setFoundUser] = useState(undefined);
  const [appointment, setAppointment] = useState(undefined);

  useEffect(() => {
    const getUser = async () => {
      const res = await publicRequest.get(`/user/${currentUser._id}`, {
        headers: {
          "token": `bearer ${currentUser.accesstoken}`
        }
      });
      if (res?.status === 200) {
        setFoundUser(res.data);
      }
    }
    const getappointment = async () => {
      const res = await publicRequest.get(`/appointment/`, {
        headers: {
          "token": `bearer ${currentUser.accesstoken}`
        }
      });
      if (res?.status === 200) {
        setAppointment(res.data);
      }
    }
    getUser();
    getappointment();
  }, [currentUser._id]);
  return (
    <div>
      <Navbar />
      <main className='flex items-center'>
        <ProfileSidebar user={currentUser} />
        {foundUser === undefined ? <div></div> : (
          <div className='w-[1120px] flex space-x-2 min-h-[91vh] ml-64 bg-white shadow-inner ring-[1px] ring-gray-300 dark:ring-gray-700 dark:bg-neutral-800'>
            <div className='basis-1/2 border-r'>
              <h3 className='text-2xl text-center mt-4 dark:text-gray-100'>Active Appointments</h3>
              {(appointment===undefined || appointment.length === 0) && (
                <p className='w-96 mx-auto mt-3 h-48 grid place-items-center ring-[1px] ring-gray-300 rounded'>
                No any active appointment to show
              </p>
              )}
              {(appointment !== undefined) && appointment.map(app => (
                <ActiveAppointment appointment={app} />
              ))}
            </div>
            <div className='basis-1/2 border-r'>
              <h3 className='text-2xl text-center mt-4 dark:text-gray-100'>Assign Appointments</h3>
              {foundUser?.pendingAppointment.length === 0 && (
                <p className='w-96 mx-auto mt-3 h-48 grid place-items-center ring-[1px] ring-gray-300 rounded'>
                  No any pending appointment to show
                </p>
              )}
              {foundUser?.pendingAppointment.map((app, index) => (
                <div key={index}>
                  <SetAppointmentBox appointment={app} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProfileAppointment;