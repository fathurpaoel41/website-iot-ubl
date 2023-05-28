/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { data } from "jquery";
import React, { useEffect, useState, useRef } from "react";
import { database, app } from "config/firebase";
import { getDatabase, ref, onValue, off, get, set } from "firebase/database";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Row,
  Col, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Spinner
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import * as yup from 'yup'


function User() {
  const [dataUser, setDataUser] = useState(null)
  const [modal, setModal] = useState(false);
  const notificationAlert = useRef();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  //validasi 
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    passwordConfirmation: "",
  })

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(true);
  const [spin, setSpin] = useState(false);
  const validationSchema = yup.object().shape({
    oldPassword: yup.string().min(6, 'Password minimal 6 karakter').required('Password Lama Harus Diisi'),
    newPassword: yup.string().min(6, 'Password minimal 6 karakter').required('Password Baru Harus diisi'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Konfirmasi password tidak sesuai')
      .required('Konfirmasi password harus diisi'),
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

        setSubmitting(false);
      })
      .catch((err) => {
        setSubmitting(true);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: err.message, // Set error untuk field yang tidak valid
        }));
      });

  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setSpin(true)
    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        // Lakukan tindakan lanjutan, seperti mengirim data ke server
        console.log(values)

        const auth = getAuth(app);

        signInWithEmailAndPassword(auth, dataUser.email, values.oldPassword)
          .then((userCredential) => {
            const user = userCredential.user;

            updatePassword(user, values.newPassword)
              .then(() => {
                console.log('Password berhasil diubah');
                notify("Password Berhasil Diubah", "primary");
                setModal(!modal)
                setSpin(false)
              })
              .catch((error) => {
                notify("Password Gagal Diubah", "danger");
                setModal(!modal)
                setSpin(false)
                console.error('Gagal mengubah password:', error);
              });
          })
          .catch((error) => {
            notify("Password Gagal Diubah", "danger");
            setModal(!modal)
            setSpin(false)
            console.error('Gagal melakukan masuk:', error);
          });

        setErrors({}); // Reset state errors ketika validasi berhasil
        setSubmitting(true);
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
  //validasi selesai


  useEffect(() => {
    const getDataUserLocal = JSON.parse(localStorage.getItem("datauser"))
    setDataUser(getDataUserLocal)
  }, [])

  const toggle = () => setModal(!modal);
  const changeOldPassword = (e) => setOldPassword(e.target.value)
  const changeNewPassword = (e) => setNewPassword(e.target.value)
  const changePasswordConfirmation = (e) => setPasswordConfirmation(e.target.value)

  //Alert
  const notify = (message, color) => {
    var options = {};
    options = {
      place: "tr",
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: color,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 3
    };
    notificationAlert.current.notificationAlert(options);
  };


  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <Modal isOpen={modal} toggle={toggle}>
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={toggle}>Buat Data User Baru</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="oldPassword">Masukan Password lama</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                placeholder="Masukan Passwod Lama"
                type="password"
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.oldPassword && errors.oldPassword && <div>{errors.oldPassword}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="newPassword">Masukan Password Baru</Label>
              <Input
                id="newPassword"
                name="newPassword"
                placeholder="Masukan Password Baru"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.newPassword && errors.newPassword && <div>{errors.newPassword}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Masukan Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Masukan Password Konfirmasi"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.confirmPassword && errors.confirmPassword && <div>{errors.confirmPassword}</div>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={submitting}>
              Submit {spin ? <Spinner size="sm">Loading...</Spinner> : ""}
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Row>
          <Col className="ml-auto mr-auto" md="8">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/mike.jpg")}
                    />
                    <h5 className="title">{dataUser == null ? "-" : dataUser.name}</h5>
                  </a>
                  <p className="description">{dataUser == null ? "-" : dataUser.email}</p>
                </div>
                <p className="description text-center">
                  Role : {dataUser == null ? "-" : dataUser.role}
                </p>
                <div onClick={toggle}><center><u style={{ cursor: "pointer" }}>Ganti Pasword</u></center></div>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
