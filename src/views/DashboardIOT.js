import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Card,
  UncontrolledAlert,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import { NavLink } from "react-router-dom";

import { Space, Switch, Row as Rows, Col as Cols } from 'antd';

//firebase
import { database, app } from "config/firebase";
import { getDatabase, ref, onValue, off, get, set, update } from "firebase/database"
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function DashboardIOT() {
  const [data, setData] = useState([]);
  const [lampuRuangan1, setLampuRuangan1] = useState(false)
  const [lampuRuangan2, setLampuRuangan2] = useState(false)
  const [kipasRuangan1, setKipasRuangan1] = useState(false)
  const [kipasRuangan2, setKipasRuangan2] = useState(false)
  const [waterPump, setWaterPump] = useState(false)
  const notificationAlert = React.useRef();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [dataUser, setDataUser] = useState([])


  useEffect(() => {
    // handleRegistration()
    const databaseRef = ref(database);
    // const getDataLocalIot = JSON.parse(localStorage.getItem("iot"))
    // setData(getDataLocalIot)

    onValue(databaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const value = snapshot.val();

        const dataArray = Object.keys(value.user).map((key) => {
          return { id: key, ...value.user[key] };
        });
        console.log(dataArray);
        setData(value);
        // localStorage.setItem("iot",JSON.stringify(value))
        setLampuRuangan1(value.lampu_ruangan_1)
        setLampuRuangan2(value.lampu_ruangan_2)
        setKipasRuangan1(value.kipas_ruangan_1)
        setKipasRuangan2(value.kipas_ruangan_2)
        setWaterPump(value.water_pump)
      } else {
        console.log("Tidak ada data yang tersedia.");
      }
    });

    const getDataUserLocal = JSON.parse(localStorage.getItem('datauser'))
    setDataUser(getDataUserLocal)

    // return () => {
    //   off(databaseRef);
    // };
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

  const getTimeStamps = () => {
    const timestampSaatIni = Date.now();
    const tanggalSaatIni = new Date(timestampSaatIni);
    const tanggal = tanggalSaatIni.getDate();
    const bulan = tanggalSaatIni.getMonth() + 1; // Perhatikan bahwa bulan dimulai dari 0 (Januari) hingga 11 (Desember)
    const tahun = tanggalSaatIni.getFullYear();
    const jam = tanggalSaatIni.getHours();
    const menit = tanggalSaatIni.getMinutes();
    const detik = tanggalSaatIni.getSeconds();
    const timestampFormat = `${tanggal}-${bulan}-${tahun} ${jam}:${menit}:${detik}`;
    return timestampFormat
  }

  const addDataToFirestore = async (ref, data) => {
    try {
      const newDocRef = await addDoc(ref, data);
      // console.log('Dokumen berhasil ditambahkan dengan ID:', newDocRef.id);
    } catch (error) {
      console.error('Error menambahkan dokumen:', error);
    }
  }

  const changeSwitchLampuRuangan1 = () => {
    const getRef = ref(database, "lampu_ruangan_1");
    const collectionRef = collection(db, 'lampu_ruangan_1');
    if (getRef._repo.server_.connected_) {
      set(getRef, !lampuRuangan1)
        .then(() => {
          setLampuRuangan1(!lampuRuangan1)

          const value = `${!lampuRuangan1 ? "Nyalakan Lampu" : "Matikan Lampu"}`
          const obj = {
            aksi: value,
            timestamps: getTimeStamps(),
            user: dataUser.name
          }
          addDataToFirestore(collectionRef, obj)

          notify(`Lampu Ruangan 1 Berhasil Di ${!lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "primary");
        })
        .catch((error) => {
          notify(`Lampu Ruangan 1 Gagal Di ${lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
          console.log("Terjadi kesalahan:", error);
        });
    } else {
      notify(`Lampu Ruangan 1 Gagal Di ${lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
    }
  }

  const changeSwitchLampuRuangan2 = () => {
    const getRef = ref(database, "lampu_ruangan_2");
    const collectionRef = collection(db, 'lampu_ruangan_2');
    if (getRef._repo.server_.connected_) {
      set(getRef, !lampuRuangan2)
        .then(() => {
          setLampuRuangan2(!lampuRuangan2)

          const value = `${!lampuRuangan2 ? "Nyalakan Lampu" : "Matikan Lampu"}`
          const obj = {
            aksi: value,
            timestamps: getTimeStamps(),
            user: dataUser.name
          }
          addDataToFirestore(collectionRef, obj)

          notify(`Lampu Ruangan 2 Berhasil Di ${!lampuRuangan2 ? "Nyalakan" : "Matikan"}`, "primary");
        })
        .catch((error) => {
          notify(`Lampu Ruangan 2 Gagal Di ${lampuRuangan2 ? "Nyalakan" : "Matikan"}`, "danger");
          console.error("Terjadi kesalahan:", error);
        });
    } else {
      notify(`Lampu Ruangan 2 Gagal Di ${lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
    }
  }

  const changeSwitchKipasRuangan1 = () => {
    const getRef = ref(database, "kipas_ruangan_1");
    const collectionRef = collection(db, 'kipas_ruangan_1');

    if (getRef._repo.server_.connected_) {
      set(getRef, !kipasRuangan1)
        .then(() => {
          setKipasRuangan1(!kipasRuangan1)

          const value = `${!kipasRuangan1 ? "Nyalakan Kipas" : "Matikan Kipas"}`
          const obj = {
            aksi: value,
            timestamps: getTimeStamps(),
            user: dataUser.name
          }
          addDataToFirestore(collectionRef, obj)

          notify(`Kipas Ruangan 1 Berhasil Di ${!kipasRuangan1 ? "Nyalakan" : "Matikan"}`, "primary");
        })
        .catch((error) => {
          notify(`Kipas Ruangan 1 Gagal Di ${kipasRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
          console.error("Terjadi kesalahan:", error);
        });
    } else {
      notify(`Lampu Ruangan 2 Gagal Di ${lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
    }
  }

  const changeSwitchKipasRuangan2 = () => {
    const getRef = ref(database, "kipas_ruangan_2");
    const collectionRef = collection(db, 'kipas_ruangan_2');

    if (getRef._repo.server_.connected_) {
      set(getRef, !kipasRuangan2)
        .then(() => {
          setKipasRuangan2(!kipasRuangan2)

          const value = `${!kipasRuangan2 ? "Nyalakan Kipas" : "Matikan Kipas"}`
          const obj = {
            aksi: value,
            timestamps: getTimeStamps(),
            user: dataUser.name
          }
          addDataToFirestore(collectionRef, obj)

          notify(`Kipas Ruangan 2 Berhasil Di ${!kipasRuangan2 ? "Nyalakan" : "Matikan"}`, "primary");
        })
        .catch((error) => {
          notify(`Kipas Ruangan 2 Gagal Di ${kipasRuangan2 ? "Nyalakan" : "Matikan"}`, "danger");
          console.error("Terjadi kesalahan:", error);
        });
    } else {
      notify(`Lampu Ruangan 2 Gagal Di ${lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
    }
  }

  const changeSwitchWaterPump = () => {
    const getRef = ref(database, "water_pump");
    const collectionRef = collection(db, 'water_pump');

    if (getRef._repo.server_.connected_) {
      set(getRef, !waterPump)
        .then(() => {
          setWaterPump(!waterPump)

          const value = `${!waterPump ? "Nyalakan Water Pump" : "Matikan Water Pump"}`
          const obj = {
            aksi: value,
            timestamps: getTimeStamps(),
            user: dataUser.name
          }
          addDataToFirestore(collectionRef, obj)

          notify(`Waterpump Berhasil Di ${!waterPump ? "Nyalakan" : "Matikan"}`, "primary");
        })
        .catch((error) => {
          notify(`Waterpump Gagal Di ${waterPump ? "Nyalakan" : "Matikan"}`, "danger");
          console.error("Terjadi kesalahan:", error);
        });
    } else {
      notify(`Lampu Ruangan 2 Gagal Di ${lampuRuangan1 ? "Nyalakan" : "Matikan"}`, "danger");
    }
  }

  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-sun-fog-29 text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Suhu Ruangan 1</p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.suhu_ruangan_1}°C</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-sun-fog-29 text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Suhu Ruangan 2</p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.suhu_ruangan_2}°C</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Last day
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bulb-63 text-Primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Pencahayaan Ruangan 1</p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.cahaya_ruangan_1}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> In the last hour
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Pencahayaan Ruangan 2</p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.cahaya_ruangan_2}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">
                        <NavLink
                          to="/admin/activity-lampu-ruangan-1"
                          className="nav-link"
                          activeClassName="active"
                        >
                          <p>Lampu Ruangan 1</p>
                        </NavLink></p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.lampu_ruangan_1 ? "Hidup" : "Mati"}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <Rows justify="space-between">
                    <Cols>
                      <i className="fas fa-sync-alt" /> Update Now
                    </Cols>
                    <Cols>
                      <Space direction="vertical">
                        <Switch
                          checkedChildren="Menyala"
                          unCheckedChildren="Mati"
                          checked={data.lampu_ruangan_1 ? true : false}
                          onClick={changeSwitchLampuRuangan1}
                        />
                      </Space>
                    </Cols>
                  </Rows>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">
                        <NavLink
                          to="/admin/activity-lampu-ruangan-2"
                          className="nav-link"
                          activeClassName="active"
                        >
                          <p>Lampu Ruangan 2</p>
                        </NavLink></p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.lampu_ruangan_2 ? "Hidup" : "Mati"}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <Rows justify="space-between">
                    <Cols>
                      <i className="fas fa-sync-alt" /> Update Now
                    </Cols>
                    <Cols>
                      <Space direction="vertical">
                        <Switch
                          checkedChildren="Menyala"
                          unCheckedChildren="Mati"
                          checked={data.lampu_ruangan_2 ? true : false}
                          onClick={changeSwitchLampuRuangan2}
                        />
                      </Space>
                    </Cols>
                  </Rows>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">
                        <NavLink
                          to="/admin/activity-kipas-ruangan-1"
                          className="nav-link"
                          activeClassName="active"
                        >
                          <p>Kipas Ruangan 1</p>
                        </NavLink></p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.kipas_ruangan_1 ? "Hidup" : "Mati"}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <Rows justify="space-between">
                    <Cols>
                      <i className="fas fa-sync-alt" /> Update Now
                    </Cols>
                    <Cols>
                      <Space direction="vertical">
                        <Switch
                          checkedChildren="Menyala"
                          unCheckedChildren="Mati"
                          checked={data.kipas_ruangan_1 ? true : false}
                          onClick={changeSwitchKipasRuangan1}
                        />
                      </Space>
                    </Cols>
                  </Rows>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">
                        <NavLink
                          to="/admin/activity-kipas-ruangan-2"
                          className="nav-link"
                          activeClassName="active"
                        >
                          <p>Kipas Ruangan 2</p>
                        </NavLink></p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.kipas_ruangan_2 ? "Hidup" : "Mati"}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <Rows justify="space-between">
                    <Cols>
                      <i className="fas fa-sync-alt" /> Update Now
                    </Cols>
                    <Cols>
                      <Space direction="vertical">
                        <Switch
                          checkedChildren="Menyala"
                          unCheckedChildren="Mati"
                          checked={data.kipas_ruangan_2 ? true : false}
                          onClick={changeSwitchKipasRuangan2}
                        />
                      </Space>
                    </Cols>
                  </Rows>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">
                        <NavLink
                          to="/admin/activity-water-pump"
                          className="nav-link"
                          activeClassName="active"
                        >
                          <p>Water Pump</p>
                        </NavLink></p>
                      <CardTitle tag="p">
                        {data ? (
                          <pre>{data.water_pump ? "Hidup" : "Mati"}</pre>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <Rows justify="space-between">
                    <Cols>
                      <i className="fas fa-sync-alt" /> Update Now
                    </Cols>
                    <Cols>
                      <Space direction="vertical">
                        <Switch
                          checkedChildren="Menyala"
                          unCheckedChildren="Mati"
                          checked={data.water_pump ? true : false}
                          onClick={changeSwitchWaterPump}
                        />
                      </Space>
                    </Cols>
                  </Rows>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Users Behavior</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
              <div>
                <h1>Realtime Database</h1>
                {data ? (
                  <pre>{data}</pre>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}
