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
  Label,
  Input,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import CountUp from "react-countup";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import Icons
import FeatherIcon from "feather-icons-react";
import { invoiceWidgets } from "../../common/data/invoiceList";

//Import actions
import {
  getInvoices as onGetInvoices,
  deleteInvoice as onDeleteInvoice,
} from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../Components/Common/Loader";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSelector } from "reselect";

import { createInvoice } from "../../services/invoices";
import { listOrder } from "services/order";

// interface Iinvoice {
//   customer: string;
//   address: string;
//   listorderId: string[];
// }
interface IOrder {
  _id: string;
  date: String;
  time: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off: [string];
  consumer: string;
  remark: string;
}

const InvoiceCreate = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [istorderId, setlistorderId] = useState([""]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await listOrder();
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "customer") {
      setCustomer(value);
    } else if (name === "address") {
      setAddress(value);
      // } else if (name === "remarks") {
      //   setRemarks(value);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const invoiceCreate: any = await createInvoice({
        customer: customer,
        address: address,
        // listorderId: ,
      });
      console.log("Invoice create successful:", invoiceCreate);
      navigate("/car");
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.Invoice;
  const selectinvoiceProperties = createSelector(
    selectLayoutState,
    (state) => ({
      invoices: state.invoices,
      isInvoiceSuccess: state.isInvoiceSuccess,
      error: state.error,
    })
  );

  // Inside your component
  const { invoices, isInvoiceSuccess, error } = useSelector(
    selectinvoiceProperties
  );

  //delete invoice
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (invoices && !invoices.length) {
      dispatch(onGetInvoices());
    }
  }, [dispatch, invoices]);

  useEffect(() => {
    setInvoice(invoices);
  }, [invoices]);

  // Delete Data
  const onClickDelete = (invoice: any) => {
    setInvoice(invoice);
    setDeleteModal(true);
  };

  const handleDeleteInvoice = () => {
    if (invoice) {
      dispatch(onDeleteInvoice(invoice._id));
      setDeleteModal(false);
    }
  };

  const handleValidDate = (date: any) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  const handleValidTime = (time: any) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
      meridiem = "PM";
    } else {
      meridiem = "AM";
    }
    const updateTime =
      moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
    return updateTime;
  };

  // Checked All
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

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);

  const deleteMultiple = () => {
    const checkall: any = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element: any) => {
      dispatch(onDeleteInvoice(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele: any = document.querySelectorAll(".invoiceCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  //Column
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
        cell: (cell: any) => {
          return (
            <input
              type="checkbox"
              className="invoiceCheckBox form-check-input"
              value={cell.getValue()}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
        accessorKey: "_id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "No.",
        accessorKey: "vehicleId",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.row.index + 1}</span>;
        },
      },
      {
        header: "วันที่",
        accessorKey: "date",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            {handleValidDate(cell.getValue())},{" "}
            <small className="text-muted">
              {handleValidTime(cell.getValue())}
            </small>
          </>
        ),
      },
      {
        header: "ลูกค้า",
        accessorKey: "consumer",
        enableColumnFilter: false,
      },
      {
        header: "ทะเบียน",
        accessorKey: "vehicle",
        enableColumnFilter: false,
      },
      {
        header: "คนขับ",
        accessorKey: "driver",
        enableColumnFilter: false,
      },
      {
        header: "สถานที่รับ",
        accessorKey: "pick_up",
        enableColumnFilter: false,
      },
      {
        header: "สถานที่ส่ง",
        accessorKey: "drop_off",
        enableColumnFilter: false,
      },
      {
        header: "ยอด",
        accessorKey: "income",
        enableColumnFilter: false,
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
          onDeleteClick={() => handleDeleteInvoice()}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Invoices List" pageTitle="Invoices" />
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
                  placeholder="Enter Vehicle Id"
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
                  placeholder="Enter Vehicle Id"
                  name="address"
                  value={address}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col lg={12}>
              <Label htmlFor="vehicleId" className="form-label">
                Order
              </Label>
              <Card id="invoiceList">
                <CardBody className="pt-0">
                  <div>
                    {/* {isInvoiceSuccess && invoices.length ? ( */}
                    <TableContainer
                      columns={columns}
                      data={orders}
                      isGlobalFilter={true}
                      customPageSize={10}
                      isInvoiceListFilter={true}
                      theadClass="text-muted text-uppercase"
                      SearchPlaceholder="Search for customer, email, country, status or something..."
                    />
                    {/* ) : (
                      <Loader error={error} />
                    )} */}
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

export default InvoiceCreate;
