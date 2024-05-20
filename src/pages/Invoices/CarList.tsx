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
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import FeatherIcon from "feather-icons-react";
import { listVehicle, deleteVehicle } from "../../services/vehicle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

interface IVehicle {
  _id: string;
  vehicleId: string;
  vehicleStatus: string;
  remarks: string;
  updatedAt: string;
}

const CarList = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<string[]>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await listVehicle();
        setVehicles(response.data);
      } catch (error) {
        setError("Error fetching vehicles");
        console.error(error);
      }
    };
    fetchVehicles();
  }, []);

  const onClickDelete = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteModal(true);
  };

  const handleDeleteVehicle = async () => {
    if (selectedVehicle) {
      try {
        await deleteVehicle(selectedVehicle._id);
        setVehicles(vehicles.filter((vehicle) => vehicle._id !== selectedVehicle._id));
        setDeleteModal(false);
        toast.success("Vehicle deleted successfully");
      } catch (error) {
        setError("Error deleting vehicle");
        console.error(error);
      }
    }
  };

  const deleteMultiple = async () => {
    try {
      await Promise.all(selectedCheckBoxDelete.map((id) => deleteVehicle(id)));
      setVehicles(vehicles.filter((vehicle) => !selectedCheckBoxDelete.includes(vehicle._id)));
      setIsMultiDeleteButton(false);
      setDeleteModalMulti(false);
      toast.success("Selected vehicles deleted successfully");
    } catch (error) {
      setError("Error deleting selected vehicles");
      console.error(error);
    }
  };

  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".vehicleCheckBox");

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
    const ele: any = document.querySelectorAll(".vehicleCheckBox:checked");
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
            className="vehicleCheckBox form-check-input"
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
        accessorKey: "vehicleId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link to={`/vehicle/${cell.getValue()}`} className="fw-medium link-primary">
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Status",
        accessorKey: "vehicleStatus",
        enableColumnFilter: false,
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
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
        header: "Action",
        cell: (cellProps: any) => (
          <UncontrolledDropdown>
            <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm dropdown" tag="button">
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem href={`/car/${cellProps.row.original._id}`}>
                <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
              </DropdownItem>
              <DropdownItem href={`/vehicle/edit/${cellProps.row.original._id}`}>
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

  document.title = "Vehicle List | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteVehicle}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={deleteMultiple}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Vehicle List" pageTitle="Vehicles" />
          <Row>
            <Col lg={12}>
              <Card id="vehicleList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Vehicles</h5>
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
                        <Link to="/car-create" className="btn btn-danger">
                          <i className="ri-add-line align-bottom me-1"></i> Create Vehicle
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    <TableContainer
                      columns={columns}
                      data={vehicles}
                      isGlobalFilter={true}
                      customPageSize={10}
                      isInvoiceListFilter={true}
                      theadClass="text-muted text-uppercase"
                      SearchPlaceholder="Search for vehicle, status, remarks or something..."
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

export default CarList;
