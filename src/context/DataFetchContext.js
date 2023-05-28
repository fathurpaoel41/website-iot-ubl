import React, { createContext, useState, useContext, useEffect } from "react";
import {database, app} from "config/firebase";
import { getdatabase, ref, onValue, off, get, set } from "firebase/database";

const DataFetchContext = createContext();

const DataFetchProvider = ({ children }) => {
  const [activityLampuRuangan1, setActivityLampuRuangan1] = useState([]);

  return (
    <DataFetchContext.Provider value={{activityLampuRuangan1, setActivityLampuRuangan1}}>
      {children}
    </DataFetchContext.Provider>
  );
};

const useDataDashboard = () => useContext(DataFetchContext);
export {useDataDashboard, DataFetchProvider}