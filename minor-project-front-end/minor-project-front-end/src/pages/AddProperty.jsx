import React, { useState } from 'react';
import * as Yup from "yup";
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router';
import _ from "lodash";
import { ArrowSmUpIcon } from '@heroicons/react/outline';
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { AddPropertyListbox, Navbar, AdditionalModal } from '../components';
import { FormControl } from '../formComponent';
import { categoryOptions, propertyFacing, propertyFor, pageVariants } from '../data';
import { publicRequest } from "../request";
import { setExtraModal } from '../store/utilitiesSlice';

const AddProperty = () => {
  const { extraModalVisible } = useSelector(state => state.utils);
  const { accesstoken } = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState([]);
  const [a, setA] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [category, setCategory] = useState("house");
  const navigate = useNavigate();

  const propertyInitialValues = {
    propertyName: "",
    propertyHeading: "",
    propertyLocation: "",
    rooms: 1,
    bedRoom: "",
    kitchen: "",
    hall: "",
    category: `${category}`,
    price: "",
    propertyImages: "",
    propertyArea: "",
    additionalFeatures: "",
    propertyFacing: "",
    propertyType: `${propertyFor[0]}`,
  };

  const validationSchema = Yup.object({
    propertyName: Yup.string().required("Required"),
    propertyLocation: Yup.string().required("Required"),
    rooms: Yup.number().required("Required").min(1, "please enter room more than 1").max(11, "you cannot save more than 11 rooms"),
    category: Yup.string().required("Required"),
    price: Yup.string().required("Required"),
    propertyImages: Yup.string().required("You must upload at least one image"),
    propertyType: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, onSubmitProps) => {
    dispatch(setExtraModal());
    const asArray = Object.entries(values);
    const filtered = asArray.filter(([_, value]) => value !== '');
    const fd = new FormData();
    _.forEach(filtered, value => {
      fd.append(value[0], value[1]);
    });
    _.forEach(a, file => {
      fd.append("images", file);
    });
    const res = await publicRequest.post("/property/add", fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "token": `bearer ${accesstoken}`
      }
    });
    if (res?.status === 200) {
      console.log(res?.data);
      dispatch(setExtraModal());
    }
    onSubmitProps.setSubmitting(false);
    setSelectedFile([]);
    onSubmitProps.resetForm();
  };

  const selectRooms = (e, setFieldValue, text) => {
    setFieldValue(text, e);
  };

  const handleCategoryChange = (e) => {
    setCategory(e);
  };

  const addImageToPost = (e, setFieldValue) => {
    let oneImage = [];
    _.forEach(e.target.files, file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (readrEvent) => {
        oneImage.push(readrEvent.target.result);
      }
    });
    setSelectedFile(oneImage);
    setFieldValue("propertyImages", e.target.value);
    setA(e.target.files);
    setShowImages(false);
  };

  return (
    <motion.div
      transition={{ when: "beforeChildren" }}
      className='min-h-screen min-w-[100vw] bg-gray-50 dark:bg-black dark:bg-opacity-80 dark:text-gray-200 pb-8'>
      {/* navbar  */}
      <Navbar />

      <motion.div variants={pageVariants} initial="hidden" animate="visible">

        {/* select category  */}
        <div className='w-[55vw] mx-auto mb-4 flex space-x-10 items-end mt-5'>
          <AddPropertyListbox options={categoryOptions} onChange={handleCategoryChange} category="selectCategory" />
          <p className='text-xl font-medium'>Add {category === "apartment" ? "an" : "a"} {category} for rent or sale</p>
        </div>

        {/* main form for adding new property into the database  */}
        <main className='w-[55vw] bg-white dark:bg-neutral-800 mx-auto ring-1 ring-gray-300 dark:ring-gray-600 rounded-md px-10 py-3'>
          <Formik enableReinitialize={true} initialValues={propertyInitialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
              <Form className='flex flex-col space-y-3'>
                {/* property name  */}
                <FormControl e={errors.propertyName} t={touched.propertyName} control="propertyInput" type="text" name="propertyName" label="property name" placeholder="enter property name" />

                {/* property heading  */}
                <FormControl e={errors.propertyHeading} t={touched.propertyHeading} control="propertyInput" type="text" name="propertyHeading" label="property heading" placeholder="enter property heading" />

                {/* property location  */}
                <FormControl e={errors.propertyLocation} t={touched.propertyLocation} control="propertyInput" type="text" name="propertyLocation" label="property location" placeholder="enter property location" />

                {/* property area  */}
                {(category === "house" || category === "apartment") && (
                  <FormControl e={errors.propertyArea} t={touched.propertyArea} control="propertyInput" type="text" name="propertyArea" label="property area" placeholder="area in sq.km" />
                )}

                {/* property price  */}
                <FormControl e={errors.price} t={touched.price} control="propertyInput" type="number" name="price" label="price" placeholder="enter price" />

                {/* property rooms */}
                {category !== "shutter" && (
                  <FormControl e={errors.rooms} t={touched.rooms} control="propertyInput" type="number" label="number of rooms" name="rooms" min={0} />
                )}

                {(category === "house" || category === "apartment") && (
                  <>
                    {/* bedrooms  */}
                    <FormControl control="propertyInput" type="number" name="bedRoom" label="bedroom" min={1} max={5} />

                    {/* kitchen  */}
                    <FormControl control="propertyInput" type="number" name="kitchen" label="kitchen" min={1} max={3} />

                    {/* hall  */}
                    <FormControl control="propertyInput" type="number" name="hall" label="hall" min={1} max={3} />
                  </>
                )}

                {category === "house" && (
                  // property facing 
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='capitalize'>propery facing:</p>
                    </div>
                    <AddPropertyListbox options={propertyFacing} onChange={(e) => selectRooms(e, setFieldValue, "propertyFacing")} />
                  </div>
                )}


                {/* propery categories  */}
                <FormControl e={errors.category} t={touched.category} control="propertyInput" type="text" name="category" label="category" value={category} readOnly />

                {/* property for rent or sale  */}
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='capitalize'>rent or sale:</p>
                  </div>
                  <AddPropertyListbox options={propertyFor} onChange={(e) => selectRooms(e, setFieldValue, "propertyType")} />
                </div>

                {/* property images  */}
                <div className='flex flex-col'>
                  <FormControl e={errors.profile} t={touched.profile} control="propertyMultipleFile" type="file" name="propertyImages" id="profile" onChange={(e) => addImageToPost(e, setFieldValue)} label="property images" placeholder="select file from device" multiple />
                  {values.propertyImages && (
                    <div className="w-full">
                      <button type='button' className='btn-outline ml-auto flex space-x-2 items-center mt-2' onClick={() => setShowImages(!showImages)}>
                        <p>
                          {showImages ? "Hide images" : "Show images"}
                        </p>
                        <ArrowSmUpIcon className={`h-5 w-5 transform ${showImages ? "rotate-0" : "rotate-180"} transition-all duration-250 ease-in text-gray-600 dark:text-gray-300`} />
                      </button>
                    </div>
                  )}
                  {showImages && (
                    <motion.div
                      initial={{ y: 90, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeIn" }}
                      className="flex space-x-1 justify-end items-center flex-wrap self-end pt-2">
                      {selectedFile.length > 0 && selectedFile?.map((a, id) => (
                        <div key={id} className='p-[1.5px] rounded-md ml-auto dark:ring-[1px] dark:ring-gray-400'>
                          <img src={a} alt={values.username} className="cursor-pointer h-36 w-28 rounded-md object-cover" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* additional features  */}
                <FormControl control="textarea" rows={6} label="Description" name="additionalFeatures" placeholder="enter extra features like wifi, water , hot water and so on" />

                {/* submit button  */}
                <button type='submit' className='self-end mr-4 green--btn capitalize !mt-3'>add property</button>
              </Form>
            )}
          </Formik>
          <div>
            <button onClick={() => { navigate(-1) }} className='blue--btn'>Go Back</button>
          </div>
        </main>
      </motion.div>
      {extraModalVisible && (
        <div className='fixed top-0 left-0 z-20'>
          <AdditionalModal content="adding property" type="add property" />
        </div>
      )}
    </motion.div >
  )
}

export default AddProperty;