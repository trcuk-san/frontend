import React, { useEffect, useState } from "react";
import { CardBody, Row, Col, Card, CardHeader, Container, CardFooter, Button } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useParams } from "react-router-dom";
import { toPng } from 'html-to-image';
import { getInvoice, getOrder } from "../../../services/invoices";
import logoDark from '../../../assets/images/logo-dark.png';

interface IInvoice {
  _id: string;
  invoiceId: string;
  customer: string;
  address: string;
  listorderId: string[];
  amount: number;
  invoicestatus: boolean;
  createdAt: string;
  updatedAt: string;
}

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

interface IVehicle {
  _id: string;
  vehicleId: string;
}

interface IDriver {
  _id: string;
  firstname: string;
}

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, IVehicle>>({});
  const [drivers, setDrivers] = useState<Record<string, IDriver>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

        const [invoiceResponse, vehicleResponse, driverResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/invoice/getInvoice/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/vehicle/listVehicle`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!invoiceResponse.ok || !vehicleResponse.ok || !driverResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const invoiceData = await invoiceResponse.json();
        const vehiclesData = await vehicleResponse.json();
        const driversData = await driverResponse.json();

        setInvoice(invoiceData.data);

        const vehiclesMap: Record<string, IVehicle> = {};
        vehiclesData.data.forEach((vehicle: IVehicle) => {
          vehiclesMap[vehicle._id] = vehicle;
        });
        setVehicles(vehiclesMap);

        const driversMap: Record<string, IDriver> = {};
        driversData.data.forEach((driver: IDriver) => {
          driversMap[driver._id] = driver;
        });
        setDrivers(driversMap);

        const orderPromises = invoiceData.data.listorderId.map((orderId: string) => getOrder(orderId));
        const ordersData = await Promise.all(orderPromises);
        setOrders(ordersData.filter(order => order !== null) as IOrder[]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!invoice) {
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  

  const handleDownload = () => {
    const node = document.getElementById('invoiceDetails');

    if (node) {
      const printButton = document.getElementById('printButton');
      const downloadButton = document.getElementById('downloadButton');
      if (printButton && downloadButton) {
        printButton.style.display = 'none';
        downloadButton.style.display = 'none';
      }

      toPng(node)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `invoice_${invoice.invoiceId}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        })
        .finally(() => {
          if (printButton && downloadButton) {
            printButton.style.display = 'block';
            downloadButton.style.display = 'block';
          }
        });
    }
  };

  const formatDropOff = (dropOff: string[]) => {
    return dropOff.map((location, index) => {
      const address = location.split(",").slice(0, -2).join(",");
      return `${index + 1}. ${address}`;
    }).join(", ");
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
        <BreadCrumb title="Invoice Details" pageTitle="Invoices" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="invoiceDetails">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom p-4">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <img src={logoDark} alt="logo dark" height="100" />
                      </div>
                      <div className="text-end">
                        <h4 className="card-title mb-0">Invoice</h4>
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="mb-4">
                      <Col lg={6}>
                        <div className="d-flex flex-column">
                          <span className="text-muted text-uppercase fw-semibold">Customer:</span>
                          <span className="fs-14 mb-2">{invoice.customer}</span>
                          <span className="text-muted text-uppercase fw-semibold">Address:</span>
                          <span className="fs-14 mb-2">{invoice.address}</span>
                        </div>
                      </Col>
                      <Col lg={6} className="text-end">
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-muted text-uppercase fw-semibold">Invoice ID:</span>
                          <span className="fs-14 mb-2">{invoice.invoiceId}</span>
                          <span className="text-muted text-uppercase fw-semibold">Date:</span>
                          <span className="fs-14 mb-2">{formatDate(invoice.createdAt)}</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <div className="table-responsive">
                          <table className="table table-bordered table-centered">
                            <thead className="table-light">
                              <tr>
                                <th>Date</th>
                                <th>Pickup</th>
                                <th>Drop Off</th>
                                <th>Vehicle</th>
                                <th>Driver</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order, index) => (
                                order ? (
                                  <tr key={index}>
                                    <td>{formatDate(order.datePickUp)}</td>
                                    <td>{order.pick_up}</td>
                                    <td>{formatDropOff(order.drop_off)}</td>
                                    <td>{vehicles[order.vehicle]?.vehicleId || 'N/A'}</td>
                                    <td>{drivers[order.driver]?.firstname || 'N/A'}</td>
                                    <td>{order.income}</td>
                                  </tr>
                                ) : (
                                  <tr key={index}>
                                    <td colSpan={6}>Order data is missing or invalid.</td>
                                  </tr>
                                )
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={8}></Col>
                      <Col lg={4} className="text-end">
                        <div className="d-flex justify-content-end">
                          <h5 className="text-muted">Total:</h5>
                          <h5 className="ms-2">{invoice.amount}</h5>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col lg={6} className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-muted">ผู้วางบิล</span>
                          <div style={signatureLineStyle}></div>
                        </div>
                      </Col>
                      <Col lg={6} className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-muted">ผู้รับเงิน</span>
                          <div style={signatureLineStyle}></div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
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

export default InvoiceDetail;
