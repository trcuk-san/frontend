import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText, Alert } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import FeatherIcon from "feather-icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import DeleteModal from "../../Components/Common/DeleteModal";
import MapModal from "../../services/map/MapModal";

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

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedDropOffIndex, setSelectedDropOffIndex] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<IOrder>({
    _id: "",
    datePickUp: "",
    timePickUp: "",
    dateDropOff: "",
    timeDropOff: "",
    vehicle: "",
    driver: "",
    pick_up: "",
    drop_off: [""],
    consumer: "",
    income: 0,
    oilFee: 0,
    tollwayFee: 0,
    otherFee: 0,
    remark: "",
    orderStatus: "Unstart",
    invoiced: false,
  });

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
          setOrders(orderData.data || []);
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

    for (const id of selectedCheckBoxDelete) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/order/deleteOrder/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          deletedOrderIds.push(id);
        } else {
          throw new Error(`Failed to delete order ${id}`);
        }
      } catch (error: unknown) {
        console.error(`Error deleting order ${id}:`, error);
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
    const checkboxes = document.querySelectorAll(".orderCheckBox:checked") as NodeListOf<HTMLInputElement>;
    const selectedIds = Array.from(checkboxes).map((checkbox) => checkbox.value);
    setSelectedCheckBoxDelete(selectedIds);
    setIsMultiDeleteButton(selectedIds.length > 0);
  };

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll") as HTMLInputElement;
    const checkboxes = document.querySelectorAll(".orderCheckBox") as NodeListOf<HTMLInputElement>;

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

  const getVehicleId = (vehicleID: string) => {
    const vehicle = vehicles.find((v) => v._id === vehicleID);
    return vehicle ? vehicle.vehicleId : "N/A";
  };

  const getDriverName = (driverID: string) => {
    const driver = drivers.find((d) => d._id === driverID);
    return driver ? driver.firstname : "N/A";
  };

  const onClickEdit = (order: IOrder) => {
    setSelectedOrder(order);
    setEditFormData(order);
    setEditModal(true);
  };

  const handleEditOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`http://localhost:4000/order/updateOrder/${selectedOrder?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)));
        setEditModal(false);
        toast.success("Order updated successfully");
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error: unknown) {
      console.error("Error updating order:", error);
      setError("Error updating order");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDropOffChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { value } = e.target;
    const updatedDropOff = editFormData.drop_off.map((dropOff, i) => (i === index ? value : dropOff));
    setEditFormData((prevState) => ({
      ...prevState,
      drop_off: updatedDropOff,
    }));
  };

  const handleAddDropOff = () => {
    setEditFormData((prevState) => ({
      ...prevState,
      drop_off: [...prevState.drop_off, ""],
    }));
  };

  const handleRemoveDropOff = (index: number) => {
    const updatedDropOff = editFormData.drop_off.filter((_, i) => i !== index);
    setEditFormData((prevState) => ({
      ...prevState,
      drop_off: updatedDropOff,
    }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    const { lat, lng, address } = location;
    const formattedLocation = `${address},${lat},${lng}`;

    if (selectedDropOffIndex !== null) {
      const updatedDropOff = editFormData.drop_off.map((dropOff, i) => (i === selectedDropOffIndex ? formattedLocation : dropOff));
      setEditFormData((prevState) => ({
        ...prevState,
        drop_off: updatedDropOff,
      }));
    } else {
      setEditFormData((prevState) => ({
        ...prevState,
        pick_up: address,
      }));
    }
    setSelectedDropOffIndex(null);
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
        accessorKey: "vehicle",
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
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Drop Off Locations",
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
            case "Unstart":
              return <span className="badge text-uppercase bg-secondary-subtle text-secondary">{cell.getValue()}</span>;
            case "Start":
              return <span className="badge text-uppercase bg-success-subtle text-success">{cell.getValue()}</span>;
            case "Sending":
              return <span className="badge text-uppercase bg-warning-subtle text-warning">{cell.getValue()}</span>;
            case "Finished":
              return <span className="badge text-uppercase bg-primary-subtle text-primary">{cell.getValue()}</span>;
            case "Cancel":
              return <span className="badge text-uppercase bg-danger-subtle text-danger">{cell.getValue()}</span>;
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
                <DropdownItem onClick={() => navigate(`/order/${cellProps.row.original._id}`)}>
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
                </DropdownItem>
                <DropdownItem onClick={() => onClickEdit(cellProps.row.original)}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
                </DropdownItem>
                <DropdownItem onClick={() => onClickDelete(cellProps.row.original)}>
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [checkedAll, vehicles, drivers, deleteCheckbox, navigate]
  );

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const response = await fetch("http://localhost:4000/order/listOrder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrders(orderData.data || []);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders");
    }
  };

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
        <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
          <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Order</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="datePickUp">Pick Up Date</Label>
                <Input type="date" name="datePickUp" id="datePickUp" value={editFormData.datePickUp} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="timePickUp">Pick Up Time</Label>
                <Input type="time" name="timePickUp" id="timePickUp" value={editFormData.timePickUp} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="dateDropOff">Drop Off Date</Label>
                <Input type="date" name="dateDropOff" id="dateDropOff" value={editFormData.dateDropOff} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="timeDropOff">Drop Off Time</Label>
                <Input type="time" name="timeDropOff" id="timeDropOff" value={editFormData.timeDropOff} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="vehicle">Vehicle</Label>
                <Input type="select" name="vehicle" id="vehicle" value={editFormData.vehicle} onChange={handleChange}>
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleId}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="driver">Driver</Label>
                <Input type="select" name="driver" id="driver" value={editFormData.driver} onChange={handleChange}>
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.firstname} {driver.lastname}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="consumer">Consumer</Label>
                <Input type="text" name="consumer" id="consumer" value={editFormData.consumer} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="income">Income</Label>
                <Input type="number" name="income" id="income" value={editFormData.income} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="oilFee">Oil Fee</Label>
                <Input type="number" name="oilFee" id="oilFee" value={editFormData.oilFee} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="tollwayFee">Tollway Fee</Label>
                <Input type="number" name="tollwayFee" id="tollwayFee" value={editFormData.tollwayFee} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="otherFee">Other Fee</Label>
                <Input type="number" name="otherFee" id="otherFee" value={editFormData.otherFee} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="remark">Remark</Label>
                <Input type="text" name="remark" id="remark" value={editFormData.remark} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="orderStatus">Status</Label>
                <Input type="select" name="orderStatus" id="orderStatus" value={editFormData.orderStatus} onChange={handleChange}>
                  <option value="Unstart">Unstart</option>
                  <option value="Start">Start</option>
                  <option value="Sending">Sending</option>
                  <option value="Finished">Finished</option>
                  <option value="Cancel">Cancel</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="invoiced">Invoiced</Label>
                <Input type="select" name="invoiced" id="invoiced" value={editFormData.invoiced ? "true" : "false"} onChange={handleChange}>
                  <option value="false">False</option>
                  <option value="true">True</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="pick_up">Pick Up Location</Label>
                <InputGroup>
                  <Input type="text" name="pick_up" id="pick_up" value={editFormData.pick_up} onChange={handleChange} />
                  <InputGroupText>
                    <i
                      className="fa-solid fa-map-location"
                      onClick={() => {
                        setSelectedDropOffIndex(null);
                        setIsMapModalOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </InputGroupText>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="drop_off">Drop Off Locations</Label>
                {editFormData.drop_off.map((location, index) => (
                  <div key={index} style={{ position: "relative", marginBottom: "10px" }}>
                    <InputGroup>
                      <Input
                        type="text"
                        name={`drop_off${index}`}
                        value={location}
                        onChange={(e) => handleDropOffChange(e, index)}
                      />
                      <InputGroupText>
                        <i
                          className="fa-solid fa-map-location"
                          onClick={() => {
                            setSelectedDropOffIndex(index);
                            setIsMapModalOpen(true);
                          }}
                          style={{ cursor: 'pointer', marginRight: '10px' }}
                        ></i>
                        {index !== 0 && (
                          <Button color="danger" className="btn btn-sm" onClick={() => handleRemoveDropOff(index)}>
                            -
                          </Button>
                        )}
                      </InputGroupText>
                    </InputGroup>
                  </div>
                ))}
                <Button onClick={handleAddDropOff} color="primary" className="btn btn-primary btn-sm" type="button">
                  Add Drop Off Location
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleEditOrder}>
              Save
            </Button>
            <Button color="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
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
                        <Button color="primary" onClick={fetchData}>Refresh</Button>
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
      <MapModal
        isOpen={isMapModalOpen}
        toggle={() => setIsMapModalOpen(!isMapModalOpen)}
        onSelectLocation={(location) => handleLocationSelect(location)}
      />
    </React.Fragment>
  );
};

export default OrderList;
