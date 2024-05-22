import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import FeatherIcon from "feather-icons-react";
import { listInvoice, deleteInvoice } from "../../services/invoices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const InvoicesList = () => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<string[]>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await listInvoice();
        setInvoices(response.data);
      } catch (error) {
        setError("Error fetching invoices");
        console.error(error);
      }
    };
    fetchInvoices();
  }, []);

  const onClickDelete = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    setDeleteModal(true);
  };

  const handleDeleteInvoice = async () => {
    if (selectedInvoice) {
      try {
        await deleteInvoice(selectedInvoice._id);
        setInvoices(invoices.filter((invoice) => invoice._id !== selectedInvoice._id));
        setDeleteModal(false);
        toast.success("Invoice deleted successfully");
      } catch (error) {
        setError("Error deleting invoice");
        console.error(error);
      }
    }
  };

  const deleteMultiple = async () => {
    try {
      await Promise.all(selectedCheckBoxDelete.map((id) => deleteInvoice(id)));
      setInvoices(invoices.filter((invoice) => !selectedCheckBoxDelete.includes(invoice._id)));
      setIsMultiDeleteButton(false);
      setDeleteModalMulti(false);
      toast.success("Selected invoices deleted successfully");
    } catch (error) {
      setError("Error deleting selected invoices");
      console.error(error);
    }
  };

  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".invoiceCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteCheckbox = () => {
    const ele: any = document.querySelectorAll(".invoiceCheckBox:checked");
    const selectedIds = Array.from(ele).map((checkbox: any) => checkbox.value);
    setSelectedCheckBoxDelete(selectedIds);
    setIsMultiDeleteButton(selectedIds.length > 0);
  };

  const handleValidDate = (date: any) => moment(date).format("DD MMM Y");
  const handleValidTime = (time: any) => moment(time).format("hh:mm A");

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
            className="invoiceCheckBox form-check-input"
            value={cell.getValue()}
            onChange={() => deleteCheckbox()}
          />
        ),
        id: "#",
        accessorKey: "_id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "ID",
        accessorKey: "invoiceId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link to={`/invoice/${cell.getValue()}`} className="fw-medium link-primary">
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Customer",
        accessorKey: "customer",
        enableColumnFilter: false,
      },
      {
        header: "Date",
        accessorKey: "updatedAt",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            {handleValidDate(cell.getValue())},{" "}
            <small className="text-muted">{handleValidTime(cell.getValue())}</small>
          </>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "invoicestatus",
        enableColumnFilter: false,
        cell: (cell: any) => {
          switch (cell.getValue()) {
            case false:
              return <span className="badge text-uppercase bg-warning-subtle text-warning">Unpaid</span>;
            case true:
              return <span className="badge text-uppercase bg-success-subtle text-success">Paid</span>;
            default:
              return <span className="badge text-uppercase bg-secondary-subtle text-secondary">{cell.getValue()}</span>;
          }
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => (
          <UncontrolledDropdown>
            <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm dropdown" tag="button">
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem href={`/invoice/${cellProps.row.original._id}`}>
                <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
              </DropdownItem>
              <DropdownItem href={`/invoice/edit/${cellProps.row.original._id}`}>
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                href="#"
                onClick={() => onClickDelete(cellProps.row.original)}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ),
      },
    ],
    [checkedAll]
  );

  document.title = "Invoice List | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteInvoice}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={deleteMultiple}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Invoices List" pageTitle="Invoices" />
          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Invoices</h5>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-primary me-1"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        <Link to="/invoice-create" className="btn btn-danger">
                          <i className="ri-add-line align-bottom me-1"></i> Create Invoice
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
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
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoicesList;
