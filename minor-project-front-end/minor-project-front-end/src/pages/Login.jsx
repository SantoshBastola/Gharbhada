import React, { useState } from 'react';
import { Formik, Form } from "formik";
import { useNavigate } from 'react-router';
import * as Yup from "yup";
import Gharbhada from "../public/images/gharbhada.png";
import _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';

import { FormControl } from "../formComponent";
import { loginInitialValues } from '../data';
import { login, signUp } from '../store/apiCalls';
import { loginStart, loginSuccess, loginFailed } from '../store/userSlice';
import { publicRequest } from '../request';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const { isLoggedIn } = useSelector(state => state.user);
  const [a, setA] = useState([]);

  let validationSchema;
  if (isSignUp) {
    validationSchema = Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      firstName: Yup.string().required("Required"),
      phoneNumber: Yup.number().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().required("Required").matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "invalid email format"),
    })
  } else {
    validationSchema = Yup.object({
      email: Yup.string().required("Required").matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "invalid email format"),
      password: Yup.string().required("Required"),
    })
  }

  const handleSubmit = async (values, onSubmitProps) => {
    if (isSignUp) {
      console.log(values);
      console.log("new user added and signed up into the app");
      const fd = new FormData();
      Object.entries(values).forEach(value => {
        fd.append(value[0], value[1]);
      })
      fd.append("image", a);
      // signUp(dispatch, fd);
      dispatch(loginStart());
      const res = await publicRequest.post("/register", fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      if (res?.status === 200) {
        dispatch(loginSuccess(res?.data));
        navigate(-1);
        setSelectedFile(null);
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm();
      } else {
        dispatch(loginFailed());
      }
    } else {
      let a = {
        email: values.email,
        password: values.password
      };
      login(dispatch, a);
      navigate(-1);
      setSelectedFile(null);
      onSubmitProps.setSubmitting(false);
      onSubmitProps.resetForm();
    }
  };

  const addImageToPost = (e, setFieldValue) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    };
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
    setFieldValue("profile", e.target.value);
    setA(e.target.files[0]);
  };

  return (
    <div className='min-h-screen min-w-[100vw] pt-5 pb-20 bg-white dark:bg-black dark:bg-opacity-80 dark:text-gray-200'>
      <div className='h-20 w-full mb-3'>
        <img src={Gharbhada} alt="Gharbhada" className='mx-auto w-20' />
      </div>
      <div className='text-center mb-6'>
        <p className='text-2xl'>LogIn to Gharbhada</p>
      </div>
      <div className="max-w-sm mx-auto bg-gray-50 dark:bg-neutral-800 border-2 border-gray-300 rounded-md shadow-inner dark:border-gray-600">
        <Formik initialValues={loginInitialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, setFieldValue, values }) => (
            <Form className='flex flex-col -space-y-7'>
              <FormControl e={errors.email} t={touched.email} control="input" type="email" name="email" label="Email" placeholder="enter email" />
              {isSignUp && (
                <FormControl e={errors.firstName} t={touched.firstName} control="input" type="text" name="firstName" label="first Name" placeholder="enter firstname" />
              )}
              {isSignUp && (
                <FormControl e={errors.lastName} t={touched.lastName} control="input" type="text" name="lastName" label="Last Name" placeholder="enter lastName" />
              )}
              {isSignUp && (
                <FormControl e={errors.username} t={touched.username} control="input" type="text" name="username" label="UserName" placeholder="enter username" />
              )}
              {isSignUp && (
                <FormControl e={errors.phoneNumber} t={touched.phoneNumber} control="input" type="number" name="phoneNumber" label="Phone Number" placeholder="enter phoneNumber" />
              )}
              <FormControl e={errors.password} t={touched.password} control="input" type="password" name="password" label="Password" placeholder="enter password" />
              {isSignUp && (
                <>
                  <FormControl e={errors.profile} t={touched.profile} control="file" type="file" name="profile" id="profile" onChange={(e) => addImageToPost(e, setFieldValue)} label="ProfileImg" placeholder="select file from device" multiple />
                  {selectedFile && (
                    <div className='px-4 py-5 rounded-md mx-auto'>
                      <img src={selectedFile} alt={values.username} className="cursor-pointer h-36 w-28 rounded-md object-cover" onClick={() => { setSelectedFile(null); setFieldValue("profile", "") }} />
                    </div>
                  )}
                </>
              )}
              <div className='flex space-x-2 items-center pt-3 pb-4 pl-4'>
                <p className='text-sm text-gray-700 dark:text-gray-500'>{isSignUp ? "Already have an account" : "Don't have an account"}</p>
                <p className='font-medium text-lg cursor-pointer' onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Login" : "Signup"}</p>
              </div>
              <button type='submit' className='self-end mr-4 green--btn'>{isSignUp ? "SignUp" : "LogIn"}</button>
            </Form>
          )}
        </Formik>
        <div className='pl-4 pb-4'>
          <button onClick={() => { navigate(-1) }} className='blue--btn'>Go Back</button>
        </div>
      </div>
    </div>
  )
};

export default Login;