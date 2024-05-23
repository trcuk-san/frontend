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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import { listReceipt, deleteReceipt, updateReceipt } from "../../services/receipts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IReceipt {
  _id: string;
  receiptId: string;
  customer: string;
  address: string;
  listinvoice: string[];
  amount: number;
  updatedAt: string;
}

const ReceiptList = () => {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<IReceipt | null>(null);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<string[]>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await listReceipt();
        console.log("Fetched Receipts Data: ", response.data);
        setReceipts(response.data || []);
      } catch (error) {
        setError("Error fetching receipts");
        console.error(error);
      }
    };
    fetchReceipts();
  }, []);

  const onClickDelete = (receipt: IReceipt) => {
    setSelectedReceipt(receipt);
    setDeleteModal(true);
  };

  const handleDeleteReceipt = async () => {
    if (selectedReceipt) {
      try {
        await deleteReceipt(selectedReceipt._id);
        setReceipts(receipts.filter((receipt) => receipt._id !== selectedReceipt._id));
        setDeleteModal(false);
        toast.success("Receipt deleted successfully");
      } catch (error) {
        setError("Error deleting receipt");
        console.error(error);
      }
    }
  };

  const deleteMultiple = async () => {
    try {
      await Promise.all(selectedCheckBoxDelete.map((id) => deleteReceipt(id)));
      setReceipts(receipts.filter((receipt) => !selectedCheckBoxDelete.includes(receipt._id)));
      setIsMultiDeleteButton(false);
      setDeleteModalMulti(false);
      toast.success("Selected receipts deleted successfully");
    } catch (error) {
      setError("Error deleting selected receipts");
      console.error(error);
    }
  };

  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".receiptCheckBox");

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
    const ele: any = document.querySelectorAll(".receiptCheckBox:checked");
    const selectedIds = Array.from(ele).map((checkbox: any) => checkbox.value);
    setSelectedCheckBoxDelete(selectedIds);
    setIsMultiDeleteButton(selectedIds.length > 0);
  };

  const handleValidDate = (date: any) => moment(date).format("DD MMM Y");
  const handleValidTime = (time: any) => moment(time).format("hh:mm A");

  const handleEdit = (receipt: IReceipt) => {
    setSelectedReceipt(receipt);
    setEditModal(true);
  };

  const handleSave = async () => {
    if (selectedReceipt) {
      try {
        await updateReceipt(selectedReceipt._id, selectedReceipt);
        setReceipts(receipts.map((r) => (r._id === selectedReceipt._id ? selectedReceipt : r)));
        toast.success("Receipt updated successfully");
        setEditModal(false);
      } catch (error) {
        setError("Error updating receipt");
        console.error(error);
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
        cell: (cell: any) => (
          <input
            type="checkbox"
            className="receiptCheckBox form-check-input"
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
        accessorKey: "receiptId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link to={`/receipt/${cell.getValue()}`} className="fw-medium link-primary">
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Customer",
        accessorKey: "customer",
        enableColumnFilter: false,
      },
      {
        header: "Date",
        accessorKey: "updatedAt",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const dateValue = cell.getValue();
          return (
            <>
              {handleValidDate(dateValue)}, <small className="text-muted">{handleValidTime(dateValue)}</small>
            </>
          );
        },
      },
      {
        header: "Amount",
        accessorKey: "amount",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cellProps: any) => (
          <UncontrolledDropdown>
            <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm dropdown" tag="button">
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem href={`/receipt/${cellProps.row.original._id}`}>
                <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
              </DropdownItem>
              <DropdownItem onClick={() => handleEdit(cellProps.row.original)}>
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

  document.title = "Receipt List | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteReceipt}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={deleteMultiple}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
          <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Receipt</ModalHeader>
          <ModalBody>
            {selectedReceipt && (
              <>
                <FormGroup>
                  <Label for="customer">Customer</Label>
                  <Input
                    type="text"
                    name="customer"
                    id="customer"
                    value={selectedReceipt.customer}
                    onChange={(e) => setSelectedReceipt({ ...selectedReceipt, customer: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    value={selectedReceipt.address}
                    onChange={(e) => setSelectedReceipt({ ...selectedReceipt, address: e.target.value })}
                  />
                </FormGroup>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Container fluid>
          <BreadCrumb title="Receipts List" pageTitle="Receipts" />
          <Row>
            <Col lg={12}>
              <Card id="receiptList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Receipts</h5>
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
                        <Link to="/receipt-create" className="btn btn-danger">
                          <i className="ri-add-line align-bottom me-1"></i> Create Receipt
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    <TableContainer
                      columns={columns}
                      data={receipts || []}
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

export default ReceiptList;
