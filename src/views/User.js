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
} from "reactstrap";
import NotificationAlert from "react-notification-alert";


function User() {
  const [dataUser, setDataUser] = useState(null)
  const [modal, setModal] = useState(false);
  const notificationAlert = useRef();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");


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

  const onSubmit = () => {
    // Ubah Password
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, dataUser.email, oldPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        updatePassword(user, newPassword)
          .then(() => {
            console.log('Password berhasil diubah');
            notify("Password Berhasil Diubah", "primary");
            setModal(!modal)
          })
          .catch((error) => {
            notify("Password Gagal Diubah", "danger");
            setModal(!modal)
            console.error('Gagal mengubah password:', error);
          });
      })
      .catch((error) => {
        notify("Password Gagal Diubah", "danger");
        setModal(!modal)
        console.error('Gagal melakukan masuk:', error);
      });
  }

  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Buat Data User Baru</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="password_lama">Masukan Password lama</Label>
            <Input
              id="password_lama"
              name="password_lama"
              placeholder="Masukan Passwod Lama"
              type="password"
              onChange={changeOldPassword}
            />
          </FormGroup>
          <FormGroup>
            <Label for="pasword_baru">Masukan Password Baru</Label>
            <Input
              id="password_baru"
              name="password_baru"
              placeholder="Masukan Password Baru"
              type="password"
              onChange={changeNewPassword}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password_confirmation">Masukan Konfirmasi Password</Label>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Masukan Password Konfirmasi"
              type="password"
              onChange={changePasswordConfirmation}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
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
