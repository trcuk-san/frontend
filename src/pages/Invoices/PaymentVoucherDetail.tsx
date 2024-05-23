import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  Button,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { fetchFinishedOrders } from "../../services/order"; // Adjust the import path accordingly
import moment from "moment"; // Import moment for date formatting
import { toPng } from "html-to-image";

const PaymentVoucherDetail = () => {
  const params = useParams<Record<string, string | undefined>>();
  const { year, month } = params;

  const [selectedSection, setSelectedSection] = useState<string>("payment");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchFinishedOrders(year!, month!); // Fetch data based on year and month
        console.log("Orders Data:", data); // Add this line for debugging
        setOrders(data); // Set the received data to state
        const total = data.reduce((sum: number, order: any) => sum + order.oilFee + order.tollwayFee + order.otherFee, 0);
        setGrandTotal(total);
      } catch (error) {
        setError("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [year, month]);

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const node = document.getElementById('downloadCard');

    if (node && selectedDate) {
      // Hide the buttons before generating the image
      const printButton = document.getElementById('printButton');
      const downloadButton = document.getElementById('downloadButton');
      if (printButton && downloadButton) {
        printButton.style.display = 'none';
        downloadButton.style.display = 'none';
      }

      toPng(node)
        .then((dataUrl) => {
          const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
          const link = document.createElement('a');
          link.download = `PaymentVoucher_${formattedDate}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        })
        .finally(() => {
          // Show the buttons again after generating the image
          if (printButton && downloadButton) {
            printButton.style.display = 'inline-block';
            downloadButton.style.display = 'inline-block';
          }
        });
    }
  };

  // Function to group orders by date
  const groupOrdersByDate = (orders: any[]) => {
    return orders.reduce((group: { [key: string]: any[] }, order) => {
      const date = moment(order.createdAt).format("YYYY-MM-DD");
      if (!group[date]) {
        group[date] = [];
      }
      group[date].push(order);
      return group;
    }, {});
  };

  const groupedOrders = groupOrdersByDate(orders);

  const filteredOrders = selectedDate
    ? groupedOrders[selectedDate] || []
    : [];

  const dailyTotal = filteredOrders.reduce(
    (sum: number, order: any) => sum + order.oilFee + order.tollwayFee + order.otherFee,
    0
  );

  return (
    <React.Fragment>
      <style>{`
        @media print {
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Payment Voucher" pageTitle="More Details" />
          <Row className="mb-4">
            <Col md={6} className="d-flex align-items-center">
              <select
                className="form-select w-auto"
                onChange={handleDateChange}
                value={selectedDate || ""}
              >
                <option value="" disabled>
                  Select Date
                </option>
                {Object.keys(groupedOrders).map((date) => (
                  <option key={date} value={date}>
                    {moment(date).format("LL")}
                  </option>
                ))}
              </select>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <select
                className="form-select w-auto"
                value={selectedSection}
                onChange={handleSectionChange}
              >
                <option value="receipt">Receipt</option>
                <option value="payment">Payment Voucher</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div id="downloadCard">
                {selectedSection === "payment" && (
                  <Card id="payment">
                    <CardHeader className="border-0">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title mb-0 flex-grow-1">Payment Voucher</h5>
                        <div className="flex-shrink-0">
                          <span>{month} {year}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : filteredOrders.length > 0 ? (
                        <>
                          <table className="table table-bordered table-custom">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Customer</th>
                                <th>Payment Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOrders.map((order, index) => (
                                <tr key={order._id}>
                                  <td>{index + 1}</td>
                                  <td>{order.consumer}</td>
                                  <td>{order.oilFee + order.tollwayFee + order.otherFee}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2} className="text-end">
                                  <strong>Total Amount for {moment(selectedDate).format("LL")}</strong>
                                </td>
                                <td>
                                  <strong>{dailyTotal}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="mt-4 text-end">
                            <h5>
                              <strong>Total Amount for All Days: {grandTotal}</strong>
                            </h5>
                          </div>
                        </>
                      ) : (
                        <p>No orders available for the selected date.</p>
                      )}
                    </CardBody>
                  </Card>
                )}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button id="printButton" className="print-hide mr-3" color="primary" onClick={handlePrint}>
                  <i className="ri-printer-line align-bottom me-1"></i> Print
                </Button>
                <Button id="downloadButton" className="print-hide ml-3" color="secondary" onClick={handleDownload}>
                  <i className="ri-download-line align-bottom me-1"></i> Download
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PaymentVoucherDetail;
