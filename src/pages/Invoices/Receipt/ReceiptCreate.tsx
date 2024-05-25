import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createReceipt } from "../../../services/receipts";
import { listInvoice } from "../../../services/invoices";

interface IInvoice {
  _id: string;
  receiptId: string;
  customer: string;
  address: string;
  listinvoice: string[];
  amount: number;
  updatedAt: string;
  invoicestatus: boolean;
}

const ReceiptCreate = () => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [listinvoice, setListInvoice] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await listInvoice();
        const filteredInvoices = response.data.filter((invoice: IInvoice) => !invoice.invoicestatus);
        setInvoices(filteredInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "customer") {
      setCustomer(value);
    } else if (name === "address") {
      setAddress(value);
    }
  };

  const handleInvoiceSelection = (invoiceId: string) => {
    setListInvoice((prevSelected) => {
      const newSelected = prevSelected.includes(invoiceId)
        ? prevSelected.filter((id) => id !== invoiceId)
        : [...prevSelected, invoiceId];

      const selectedInvoices = invoices.filter((invoice) => newSelected.includes(invoice._id));
      const newTotalAmount = selectedInvoices.reduce((total, invoice) => total + invoice.amount, 0);
      setTotalAmount(newTotalAmount);
      setIsButtonVisible(newSelected.length > 0);

      return newSelected;
    });
  };

  const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const receiptCreate = await createReceipt({
        receiptId: `REC-${Date.now()}`,
        customer,
        address,
        listinvoice,
        amount: totalAmount,
      });
      console.log("Receipt create successful:", receiptCreate);
      navigate("/receipt");
    } catch (error) {
      console.log(error);
    }
  };

  const handleValidDate = (date: string) => {
    const parsedDate = moment(date);
    return parsedDate.isValid() ? parsedDate.format("DD MMM YYYY") : "Invalid date";
  };

  const handleValidTime = (time: string) => {
    const parsedTime = moment(time, "HH:mm");
    return parsedTime.isValid() ? parsedTime.format("hh:mm A") : "Invalid time";
  };

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll") as HTMLInputElement;
    const checkboxes = document.querySelectorAll(".receiptCheckBox") as NodeListOf<HTMLInputElement>;

    if (checkall.checked) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteCheckbox = () => {
    const checkboxes = document.querySelectorAll(".receiptCheckBox:checked") as NodeListOf<HTMLInputElement>;
    const selectedIds = Array.from(checkboxes).map((checkbox) => checkbox.value);
    setIsButtonVisible(selectedIds.length > 0);
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        cell: (cell: any) => (
          <input
            type="checkbox"
            className="receiptCheckBox form-check-input"
            value={cell.getValue()}
            onChange={() => handleInvoiceSelection(cell.getValue())}
          />
        ),
        id: "#",
        accessorKey: "_id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "No.",
        accessorKey: "_id",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.row.index + 1}</span>,
      },
      {
        header: "วันที่",
        accessorKey: "updatedAt",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const dateValue = cell.getValue();
          return (
            <>
              {handleValidDate(dateValue)}, <small className="text-muted">{handleValidTime(dateValue)}</small>
            </>
          );
        },
      },
      {
        header: "ลูกค้า",
        accessorKey: "customer",
        enableColumnFilter: false,
      },
      {
        header: "ยอด",
        accessorKey: "amount",
        enableColumnFilter: false,
      },
    ],
    [checkedAll, invoices]
  );

  document.title = "Receipt Create";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Receipts List" pageTitle="Receipts" />
          <Row>
            <Col md={12}>
              <div>
                <Label htmlFor="customer" className="form-label">
                  ลูกค้า
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="customer"
                  placeholder="Enter Customer"
                  name="customer"
                  value={customer}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={12}>
              <div>
                <Label htmlFor="address" className="form-label">
                  ที่อยู่
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="Enter Address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col lg={12}>
              <Label htmlFor="invoiceId" className="form-label">
                Invoices
              </Label>
              <Card id="receiptList">
                <CardBody className="pt-0">
                  <div>
                    <TableContainer
                      columns={columns}
                      data={invoices}
                      isGlobalFilter={true}
                      customPageSize={10}
                      isInvoiceListFilter={true}
                      theadClass="text-muted text-uppercase"
                      SearchPlaceholder="Search for customer, email, country, status or something..."
                    />
                    <ToastContainer closeButton={false} limit={1} />
                  </div>
                </CardBody>
              </Card>
              {isButtonVisible && (
                <div className="d-flex justify-content-end mt-3">
                  <Button color="primary" onClick={submit}>
                    Create Receipt
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ReceiptCreate;
