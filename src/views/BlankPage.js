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

export default function BlankPage() {
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
                <p>text</p>
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
