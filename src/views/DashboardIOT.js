import React,{ useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";

import { Space, Switch, Row as Rows, Col as Cols } from 'antd';

import database from "config/firebase";
import { getDatabase, ref, onValue, off, get, set } from "firebase/database";

export default function DashboardIOT() {
    const [data, setData] = useState([]);
    const [lampuRuangan1, setLampuRuangan1] = useState(false)
    const [lampuRuangan2, setLampuRuangan2] = useState(false)
    const [kipasRuangan1, setKipasRuangan1] = useState(false)
    const [kipasRuangan2, setKipasRuangan2] = useState(false)
    const [waterPump, setWaterPump] = useState(false)


    

    useEffect(() => {
      const databaseRef = ref(database);
  
      // Mendengarkan perubahan pada database
      onValue(databaseRef, (snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          setData(value);
          setLampuRuangan1(value.lampu_ruangan_1)
          setLampuRuangan2(value.lampu_ruangan_2)
          setKipasRuangan1(value.kipas_ruangan_1)
          setKipasRuangan2(value.kipas_ruangan_2)
          setWaterPump(value.water_pump)
        } else {
          console.log("Tidak ada data yang tersedia.");
        }
      });
  
      // Membersihkan listener saat komponen tidak lagi digunakan
      return () => {
        off(databaseRef);
      };
    }, []);

    const changeSwitchLampuRuangan1 = () =>{
      const lampRef = ref(database, "lampu_ruangan_1");

      set(lampRef, !lampuRuangan1)
        .then(() => {
          setLampuRuangan1(!lampuRuangan1)
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
        });
    }
  
  return (
    <>
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
                      <p className="card-category">Lampu Ruangan 1</p>
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
                      <p className="card-category">Lampu Ruangan 2</p>
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
                        <Switch checkedChildren="Menyala" unCheckedChildren="Mati" checked={data.lampu_ruangan_2 ? true : false} />
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
                      <p className="card-category">Kipas Ruangan 1</p>
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
                        <Switch checkedChildren="Menyala" unCheckedChildren="Mati" checked={data.kipas_ruangan_1 ? true : false} />
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
                      <p className="card-category">Kipas Ruangan 2</p>
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
                        <Switch checkedChildren="Menyala" unCheckedChildren="Mati" checked={data.kipas_ruangan_2 ? true : false} />
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
                      <p className="card-category">Alat Penyiram Air</p>
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
                        <Switch checkedChildren="Menyala" unCheckedChildren="Mati" checked={data.water_pump ? true : false} />
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
