import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Alert, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import FeatherIcon from "feather-icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import DeleteModal from "../../Components/Common/DeleteModal";
import { sortDropOffsByDistance, getGeocodeAddress } from "../../services/map/GoogleMapsAPI";

interface IOrder {
  _id: string;
  datePickUp: string;
  timePickUp: string;
  dateDropOff: string;
  timeDropOff: string;
  vehicleID: string;
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

const OrderList = () => {
  const dispatch: any = useDispatch();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<HTMLInputElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortedDropOffs, setSortedDropOffs] = useState<{ [key: string]: string[] }>({});
  const [addresses, setAddresses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("http://localhost:4000/order/listOrder", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const orderData = await response.json();
          console.log("Fetched orders response:", orderData);
          setOrders(orderData.data || []);
          orderData.data.forEach((order: IOrder) => {
            console.log(`Order ID: ${order._id}, Vehicle ID: ${order.vehicleID}`);
          });
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error: unknown) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders");
      }
    };

    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("http://localhost:4000/vehicle/listVehicle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const vehicleData = await response.json();
          console.log("Fetched vehicles response:", vehicleData);
          setVehicles(vehicleData.data || []);
        } else {
          throw new Error("Failed to fetch vehicles");
        }
      } catch (error: unknown) {
        console.error("Error fetching vehicles:", error);
        setError("Error fetching vehicles");
      }
    };

    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("http://localhost:4000/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const driverData = await response.json();
          console.log("Fetched drivers response:", driverData);
          setDrivers(driverData.data || []);
        } else {
          throw new Error("Failed to fetch drivers");
        }
      } catch (error: unknown) {
        console.error("Error fetching drivers:", error);
        setError("Error fetching drivers");
      }
    };

    fetchOrders();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const onClickDelete = (order: IOrder) => {
    setSelectedOrder(order);
    setDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/order/deleteOrder/${selectedOrder._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setOrders(orders.filter((order) => order._id !== selectedOrder._id));
          setDeleteModal(false);
          toast.success("Order deleted successfully");
        } else {
          throw new Error("Failed to delete order");
        }
      } catch (error: unknown) {
        console.error("Error deleting order:", error);
        setError("Error deleting order");
      }
    }
  };

  const handleDeleteMultipleOrders = async () => {
    const deletedOrderIds: string[] = [];

    for (const element of selectedCheckBoxDelete) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/order/deleteOrder/${element.value}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          deletedOrderIds.push(element.value);
        } else {
          throw new Error(`Failed to delete order ${element.value}`);
        }
      } catch (error: unknown) {
        console.error(`Error deleting order ${element.value}:`, error);
        setError("Error deleting selected orders");
      }
    }

    // Update orders state
    if (deletedOrderIds.length > 0) {
      setOrders((prevOrders) => prevOrders.filter((order) => !deletedOrderIds.includes(order._id)));
      setIsMultiDeleteButton(false);
      setDeleteModalMulti(false);
      (document.getElementById("checkBoxAll") as HTMLInputElement).checked = false;
      toast.success("Selected orders deleted successfully");
    }
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".orderCheckBox:checked") as NodeListOf<HTMLInputElement>;
    setSelectedCheckBoxDelete(Array.from(ele));
    setIsMultiDeleteButton(ele.length > 0);
  };

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll") as HTMLInputElement;
    const ele = document.querySelectorAll(".orderCheckBox") as NodeListOf<HTMLInputElement>;

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const getVehicleId = (vehicleID: string) => {
    console.log("Vehicle ID from order:", vehicleID); // Add this line
    console.log("Vehicles:", vehicles); // Add this line
    const vehicle = vehicles.find((v) => v._id === vehicleID);
    return vehicle ? vehicle.vehicleId : "N/A";
  };

  const getDriverName = (driverID: string) => {
    const driver = drivers.find((d) => d._id === driverID);
    return driver ? driver.firstname : "N/A";
  };

  const getAddress = async (lat: number, lng: number): Promise<string> => {
    const key = `${lat},${lng}`;
    if (addresses[key]) {
      return addresses[key];
    } else {
      try {
        const address = await getGeocodeAddress(lat, lng);
        setAddresses((prev) => ({ ...prev, [key]: address }));
        return address;
      } catch (error: unknown) {
        console.error("Error fetching address:", error);
        return "Unknown address";
      }
    }
  };

  const handleDropDownClick = async (orderID: string) => {
    if (!sortedDropOffs[orderID]) {
      const order = orders.find((o) => o._id === orderID);
      if (order) {
        try {
          const sorted = await sortDropOffsByDistance(order.drop_off);
          setSortedDropOffs((prev) => ({ ...prev, [orderID]: sorted }));
        } catch (error: unknown) {
          setError(`Failed to sort drop-offs by distance: ${(error as Error).message}`);
        }
      }
    }
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
        cell: (cell: any) => {
          return (
            <input
              type="checkbox"
              className="orderCheckBox form-check-input"
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
        accessorKey: "_id",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.row.index + 1}</span>;
        },
      },
      {
        header: "Pick Up Date",
        accessorKey: "datePickUp",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Pick Up Time",
        accessorKey: "timePickUp",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Drop Off Date",
        accessorKey: "dateDropOff",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Drop Off Time",
        accessorKey: "timeDropOff",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Vehicle",
        accessorKey: "vehicleID",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{getVehicleId(cell.getValue())}</span>;
        },
      },
      {
        header: "Driver",
        accessorKey: "driver",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{getDriverName(cell.getValue())}</span>;
        },
      },
      {
        header: "Pick Up Location",
        accessorKey: "pick_up",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const coordinates = cell.getValue().split(",");
          const lat = parseFloat(coordinates[0]);
          const lng = parseFloat(coordinates[1]);
          const key = `${lat},${lng}`;
          const address = addresses[key] || cell.getValue();
          getAddress(lat, lng);
          return <span>{address}</span>;
        },
      },
      {
        header: "Drop Off Locations",
        accessorKey: "drop_off",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const orderID = cell.row.original._id;
          const dropOffs = sortedDropOffs[orderID] || cell.getValue();

          return (
            <UncontrolledDropdown onClick={() => handleDropDownClick(orderID)}>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
                <FeatherIcon icon="map-pin" className="icon-sm" />
              </DropdownToggle>
              <DropdownMenu>
                {dropOffs.map((location: string, index: number) => {
                  const coordinates = location.split(",");
                  const lat = parseFloat(coordinates[0]);
                  const lng = parseFloat(coordinates[1]);
                  const key = `${lat},${lng}`;
                  const address = addresses[key] || location;
                  getAddress(lat, lng);
                  return <DropdownItem key={index}>{address}</DropdownItem>;
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
      {
        header: "Consumer",
        accessorKey: "consumer",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Income",
        accessorKey: "income",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "orderStatus",
        enableColumnFilter: false,
        cell: (cell: any) => {
          switch (cell.getValue()) {
            case "Start":
              return <span className="badge text-uppercase bg-success-subtle text-success">{cell.getValue()}</span>;
            case "In Progress":
              return <span className="badge text-uppercase bg-warning-subtle text-warning">{cell.getValue()}</span>;
            case "Completed":
              return <span className="badge text-uppercase bg-primary-subtle text-primary">{cell.getValue()}</span>;
            default:
              return <span className="badge text-uppercase bg-secondary-subtle text-secondary">{cell.getValue()}</span>;
          }
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm dropdown" tag="button">
                <i className="ri-more-fill align-middle"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem onClick={() => onClickDelete(cellProps.row.original)}>
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [checkedAll, vehicles, drivers, sortedDropOffs, deleteCheckbox, addresses]
  );

  document.title = "Orders List";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={handleDeleteMultipleOrders}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Order List" pageTitle="Orders" />
          <Row>
            <Col lg={12}>
              <Card id="orderList" className="hide-checkbox hide-select-and-filters">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Orders</h5>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        {isMultiDeleteButton && (
                          <button className="btn btn-primary me-1" onClick={() => setDeleteModalMulti(true)}>
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        <Link to="/order-create" className="btn btn-danger">
                          <i className="ri-add-line align-bottom me-1"></i> Create Order
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {Array.isArray(orders) && orders.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={orders}
                        isGlobalFilter={true}
                        customPageSize={10}
                        isInvoiceListFilter={false}
                        theadClass="text-muted text-uppercase"
                        SearchPlaceholder="Search for order, customer, location or something..."
                      />
                    ) : (
                      <div>No orders found</div>
                    )}
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

export default OrderList;
