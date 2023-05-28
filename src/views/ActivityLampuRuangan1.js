import React,{useEffect, useState} from "react";
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
// core components
import { Space, Table, Tag } from 'antd';

//firebase
import {database, app} from "config/firebase";
import { getDatabase, ref, onValue, off, get, set} from "firebase/database";
import { getFirestore, collection, getDocs,addDoc } from 'firebase/firestore'

export default function ActivityLampuRuangan1() {
    const db = getFirestore(app);
    const collectionRef = collection(db, 'lampu_ruangan_1');
    const [dataFireStore, setDataFireStore] = useState([])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collectionRef);
            let arrData = []
            let i = 1
            querySnapshot.forEach((doc) => {
            //   console.log(doc.id, ' => ', doc.data());
              let obj = {
                no : i++,
                aksi : doc.data().aksi,
                timestamps : doc.data().timestamps,
                user : doc.data().user
              }
              arrData.push(obj)
              // Lakukan sesuatu dengan data yang diperoleh dari Firestore
            });
            setDataFireStore(arrData)
          } catch (error) {
            console.log('Error fetching data:', error);
          }
        };

        //tambahkan data ke firestore
        // const addDataToFirestore = async () => {
        //     try {
        //       const newDocRef = await addDoc(collectionRef, {
        //         Action: 'Nilai 1',
        //         timestamps: 'Nilai 2',
        //         user: 'bapaklu'
        //         // Tambahkan bidang dan nilai data yang ingin Anda tambahkan
        //       });
        //       console.log('Dokumen berhasil ditambahkan dengan ID:', newDocRef.id);
        //     } catch (error) {
        //       console.error('Error menambahkan dokumen:', error);
        //     }
        // }
    
        fetchData();
        // addDataToFirestore();
        
    },[])

    const dataSource = dataFireStore;

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Aksi',
            dataIndex: 'aksi',
            key: 'aksi',
        },
        {
            title: 'Timestamps',
            dataIndex: 'timestamps',
            key: 'timestamps',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
    ];

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h5">Header</CardTitle>
                                <p className="card-category">note Header</p>
                            </CardHeader>
                            <CardBody>
                                <Table dataSource={dataSource} columns={columns} />
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
    )
}
