import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import FeatherIcon from "feather-icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../Components/Common/DeleteModal";
import avatar from "../../assets/images/users/avatar-1.jpg";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  type: string; // New field
}

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

const MemberProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [email, setEmail] = useState("admin@gmail.com");
  const [idx, setIdx] = useState("1");
  const [userName, setUserName] = useState("Admin");
  const [profilePicture, setProfilePicture] = useState(avatar);
  const [phone, setPhone] = useState("N/A");
  const [userType, setUserType] = useState("User"); // New state for user type
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || userId === "undefined") {
      setError("Invalid user ID");
      return;
    }

    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/auth/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const memberData = await response.json();
          if (!memberData || !memberData.firstname) {
            throw new Error("Invalid member data structure");
          }

          setUser(memberData);
          setUserName(`${memberData.firstname} ${memberData.lastname}`);
          setEmail(memberData.email);
          setIdx(memberData._id);
          setPhone(memberData.phone);
          setProfilePicture(memberData.profile_picture || avatar);
          setUserType(memberData.type); // Set user type
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to fetch member: ${response.status} ${response.statusText} - ${errorText}`);
        }
      } catch (error) {
        setError("Error fetching member");
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/order/listOrderByDriver/${userId}`, {
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
      } catch (error) {
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
      } catch (error) {
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
      } catch (error) {
        setError("Error fetching drivers");
      }
    };

    fetchMember();
    fetchOrders();
    fetchVehicles();
    fetchDrivers();
  }, [userId]);

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
      } catch (error) {
        setError("Error deleting order");
      }
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

  const columns = useMemo(
    () => [
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
                  const address = location.split(",")[0];
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
                <DropdownItem onClick={() => navigate(`/order/${cellProps.row.original._id}`)}>
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
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
    [vehicles, drivers, navigate]
  );

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  document.title = "Profile";

  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>
          <BreadCrumb title="Member Profile" pageTitle="Members" />
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">Username Updated To {userName}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={profilePicture}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userName || "Admin"}</h5>
                        <p className="mb-0">Id No : #{idx}</p>
                        <p className="mb-1">Email : {email}</p>
                        <p className="mb-1">Phone : {phone}</p>
                        <p className="mb-1">Type : {userType}</p> {/* Display user type */}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4 text-center">Order History</h4>

          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={orders}
                isGlobalFilter={true}
                customPageSize={10}
                isInvoiceListFilter={false}
                theadClass="text-muted text-uppercase"
                SearchPlaceholder="Search for order, customer, location or something..."
              />
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MemberProfile;
