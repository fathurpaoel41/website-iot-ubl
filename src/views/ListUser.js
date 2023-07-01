import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap";
// core components
import { Table } from "antd";

//firebase
// import bcrypt from 'bcryptjs';
import { app, database } from "config/firebase";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { onValue, ref, set } from "firebase/database";
import NotificationAlert from "react-notification-alert";
import * as yup from 'yup';
// const salt = bcrypt.genSaltSync(10)

export default function ListUser() {
  const [dataUser, setDataUser] = useState([]);
  const [modal, setModal] = useState(false);
  const auth = getAuth(app);
  const notificationAlert = React.useRef();

  //untuk validation
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(true);
  const [spin, setSpin] = useState(false);
  const validationSchema = yup.object().shape({
    name: yup.string().required('Nama harus diisi'),
    role: yup.string().required('Role harus diisi'),
    email: yup.string().email('Email tidak valid').required('Email harus diisi'),
    password: yup.string().min(6, 'Password minimal 6 karakter').required('Password harus diisi'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Konfirmasi password tidak sesuai')
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

        if (name === 'password' || name === 'confirmPassword') {
          validationSchema
            .validate({ ...values, [name]: value }, { abortEarly: false })
            .then(() => {
              setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: undefined, // Reset error untuk field yang valid
              }));
              setTouched((prevTouched) => ({
                ...prevTouched,
                confirmPassword: false, // Reset touched untuk field yang valid
              }));
            })
            .catch((err) => {
              const validationErrors = {};

              err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
              });

              setErrors((prevErrors) => ({
                ...prevErrors,
                ...validationErrors, // Set error untuk field yang tidak valid
              }));
            });
        }

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
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true
    });

    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        // Lakukan tindakan lanjutan, seperti mengirim data ke server
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // const hashPassword = createMD5Hash(values.password)

            set(ref(database, "user/" + user.uid), {
              name: values.name,
              role: values.role,
              email: values.email,
              password: values.password
            })
              .then(() => {
                notify("Data User Berhasil Dibuat", "primary");
                setModal(!modal)
                setSpin(false)
              })
              .catch((error) => {
                alert(error);
                setSpin(false)
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
            setSpin(false)

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

  //sampai sini validationnya

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

  // const createMD5Hash = (password) => {
  //   return bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u')
  // }

  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <Modal isOpen={modal} toggle={toggle}>
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={toggle}>Buat Data User Baru</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Nama</Label>
              <Input
                id="name"
                name="name"
                placeholder="Masukan Nama User"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.name && errors.name && <div>{errors.name}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Masukan Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && <div>{errors.email}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Masukan Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && <div>{errors.password}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Password Konfirmasi</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Masukan Password Konfimasi"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
              />
              {touched.confirmPassword && errors.confirmPassword && <div>{errors.confirmPassword}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="role">Role</Label>
              <Input
                id="role"
                name="role"
                type="select"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {values.role == "" ? (<option value="-">--silahkan pilih role--</option>) : ""}
                <option value="administrator">administrator</option>
                <option value="eksekutor">eksekutor</option>
                <option value="viewer">viewer</option>
              </Input>
              {touched.role && errors.role && <div>{errors.role}</div>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={submitting}>
              Submit {spin ? <Spinner size="sm">Loading...</Spinner> : ""}
            </Button>
            <Button color="secondary" type="reset" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
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
