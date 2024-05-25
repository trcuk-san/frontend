import React, { useEffect, useState } from "react";
import { CardBody, Row, Col, Card, CardHeader, Container, CardFooter, Button } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useParams } from "react-router-dom";
import { toPng } from 'html-to-image';
import { getReceipt, getInvoice } from "../../../services/receipts";
import logoDark from '../..//../assets/images/logo-dark.png';

interface IReceipt {
  _id: string;
  receiptId: string;
  customer: string;
  address: string;
  listinvoice: string[];
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface IInvoice {
  _id: string;
  invoiceId: string;
  customer: string;
  address: string;
  listorderId: string[];
  amount: number;
  invoicestatus: boolean;
  updatedAt: string;
}

const ReceiptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<IReceipt | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const [receiptResponse, invoiceResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/receipt/getReceipt/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/invoice/listInvoice`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!receiptResponse.ok || !invoiceResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const receiptData = await receiptResponse.json();
        const invoicesData = await invoiceResponse.json();

        setReceipt(receiptData.data);

        const invoicePromises = receiptData.data.listinvoice.map((invoiceId: string) => getInvoice(invoiceId));
        const invoicesList = await Promise.all(invoicePromises);
        setInvoices(invoicesList.filter(invoice => invoice !== null) as IInvoice[]);
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

  if (!receipt) {
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
    const node = document.getElementById('receiptDetails');

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
          link.download = `receipt_${receipt.receiptId}.png`;
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
        <BreadCrumb title="Receipt Details" pageTitle="Receipts" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="receiptDetails">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom p-4">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <img src={logoDark} alt="logo dark" height="100" />
                      </div>
                      <div className="text-end">
                        <h4 className="card-title mb-0">Receipt</h4>
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
                          <span className="fs-14 mb-2">{receipt.customer}</span>
                          <span className="text-muted text-uppercase fw-semibold">Address:</span>
                          <span className="fs-14 mb-2">{receipt.address}</span>
                        </div>
                      </Col>
                      <Col lg={6} className="text-end">
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-muted text-uppercase fw-semibold">Receipt ID:</span>
                          <span className="fs-14 mb-2">{receipt.receiptId}</span>
                          <span className="text-muted text-uppercase fw-semibold">Date:</span>
                          <span className="fs-14 mb-2">{formatDate(receipt.createdAt)}</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <div className="table-responsive">
                          <table className="table table-bordered table-centered">
                            <thead className="table-light">
                              <tr>
                                <th>Invoice ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoices.map((invoice, index) => (
                                invoice ? (
                                  <tr key={index}>
                                    <td>{invoice.invoiceId}</td>
                                    <td>{formatDate(invoice.updatedAt)}</td>
                                    <td>{invoice.customer}</td>
                                    <td>{invoice.amount}</td>
                                  </tr>
                                ) : (
                                  <tr key={index}>
                                    <td colSpan={4}>Invoice data is missing or invalid.</td>
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
                          <h5 className="ms-2">{receipt.amount}</h5>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col lg={6} className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-muted">Issued by</span>
                          <div style={signatureLineStyle}></div>
                        </div>
                      </Col>
                      <Col lg={6} className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-muted">Received by</span>
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

export default ReceiptDetail;
