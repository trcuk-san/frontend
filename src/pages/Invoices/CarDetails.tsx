import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import FeatherIcon from "feather-icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVehicleOrders } from "../../services/vehicle";
import DeleteModal from "../../Components/Common/DeleteModal";

interface IVehicle {
  _id: string;
  vehicleId: string;
  vehicleStatus: string;
  remarks: string;
  updatedAt: string;
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

const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await getVehicleOrders(vehicleId!);
        setVehicle(response.vehicle);
        setOrders(response.orders);
      } catch (error) {
        setError("Error fetching vehicle details");
        console.error(error);
      }
    };
    fetchVehicleDetails();
  }, [vehicleId]);

  const columns = useMemo(
    () => [
      {
        header: "No.",
        accessorKey: "_id",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.row.index + 1}</span>,
      },
      {
        header: "Pick Up Date",
        accessorKey: "datePickUp",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Pick Up Time",
        accessorKey: "timePickUp",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Drop Off Date",
        accessorKey: "dateDropOff",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Drop Off Time",
        accessorKey: "timeDropOff",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Driver",
        accessorKey: "driver",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Pick Up Location",
        accessorKey: "pick_up",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
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
        cell: (cell: any) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Income",
        accessorKey: "income",
        enableColumnFilter: false,
        cell: (cell: any) => <span>{cell.getValue()}</span>,
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
    []
  );

  if (error) {
    return <div>{error}</div>;
  }

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  document.title = "Vehicle Detail";

  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>
          <BreadCrumb title="Vehicle Detail" pageTitle="Vehicles" />
          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src="path/to/vehicle-image.jpg" // Replace with the vehicle image if available
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{vehicle.vehicleId}</h5>
                        <p className="mb-1">Status: {vehicle.vehicleStatus}</p>
                        <p className="mb-0">Remarks: {vehicle.remarks}</p>
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

export default VehicleDetail;
