import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Row
} from "reactstrap";
// core components
import { Table } from 'antd';

//firebase
import { app } from "config/firebase";
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default function ActivityWaterPump() {
    const db = getFirestore(app);
    const collectionRef = collection(db, 'water_pump');
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
