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
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import moment from "moment"; // Import moment for date formatting
import { toPng } from "html-to-image";
import { fetchReceipts } from "services/receipts";
import { fetchFinishedOrders } from "services/order";

const VoucherDetail = () => {
  const params = useParams<Record<string, string | undefined>>();
  const { year, month } = params;

  const [selectedSection, setSelectedSection] = useState<string>("receipt");
  const [data, setData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let fetchedData;
        if (selectedSection === "receipt") {
          fetchedData = await fetchReceipts(year!, month!);
        } else if (selectedSection === "payment") {
          fetchedData = await fetchFinishedOrders(year!, month!);
        }
        console.log("Data:", fetchedData);
        setData(fetchedData);
        const total = fetchedData.reduce((sum: number, item: any) => {
          if (selectedSection === "receipt") {
            return sum + item.amount;
          } else if (selectedSection === "payment") {
            return sum + item.oilFee + item.tollwayFee + item.otherFee;
          }
          return sum;
        }, 0);
        setGrandTotal(total);
      } catch (error) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [year, month, selectedSection]);

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(event.target.value);
    setSelectedDate(null); // Reset selected date when changing section
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const node = document.getElementById("downloadCard");

    if (node && selectedDate) {
      const printButton = document.getElementById("printButton");
      const downloadButton = document.getElementById("downloadButton");
      if (printButton && downloadButton) {
        printButton.style.display = "none";
        downloadButton.style.display = "none";
      }

      toPng(node)
        .then((dataUrl) => {
          const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
          const link = document.createElement("a");
          link.download = `${selectedSection}_${formattedDate}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        })
        .finally(() => {
          if (printButton && downloadButton) {
            printButton.style.display = "inline-block";
            downloadButton.style.display = "inline-block";
          }
        });
    }
  };

  const groupDataByDate = (data: any[]) => {
    return data.reduce((group: { [key: string]: any[] }, item) => {
      const date = moment(item.createdAt).format("YYYY-MM-DD");
      if (!group[date]) {
        group[date] = [];
      }
      group[date].push(item);
      return group;
    }, {});
  };

  const groupedData = groupDataByDate(data || []);

  const filteredData = selectedDate ? groupedData[selectedDate] || [] : [];

  const dailyTotal = filteredData.reduce((sum: number, item: any) => {
    if (selectedSection === "receipt") {
      return sum + item.amount;
    } else if (selectedSection === "payment") {
      return sum + item.oilFee + item.tollwayFee + item.otherFee;
    }
    return sum;
  }, 0);

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
          <BreadCrumb title="Voucher Detail" pageTitle="More Details" />
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
                {Object.keys(groupedData).map((date) => (
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
                {selectedSection === "receipt" && (
                  <Card id="receipt">
                    <CardHeader className="border-0">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title mb-0 flex-grow-1">Receipt</h5>
                        <div className="flex-shrink-0">
                          <span>
                            {month} {year}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : filteredData.length > 0 ? (
                        <>
                          <table className="table table-bordered table-custom">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Customer</th>
                                <th>Income Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (
                                <tr key={item._id}>
                                  <td>{index + 1}</td>
                                  <td>{item.customer}</td>
                                  <td>{item.amount}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2} className="text-end">
                                  <strong>
                                    Total Amount for {moment(selectedDate).format("LL")}
                                  </strong>
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
                        <p>No receipts available for the selected date.</p>
                      )}
                    </CardBody>
                  </Card>
                )}
                {selectedSection === "payment" && (
                  <Card id="payment">
                    <CardHeader className="border-0">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title mb-0 flex-grow-1">Payment Voucher</h5>
                        <div className="flex-shrink-0">
                          <span>
                            {month} {year}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : filteredData.length > 0 ? (
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
                              {filteredData.map((item, index) => (
                                <tr key={item._id}>
                                  <td>{index + 1}</td>
                                  <td>{item.consumer}</td>
                                  <td>{item.oilFee + item.tollwayFee + item.otherFee}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2} className="text-end">
                                  <strong>
                                    Total Amount for {moment(selectedDate).format("LL")}
                                  </strong>
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
                        <p>No payments available for the selected date.</p>
                      )}
                    </CardBody>
                  </Card>
                )}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  id="printButton"
                  className="print-hide mr-3"
                  color="primary"
                  onClick={handlePrint}
                >
                  <i className="ri-printer-line align-bottom me-1"></i> Print
                </Button>
                <Button
                  id="downloadButton"
                  className="print-hide ml-3"
                  color="secondary"
                  onClick={handleDownload}
                >
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

export default VoucherDetail;
