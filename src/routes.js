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
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";
import UpgradeToPro from "views/Upgrade.js";

//punya aing
import BlankPage from "views/BlankPage";
import DashboardIOT from "views/DashboardIOT";
import ActivityLampuRuangan1 from "views/ActivityLampuRuangan1";
import ActivityLampuRuangan2 from "views/ActivityLampuRuangan2";
import ActivityKipasRuangan1 from "views/ActivityKipasRuangan1";
import ActivityKipasRuangan2 from "views/ActivityKipasRuangan2";
import ActivityWaterPump from "views/ActivityWaterPump";
import ListUser from "views/ListUser";

var routes = [
  // {
  //   path: "/blankPage",
  //   name: "Blank Page",
  //   icon: "nc-icon nc-tv-2",
  //   component: BlankPage,
  //   layout: "/admin",
  //   following: false
  // },
  {
    path: "/iot-dashboard",
    name: "IOT Dashboard",
    icon: "nc-icon nc-planet",
    component: DashboardIOT,
    layout: "/admin",
    following: false
  },
  {
    path: "/list-user",
    name: "List User",
    icon: "nc-icon nc-planet",
    component: ListUser,
    layout: "/admin",
    following: false
  },
  {
    path: "/activity-lampu-ruangan-1",
    name: "Activity Lampu Ruangan 1",
    icon: "nc-icon nc-planet",
    component: ActivityLampuRuangan1,
    layout: "/admin",
    following: "/iot-dashboard"
  },
  {
    path: "/activity-lampu-ruangan-2",
    name: "Activity Lampu Ruangan 2",
    icon: "nc-icon nc-planet",
    component: ActivityLampuRuangan2,
    layout: "/admin",
    following: "/iot-dashboard"
  },
  {
    path: "/activity-kipas-ruangan-1",
    name: "Activity Kipas Ruangan 1",
    icon: "nc-icon nc-planet",
    component: ActivityKipasRuangan1,
    layout: "/admin",
    following: "/iot-dashboard"
  },
  {
    path: "/activity-kipas-ruangan-2",
    name: "Activity Kipas Ruangan 2",
    icon: "nc-icon nc-planet",
    component: ActivityKipasRuangan2,
    layout: "/admin",
    following: "/iot-dashboard"
  },
  {
    path: "/activity-water-pump",
    name: "Activity Water Pump",
    icon: "nc-icon nc-planet",
    component: ActivityWaterPump,
    layout: "/admin",
    following: "/iot-dashboard"
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/admin",
    following: false
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "nc-icon nc-bank",
  //   component: Dashboard,
  //   layout: "/admin",
  //   following: false
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: Icons,
  //   layout: "/admin",
  //   following: false
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin",
  //   following: false
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin",
  //   following: false
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   icon: "nc-icon nc-tile-56",
  //   component: TableList,
  //   layout: "/admin",
  //   following: false
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: Typography,
  //   layout: "/admin",
  //   following: false
  // },
  // {
  //   pro: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-spaceship",
  //   component: UpgradeToPro,
  //   layout: "/admin",
  //   following: false
  // }
];
export default routes;
