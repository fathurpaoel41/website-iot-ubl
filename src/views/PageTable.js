import React from "react";
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

export default function PageTable() {
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
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
                                <Table dataSource={dataSource} columns={columns} />;
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
