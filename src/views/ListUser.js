import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
// core components
import { Space, Table, Tag } from "antd";

//firebase
import { database, app } from "config/firebase";
import { getDatabase, ref, onValue, off, get, set } from "firebase/database";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from 'firebase/auth';
import NotificationAlert from "react-notification-alert";

export default function ListUser() {
  const [dataUser, setDataUser] = useState([]);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const auth = getAuth(app);
  const notificationAlert = React.useRef();
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  useEffect(() => {
    const databaseRef = ref(database);

    onValue(databaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        const dataArray = Object.keys(value.user).map((key) => {
          return { id: key, ...value.user[key] };
        });
        setDataUser(dataArray);
      } else {
        console.log("Tidak ada data yang tersedia.");
      }
    });
  }, []);

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

  const toggle = () => setModal(!modal);
  const changeName = (e) => setName(e.target.value)
  const changeEmail = (e) => setEmail(e.target.value)
  const changePassword = (e) => setPassword(e.target.value)
  const changeRole = (e) => setRole(e.target.value)

  const onSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          set(ref(database, "user/" + user.uid), {
            name: name,
            role: role,
            email: email,
            password: password
          })
            .then(() => {
              // Data saved successfully!
              notify("Data User Berhasil Dibuat", "primary");
              setModal(!modal)
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
  }

  return (
    <>
    <NotificationAlert ref={notificationAlert} />
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Buat Data User Baru</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Nama</Label>
            <Input
              id="name"
              name="name"
              placeholder="Masukan Nama User"
              type="text"
              onChange={changeName}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Masukan Email"
              type="email"
              onChange={changeEmail}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Masukan Password"
              type="password"
              onChange={changePassword}
            />
          </FormGroup>
          <FormGroup>
            <Label for="role">Role</Label>
            <Input id="role" name="select" type="select" onChange={changeRole}>
              <option value="administrator">administrator</option>
              <option value="eksekutor">eksekutor</option>
              <option value="viewer">viewer</option>
            </Input>
          </FormGroup>
          <Button color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">List Data User</CardTitle>
                <p className="card-category">
                  <Button color="primary" onClick={toggle}>
                    Buat Data Baru
                  </Button>
                </p>
              </CardHeader>
              <CardBody>
                <Table dataSource={dataUser} columns={columns} />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Footer
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
