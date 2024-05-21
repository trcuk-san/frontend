import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";

// Import Icons
import FeatherIcon from "feather-icons-react";

// Redux
import { useSelector, useDispatch } from "react-redux";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSelector } from "reselect";

import { createInvoice } from "../../services/invoices";
import { listOrder } from "services/order";

interface IOrder {
  _id: string;
  date: string;
  time: string;
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
  updatedAt: string;
}

const InvoiceCreate = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [listorderId, setlistorderId] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      try {
        const orderResponse = await fetch("http://localhost:4000/order/listOrder", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrders(orderData.data || []);
        } else {
          throw new Error("Failed to fetch orders");
        }

        const vehicleResponse = await fetch("http://localhost:4000/vehicle/listVehicle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (vehicleResponse.ok) {
          const vehicleData = await vehicleResponse.json();
          setVehicles(vehicleData.data || []);
        } else {
          throw new Error("Failed to fetch vehicles");
        }

        const driverResponse = await fetch("http://localhost:4000/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (driverResponse.ok) {
          const driverData = await driverResponse.json();
          setDrivers(driverData.data || []);
        } else {
          throw new Error("Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "customer") {
      setCustomer(value);
    } else if (name === "address") {
      setAddress(value);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const invoiceCreate = await createInvoice({
        customer,
        address,
        listorderId,
      });
      console.log("Invoice create successful:", invoiceCreate);
      navigate("/car");
    } catch (error) {
      console.log(error);
    }
  };

  const getVehicleId = (vehicleID: string) => {
    const vehicle = vehicles.find((v) => v._id === vehicleID);
    return vehicle ? vehicle.vehicleId : "N/A";
  };

  const getDriverName = (driverID: string) => {
    const driver = drivers.find((d) => d._id === driverID);
    return driver ? driver.firstname : "N/A";
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

  const { invoices, isInvoiceSuccess, error } = useSelector(selectinvoiceProperties);

  useEffect(() => {
    if (invoices && !invoices.length) {
      // Dispatch getInvoices action here if needed
    }
  }, [dispatch, invoices]);

  useEffect(() => {
    setInvoice(invoices);
  }, [invoices]);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<any>(null);

  const onClickDelete = (invoice: any) => {
    setInvoice(invoice);
    setDeleteModal(true);
  };

  const handleDeleteInvoice = () => {
    if (invoice) {
      // Dispatch deleteInvoice action here if needed
      setDeleteModal(false);
    }
  };

  const handleValidDate = (date: string) => {
    const parsedDate = moment(date);
    return parsedDate.isValid() ? parsedDate.format("DD MMM YYYY") : "Invalid date";
  };

  const handleValidTime = (date: string) => {
    const parsedDate = moment(date);
    return parsedDate.isValid() ? parsedDate.format("hh:mm A") : "Invalid time";
  };

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll") as HTMLInputElement;
    const checkboxes = document.querySelectorAll(".invoiceCheckBox") as NodeListOf<HTMLInputElement>;

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

  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<string[]>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll") as HTMLInputElement;
    selectedCheckBoxDelete.forEach((element) => {
      // Dispatch deleteInvoice action for each element if needed
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkboxes = document.querySelectorAll(".invoiceCheckBox:checked") as NodeListOf<HTMLInputElement>;
    const selectedIds = Array.from(checkboxes).map((checkbox) => checkbox.value);
    setSelectedCheckBoxDelete(selectedIds);
    setIsMultiDeleteButton(selectedIds.length > 0);
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
        header: "No.",
        accessorKey: "_id",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.row.index + 1}</span>,
      },
      {
        header: "วันที่",
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
        header: "ลูกค้า",
        accessorKey: "consumer",
        enableColumnFilter: false,
      },
      {
        header: "ทะเบียน",
        accessorKey: "vehicle",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{getVehicleId(cell.getValue())}</span>;
        },
      },
      {
        header: "คนขับ",
        accessorKey: "driver",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{getDriverName(cell.getValue())}</span>;
        },
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
        cell: (cell: any) => {
          const dropOffs = cell.getValue();
          return (
            <UncontrolledDropdown>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
                <FeatherIcon icon="map-pin" className="icon-sm" />
              </DropdownToggle>
              <DropdownMenu>
                {dropOffs.map((location: string, index: number) => {
                  const parts = location.split(",");
                  const address = parts.slice(0, -2).join(",");
                  return <DropdownItem key={index}>{address}</DropdownItem>;
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
      {
        header: "ยอด",
        accessorKey: "income",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const { income, oilFee, tollwayFee, otherFee } = cell.row.original;
          return <span>{income - oilFee - tollwayFee - otherFee}</span>;
        },
      },
    ],
    [checkedAll, vehicles, drivers]
  );

  document.title = "Invoice Create | Velzon - React Admin & Dashboard Template";

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
              <Label htmlFor="vehicleId" className="form-label">
                Order
              </Label>
              <Card id="invoiceList">
                <CardBody className="pt-0">
                  <div>
                    <TableContainer
                      columns={columns}
                      data={orders}
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

export default InvoiceCreate;
