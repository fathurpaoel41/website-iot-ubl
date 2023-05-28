import React, { useEffect, useState } from "react";
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
import { database, app } from "config/firebase";
import { getDatabase, ref, onValue, off, get, set } from "firebase/database";
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'

export default function ActivityKipasRuangan2() {
    const db = getFirestore(app);
    const collectionRef = collection(db, 'kipas_ruangan_2');
    const [dataFireStore, setDataFireStore] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collectionRef);
                const arrData = [];

                querySnapshot.forEach((doc) => {
                    const { aksi, timestamps, user } = doc.data();
                    arrData.push({ aksi, timestamps, user });
                });

                arrData.sort((a, b) => parseDate(b.timestamps) - parseDate(a.timestamps));

                const dataResult = arrData.map((r, index) => ({
                    no: index + 1,
                    aksi: r.aksi,
                    timestamps: r.timestamps,
                    user: r.user
                }));

                setDataFireStore(dataResult);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    const dataSource = dataFireStore;

    const parseDate = (timestampString) => {
        const [date, time] = timestampString.split(' ');
        const [day, month, year] = date.split('-');
        const [hours, minutes, seconds] = time.split(':');
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

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
