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
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import FeatherIcon from "feather-icons-react";
import { listVehicle, deleteVehicle, updateVehicle } from "../../services/vehicle"; // Import updateVehicle function
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
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<string[]>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    vehicleId: "",
    vehicleStatus: "OK",
    remarks: "",
  });

  const fetchVehicles = async () => {
    try {
      const response = await listVehicle();
      setVehicles(response.data);
    } catch (error) {
      setError("Error fetching vehicles");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onClickDelete = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteModal(true);
  };

  const onClickEdit = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setEditFormData({
      _id: vehicle._id,
      vehicleId: vehicle.vehicleId,
      vehicleStatus: vehicle.vehicleStatus,
      remarks: vehicle.remarks,
    });
    setEditModal(true);
  };

  const handleDeleteVehicle = async () => {
    if (selectedVehicle) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`http://localhost:4000/vehicle/deleteVehicle/${selectedVehicle._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setVehicles(vehicles.filter((vehicle) => vehicle._id !== selectedVehicle._id));
          setDeleteModal(false);
          toast.success("Vehicle deleted successfully");
        } else {
          throw new Error("Failed to delete vehicle");
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        setError("Error deleting vehicle");
      }
    }
  };

  const deleteMultiple = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await Promise.all(selectedCheckBoxDelete.map(async (id) => {
        const response = await fetch(`http://localhost:4000/vehicle/deleteVehicle/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete vehicle with ID ${id}`);
        }
      }));

      setVehicles(vehicles.filter((vehicle) => !selectedCheckBoxDelete.includes(vehicle._id)));
      setIsMultiDeleteButton(false);
      setDeleteModalMulti(false);
      toast.success("Selected vehicles deleted successfully");
    } catch (error) {
      setError("Error deleting selected vehicles");
      console.error(error);
    }
  };

  const handleUpdateVehicle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`http://localhost:4000/vehicle/updateVehicle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setEditModal(false);
        toast.success("Vehicle updated successfully");
        fetchVehicles(); // Re-fetch the vehicles to refresh the table
      } else {
        throw new Error("Failed to update vehicle");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setError("Error updating vehicle");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
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
              <DropdownItem onClick={() => onClickEdit(cellProps.row.original)}>
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => onClickDelete(cellProps.row.original)}>
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ),
      },
    ],
    [checkedAll]
  );

  document.title = "Vehicle List";

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

        <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
          <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Vehicle</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="vehicleId">Vehicle ID</Label>
                <Input
                  type="text"
                  name="vehicleId"
                  id="vehicleId"
                  value={editFormData.vehicleId}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="vehicleStatus">Status</Label>
                <Input
                  type="select"
                  name="vehicleStatus"
                  id="vehicleStatus"
                  value={editFormData.vehicleStatus}
                  onChange={handleChange}
                >
                  <option value="Ok">OK</option>
                  <option value="notOK">Not OK</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="remarks">Remarks</Label>
                <Input
                  type="text"
                  name="remarks"
                  id="remarks"
                  value={editFormData.remarks}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdateVehicle}>
              Save
            </Button>
            <Button color="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

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
