import React, { useEffect, useState } from "react";
import { CardBody, Row, Col, Card, CardHeader, Container, CardFooter, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useParams } from "react-router-dom";
import { toPng } from 'html-to-image';
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
  orderId: string;
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

  const signatureLineStyle = {
    borderBottom: "1px solid black",
    height: "1em",
    width: "200px",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const node = document.getElementById('orderDetails');

    if (node) {
      // Hide the buttons before generating the image
      const printButton = document.getElementById('printButton');
      const downloadButton = document.getElementById('downloadButton');
      if (printButton && downloadButton) {
        printButton.style.display = 'none';
        downloadButton.style.display = 'none';
      }

      toPng(node)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `order_${order.orderId}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        })
        .finally(() => {
          // Show the buttons again after generating the image
          if (printButton && downloadButton) {
            printButton.style.display = 'block';
            downloadButton.style.display = 'block';
          }
        });
    }
  };

  return (
    <div className="page-content">
      <style>
        {`
          @media print {
            .print-hide {
              display: none !important;
            }
          }
        `}
      </style>
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
                          height="147"
                        />
                        <img
                          src={logoLight}
                          className="card-logo card-logo-light"
                          alt="logo light"
                          height="147"
                        />
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        <h6>
                          <span className="text-muted fw-normal">Order No:</span>{" "}
                          <span id="order-no">{order.orderId}</span>
                        </h6>
                        <div className="mt-sm-5 mt-4">
                          <span className="text-muted text-uppercase fw-semibold">Consumer: </span>
                          <span className="text-muted mb-1" id="address-details">
                            {order.consumer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={12} xs={6}>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Pick Up Location: </span>
                        <h6 className="fs-14 mb-0">{order.pick_up}</h6>
                      </Col>
                      <Col lg={6} xs={6}>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Pick Up Date: </span>
                        <span className="fs-14 mb-0">{order.datePickUp}</span>
                      </Col>
                      <Col lg={6} xs={6}>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Pick Up Time: </span>
                        <span className="fs-14 mb-0">{order.timePickUp}</span>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4 border-top border-top-dashed">
                    <Row className="g-3">
                      <Col sm={12}>
                        <span className="text-muted text-uppercase fw-semibold mb-3">Drop Off Locations: </span>
                        {order.drop_off.map((location, index) => {
                          const parts = location.split(",");
                          const address = parts.slice(0, -2).join(",");
                          return (
                            <span key={index} className="fw-medium mb-2 d-block" id={`drop-off-${index}`}>
                              {address}
                            </span>
                          );
                        })}
                      </Col>
                      <Col lg={6} xs={6}>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Drop off Date: </span>
                        <span className="fs-14 mb-0">{order.dateDropOff}</span>
                      </Col>
                      <Col lg={6} xs={6}>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Drop off Time: </span>
                        <span className="fs-14 mb-0">{order.timeDropOff}</span>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardFooter className="p-4">
                    <Row className="g-3 align-items-center">
                      <Col lg={8} xs={12}>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Remark: </span>
                        <span className="fs-14 mb-0">{order.remark}</span>
                      </Col>
                      <Col lg={4} xs={12} className="d-flex justify-content-between align-items-center">
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Sign</span>
                        <span style={signatureLineStyle}></span>
                        <span className="text-muted mb-2 text-uppercase fw-semibold">Recipient</span>
                      </Col>
                    </Row>
                  </CardFooter>
                </Col>
                <Col lg={12}>
                  <CardFooter className="d-flex justify-content-center print-hide">
                    <Button id="printButton" color="primary" className="me-2" onClick={handlePrint}>
                      <i className="ri-printer-line align-bottom me-1"></i> Print
                    </Button>
                    <Button id="downloadButton" color="secondary" onClick={handleDownload}>
                      <i className="ri-download-2-line align-bottom me-1"></i> Download
                    </Button>
                  </CardFooter>
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
