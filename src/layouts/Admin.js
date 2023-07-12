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
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import { DataFetchProvider } from "../context/DataFetchContext";
import NotificationAlert from "react-notification-alert";
import { app, database } from "config/firebase";
import { onValue, ref, set } from "firebase/database";

var ps;

function Dashboard(props) {
  const [backgroundColor, setBackgroundColor] = React.useState("black");
  const [activeColor, setActiveColor] = React.useState("info");
  const mainPanel = React.useRef();
  const location = useLocation();
  const notificationAlert = React.useRef();
  const [dataSensor, setDataSensor] = React.useState([]);
  const [dataNilaiDefault, SetDataNilaiDefault] = React.useState([]);

  const dataUser = JSON.parse(localStorage.getItem("datauser"));

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });

  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);
  const handleActiveClick = (color) => {
    setActiveColor(color);
  };
  const handleBgClick = (color) => {
    setBackgroundColor(color);
  };

  React.useEffect(() => {
    const databaseRef = ref(database);

    onValue(databaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        setDataSensor(value.data_sensor);
        SetDataNilaiDefault(value.nilai_default);
      } else {
        console.log("Tidak ada data yang tersedia.");
      }
    });
  }, []);

  React.useEffect(() => {
    //notifikasi sensor
    let timeoutId; // Variabel untuk menyimpan ID timeout

    const checkSensorData = () => {
      if (
        dataSensor.suhu_ruangan_1 > dataNilaiDefault.def_suhu_ruangan_1 &&
        dataSensor.kipas_ruangan_1 == false
      ) {
        notify(
          `suhu ruangan 1 sangat tinggi ${dataSensor.suhu_ruangan_1}°C. Saran: Nyalakan kipas angin untuk membantu mengurangi suhu.`,
          "danger"
        );
      }
      if (
        dataSensor.suhu_ruangan_2 > dataNilaiDefault.def_suhu_ruangan_2 &&
        dataSensor.kipas_ruangan_2 == false
      ) {
        notify(
          `suhu ruangan 2 sangat tinggi ${dataSensor.suhu_ruangan_2}°C. Saran: Nyalakan kipas angin untuk membantu mengurangi suhu.`,
          "danger"
        );
      }
      if (
        dataSensor.cahaya_ruangan_1 > dataNilaiDefault.def_cahaya_ruangan_1 &&
        dataSensor.lampu_ruangan_1 == false
      ) {
        notify(
          `Cahaya Ruangan 1 terlalu gelap. Saran: Nyalakan lampu untuk menerangi ruangan.`,
          "danger"
        );
      }
      if (
        dataSensor.cahaya_ruangan_2 > dataNilaiDefault.def_cahaya_ruangan_2 &&
        dataSensor.lampu_ruangan_2 == false
      ) {
        notify(
          `Cahaya Ruangan 2 terlalu gelap. Saran: Nyalakan lampu untuk menerangi ruangan.`,
          "danger"
        );
      }
      if (
        dataSensor.suhu_flame_fire_ruangan_1 <
          dataNilaiDefault.def_suhu_flame_fire &&
        dataSensor.water_pump == false
      ) {
        notify(
          `sensor mendeteksi adanya api di ruangan 1. Tindakan yang perlu diambil: Lakukan pemadaman segera untuk mengatasi situasi ini.`,
          "danger"
        );
      }
      if (
        dataSensor.suhu_flame_fire_ruangan_2 <
          dataNilaiDefault.def_suhu_flame_fire &&
        dataSensor.water_pump == false
      ) {
        notify(
          `sensor mendeteksi adanya api di ruangan 2. Tindakan yang perlu diambil: Lakukan pemadaman segera untuk mengatasi situasi ini.`,
          "danger"
        );
      }
      timeoutId = setTimeout(checkSensorData, 25000);
    };

    checkSensorData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dataSensor, dataNilaiDefault]);

  const notify = (message, color) => {
    var options = {};
    options = {
      place: "tr",
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: color,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 10,
    };
    notificationAlert.current.notificationAlert(options);
  };

  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <DataFetchProvider>
        <div className="wrapper">
          <Sidebar
            {...props}
            routes={routes}
            bgColor={backgroundColor}
            activeColor={activeColor}
          />
          <div className="main-panel" ref={mainPanel}>
            <DemoNavbar {...props} />
            <Switch>
              {routes.map((prop, key) => {
                // Tambahkan kondisi di sini
                if (
                  prop.path === "/list-user" &&
                  dataUser &&
                  dataUser.role !== "administrator"
                ) {
                  return null; // Jika peran pengguna bukan "administrator", jangan tampilkan route "list-user"
                }

                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key}
                  />
                );
              })}
            </Switch>
            <Footer fluid />
          </div>
          {/* <FixedPlugin
            bgColor={backgroundColor}
            activeColor={activeColor}
            handleActiveClick={handleActiveClick}
            handleBgClick={handleBgClick}
          /> */}
        </div>
      </DataFetchProvider>
    </>
  );
}

export default Dashboard;
