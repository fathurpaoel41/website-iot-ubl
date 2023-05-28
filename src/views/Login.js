import React, { useState, useEffect } from "react";
import iotImage from "../assets/img/iot.jpg"; // Ubah path gambar sesuai dengan lokasi gambar Anda
import { database, app } from "config/firebase";
import {
  ref,
  get,
  update,
} from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import * as yup from 'yup';
import { Spinner } from "reactstrap"

function Login() {
  const [submitting, setSubmitting] = useState(true);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorLogin, setErrorLogin] = useState(false);
  const [spin, setSpin] = useState(false);

  const auth = getAuth(app);

  const validationSchema = yup.object().shape({
    email: yup.string().email('Email tidak valid').required('Email harus diisi'),
    password: yup.string().min(6, 'Password minimal 6 karakter').required('Password harus diisi')
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    validationSchema
      .validateAt(name, { [name]: value })
      .then(() => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: undefined, // Reset error untuk field yang valid
        }));
        setSubmitting(false)
      })
      .catch((err) => {
        setSubmitting(true)
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: err.message, // Set error untuk field yang tidak valid
        }));
      });
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSpin(true)
    setTouched({
      email: true,
      password: true,
    });

    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        // Lakukan tindakan lanjutan, seperti mengirim data ke server
        console.log('Data formulir:', values);
        setErrors({}); // Reset state errors ketika validasi berhasil
        setSubmitting(true);
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            let lgDate = new Date();

            const userRef = ref(database, "user/" + user.uid);

            get(userRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const userData = snapshot.val();
                  // Lakukan sesuatu dengan data yang diambil, misalnya tampilkan di konsol
                  localStorage.setItem("datauser", JSON.stringify(userData))
                  const currentTime = new Date().getTime();
                  localStorage.setItem("timeout", currentTime + (60 * 60 * 1000))
                } else {
                  // Data tidak ditemukan
                  console.log("Data tidak ditemukan.");
                }
              })
              .catch((error) => {
                // Penanganan kesalahan saat mengambil data
                console.error(error);
              });

            update(ref(database, "user/" + user.uid), {
              last_login: lgDate,
            })
              .then((r) => {
                // Data saved successfully!
                console.log("user telah sukses login = ");
                console.log(user.uid);
                localStorage.setItem("login", "true");
                window.location.reload();
              })
              .catch((error) => {
                //the write failed
                console.log(error);
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            setErrorLogin(true)
            setSpin(false)
          });
      })
      .catch((err) => {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setSubmitting(true)
        setErrors(validationErrors);
        setSpin(false)
      });
  };


  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="container">
        <div className="card rounded">
          <div className="card-body">
            <h1 className="text-center mb-4">Dashboard IOT Smart Office</h1>
            <div className="text-center mt-4">
              <img
                src={iotImage}
                alt="IoT Image"
                style={{ maxWidth: "400px" }}
              />
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {touched.email && errors.email && <div>{errors.email}</div>}
                  </div>

                  <div className="mb-4">
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {touched.password && errors.password && <div>{errors.password}</div>}
                  </div>
                  {errorLogin ? (<><center>Email Dan Password Salah</center></>) : ""}
                  <button
                    className="btn btn-primary btn-lg mb-4 w-100"
                    type="submit"
                    disabled={submitting}
                  >
                    Sign in {spin ? <Spinner size="sm">Loading...</Spinner> : ""}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Login;
