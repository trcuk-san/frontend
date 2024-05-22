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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createInvoice } from "../../services/invoices";
import { listOrder, updateOrderInvoices } from "../../services/order"; // Ensure this import is correct
import FeatherIcon from "feather-icons-react"; // Add the missing import

interface IOrder {
  _id: string;
  datePickUp: string;
  timePickUp: string;
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
  invoiced: boolean; // Add this field
}

const InvoiceCreate = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [listorderId, setListOrderId] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
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
          console.log("Fetched Orders: ", orderData);
          const filteredOrders = orderData.data.filter((order: IOrder) => !order.invoiced);
          setOrders(filteredOrders);
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

  const handleOrderSelection = (orderId: string) => {
    setListOrderId((prevSelected) => {
      const newSelected = prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId];

      const selectedOrders = orders.filter((order) => newSelected.includes(order._id));
      const newTotalAmount = selectedOrders.reduce((total, order) => {
        return total + (order.income - order.oilFee - order.tollwayFee - order.otherFee);
      }, 0);
      setTotalAmount(newTotalAmount);
      setIsButtonVisible(newSelected.length > 0);

      return newSelected;
    });
  };

  const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const invoiceCreate = await createInvoice({
        invoiceId: `INV-${Date.now()}`,
        customer,
        address,
        listorderId,
        amount: totalAmount,
        invoicestatus: false
      });

      // Update the invoiced status to true for the selected orders
      await Promise.all(listorderId.map(orderId => updateOrderInvoices(orderId, { invoiced: true })));

      console.log("Invoice create successful:", invoiceCreate);
      navigate("/invoices");
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

  const deleteCheckbox = () => {
    const checkboxes = document.querySelectorAll(".invoiceCheckBox:checked") as NodeListOf<HTMLInputElement>;
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
            className="invoiceCheckBox form-check-input"
            value={cell.getValue()}
            onChange={() => handleOrderSelection(cell.getValue())}
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
        accessorKey: "datePickUp",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const dateValue = cell.getValue();
          const timeValue = cell.row.original.timePickUp;
          return (
            <>
              {handleValidDate(dateValue)}, <small className="text-muted">{handleValidTime(timeValue)}</small>
            </>
          );
        },
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
          const { income } = cell.row.original;
          return <span>{income}</span>;
        },
      },
    ],
    [checkedAll, vehicles, drivers]
  );

  document.title = "Invoice Create | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
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
              <Label htmlFor="orderId" className="form-label">
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
              {isButtonVisible && (
                <div className="d-flex justify-content-end mt-3">
                  <Button color="primary" onClick={submit}>
                    Create Invoice
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

export default InvoiceCreate;
