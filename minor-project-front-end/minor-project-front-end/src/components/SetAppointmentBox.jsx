import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import { useSelector } from "react-redux";

import { FormControl } from '../formComponent';
import { publicRequest } from "../request";

const SetAppointmentBox = ({ appointment }) => {
  const { propertyId, requestingId } = appointment;
  const { currentUser } = useSelector(state => state.user);
  const initialValues = {
    location: "",
    date: ""
  };
  const validationSchema = Yup.object({
    location: Yup.string().required("required"),
    date: Yup.date().required("required")
  });
  const handleSubmit = async (values, onSubmitProps) => {
    let newDate = new Date(values.date).toISOString();
    const res = await publicRequest.post(`/property/${propertyId._id}/appointment/${appointment._id}`, {
      location: values.location,
      date: newDate
    }, {
      headers: {
        "token": `bearer ${currentUser.accesstoken}`
      }
    })
    if(res?.status === 200) {
      onSubmitProps.resetForm();
      window.location.reload();
    }
  };
  if (appointment === undefined) return <div></div>;
  return (
    <div className='w-[29rem] rounded-md ring-[1px] ring-gray-400 dark:text-gray-100 mx-auto mt-4'>
      <div className="flex items-center">
        <Link to={`/allproperties/${propertyId._id}`}>
          <div className="basis-1/2 p-1.5">
            <img src={propertyId.images[0].url} alt="name" className='h-[130px] rounded-sm w-[210px]' />
            <p className='px-2'>{propertyId.propertyName}</p>
            <p className='text-xs px-2 font-medium'>
              located at {propertyId.propertyLocation}
            </p>
          </div>
        </Link>
        <div className="basis-1/2 ml-2 p-1.5">
          <div className="w-20 h-20 rounded-full ml-auto mb-6">
            <img src={requestingId.images[0].url} alt="name" className='h-20 object-center rounded-full w-20' />
          </div>
          <p className="px-2 text-right text-xs text-gray-500">Requested By:</p>
          <p className='px-2 text-right'>{requestingId.username}</p>
          <p className='px-2 text-right text-xs font-medium'>email: {requestingId.email}</p>
        </div>
      </div>

      {/* form  */}
      <div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched }) => (
            <Form>
              <div className='flex flex-col -space-y-5'>
                <FormControl e={errors.location} t={touched.location} control="input" type="text" name="location" label="location" placeholder="enter location" />
                <FormControl e={errors.date} t={touched.date} control="input" type="date" name="date" label="date" placeholder="enter date" />
              </div>
              <div className='px-4 py-1.5 w-max ml-auto'>
                <button type='submit' className='green--btn'>Set appointment</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SetAppointmentBox;