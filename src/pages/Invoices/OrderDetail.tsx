import React, { useEffect, useState } from "react";
import { CardBody, Row, Col, Card, CardHeader, Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useParams } from "react-router-dom";
import logoDark from '../../assets/images/logo-dark.png';
import logoLight from '../../assets/images/logo-light.png';

interface IOrder {
  _id: string;
  datePickUp: string;
  timePickUp: string;
  dateDropOff: string;
  timeDropOff: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off: string[];
  consumer: string;
  income: number;
  oilFee: number;
  tollwayFee: number;
  otherFee: number;
  remark: string;
  orderStatus: string;
  invoiced: boolean;
}

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Order ID from URL params:", id); // Log the id to check

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/order/getOrder/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData.data);
        } else {
          throw new Error("Failed to fetch order");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Error fetching order");
      }
    };

    fetchOrder();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Order Details" pageTitle="Orders" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="orderDetails">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom-dashed p-4">
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <img
                          src={logoDark}
                          className="card-logo card-logo-dark"
                          alt="logo dark"
                          height="17"
                        />
                        <img
                          src={logoLight}
                          className="card-logo card-logo-light"
                          alt="logo light"
                          height="17"
                        />
                        <div className="mt-sm-5 mt-4">
                          <h6 className="text-muted text-uppercase fw-semibold">Address</h6>
                          <p className="text-muted mb-1" id="address-details">
                            {order.pick_up}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        <h6>
                          <span className="text-muted fw-normal">Order No:</span>{" "}
                          <span id="order-no">{order._id}</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Consumer:</span>{" "}
                          <span id="consumer">{order.consumer}</span>
                        </h6>
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Pick Up Date</p>
                        <h5 className="fs-14 mb-0">{order.datePickUp}</h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Pick Up Time</p>
                        <h5 className="fs-14 mb-0">{order.timePickUp}</h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Drop Off Date</p>
                        <h5 className="fs-14 mb-0">{order.dateDropOff}</h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Drop Off Time</p>
                        <h5 className="fs-14 mb-0">{order.timeDropOff}</h5>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4 border-top border-top-dashed">
                    <Row className="g-3">
                      <Col sm={6}>
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">Pick Up Location</h6>
                        <p className="fw-medium mb-2" id="pick-up">{order.pick_up}</p>
                      </Col>
                      <Col sm={6}>
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">Drop Off Locations</h6>
                        {order.drop_off.map((location, index) => (
                          <p key={index} className="fw-medium mb-2" id={`drop-off-${index}`}>
                            {location.split(",")[0]}
                          </p>
                        ))}
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderDetail;
