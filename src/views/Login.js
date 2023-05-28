import React, { useState } from "react";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);

  const onSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
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
              localStorage.setItem("datauser",JSON.stringify(userData))
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
            alert("user telah sukses login = ");
            console.log(user.uid);
            localStorage.setItem("login", "true");
            window.location.reload();
          })
          .catch((error) => {
            //the write failed
            alert(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

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
                <div className="mb-4">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      onChange={changeEmail}
                    />
                  </div>
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
                      onChange={changePassword}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg mb-4 w-100"
                  onClick={onSubmit}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
