import React, { useState, useEffect, useMemo } from "react";
import { isEmpty } from "lodash";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import {jwtDecode} from "jwt-decode";
import avatar from "../../assets/images/users/avatar-1.jpg";
import { createSelector } from "reselect";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import FeatherIcon from "feather-icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../Components/Common/DeleteModal";

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

interface IVehicle {
  _id: string;
  vehicleId: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [email, setEmail] = useState("admin@gmail.com");
  const [idx, setIdx] = useState("1");
  const [userName, setUserName] = useState("Admin");
  const [profilePicture, setProfilePicture] = useState(avatar);
  const [phone, setPhone] = useState("N/A");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setError("No token found in localStorage");
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.uid;
        console.log("Decoded userId from token:", userId);

        const response = await fetch(`http://localhost:4000/auth/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Fetched user data:", JSON.stringify(userData, null, 2));
          setUser(userData);
          setUserName(`${userData.firstname} ${userData.lastname}`);
          setEmail(userData.email);
          setIdx(userData._id);
          setPhone(userData.phone);
          setProfilePicture(userData.profile_picture || avatar);
        } else {
          console.error("No user data in response:", response.statusText);
          setError("No user data found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded: any = jwtDecode(token);
        const userId = decoded.uid;

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
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Error fetching vehicles");
      }
    };

    fetchProfile();
    fetchOrders();
    fetchVehicles();
  }, []);

  const getVehicleId = (vehicleID: string) => {
    const vehicle = vehicles.find((v) => v._id === vehicleID);
    return vehicle ? vehicle.vehicleId : "N/A";
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
    ],
    [vehicles]
  );

  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>
          <BreadCrumb title="User Profile" pageTitle="Profile" />
          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">Username Updated To {userName}</Alert>}

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
                        <h5>{userName}</h5>
                        <p className="mb-0">Id No : #{idx}</p>
                        <p className="mb-1">Email : {email}</p>
                        <p className="mb-1">Phone : {phone}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4 text-center">My Orders</h4>

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

export default UserProfile;
