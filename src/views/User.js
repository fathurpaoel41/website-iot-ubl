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
import React,{useEffect, useState} from "react";

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
  Input,
  Row,
  Col
} from "reactstrap";

function User() {
  const [dataUser, setDataUser] = useState(null)

  useEffect(()=>{
    const getDataUserLocal = JSON.parse(localStorage.getItem("datauser"))
    setDataUser(getDataUserLocal)
  },[])

  return (
    <>
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
                    <h5 className="title">{dataUser == null ? "-":dataUser.name}</h5>
                  </a>
                  <p className="description">{dataUser == null ? "-":dataUser.email}</p>
                </div>
                <p className="description text-center">
                  Role : {dataUser == null ? "-":dataUser.role}
                </p>
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
