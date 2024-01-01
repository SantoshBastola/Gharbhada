import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Banner, Navbar, ImageSlider, Modal } from "../components";
import { publicRequest } from '../request';
import { setAllProperties } from "../store/propertiesSlice";

const Home = () => {
  const { modalVisible } = useSelector(state => state.utils);
  const { propertyDetails } = useSelector(state => state.property);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllProperties = async () => {
      const res = await publicRequest.get("/property");
      if (res?.status === 200) {
        dispatch(setAllProperties(res?.data));
      }
    };
    getAllProperties();
  }, []);

  const home = propertyDetails?.filter(a => a.category === "house")
  const rooms = propertyDetails?.filter(a => a.category === "room")

  return (
    <div className='pb-6'>
      <Navbar />
      <Banner />
      {propertyDetails.length === 0 ? <div></div> :
        <div>
          <main className='mt-3'>
            <div className='mx-5 rounded-md shadow-md px-8 py-4 dark:bg-neutral-900 dark:text-gray-50 bg-white'>
              <div>
                <h3 className="home--headings">special offers: </h3>
                <ImageSlider swiperData={propertyDetails.slice(0, 10)} imagesView={4} />
              </div>
              {home && (
                <div>
                  <h3 className="home--headings">House available: </h3>
                  <ImageSlider swiperData={home?.slice(0, 10)} imagesView={4} />
                </div>
              )}
              {rooms && (
                <div>
                  <h3 className="home--headings">Room available: </h3>
                  <ImageSlider swiperData={rooms?.slice(0, 10)} imagesView={4} />
                </div>
              )}
            </div>
          </main>
          {modalVisible && (
            <div className='fixed top-0 left-0 z-20'>
              <Modal />
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default Home;