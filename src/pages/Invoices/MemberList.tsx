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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import FeatherIcon from "feather-icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "Components/Common/DeleteModal";
import { deleteUser, updateUser } from "services/auth";

interface IMember {
  _id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  profile_picture: string;
  type: string; // Add this field
}

const Member: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<IMember[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState<boolean>(false);
  const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching users: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        if (result && result.data) {
          setMembers(result.data);  // Ensure setting the correct data
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching users:", error.message);
          setErrors({ fetch: 'Error fetching members' });
        } else {
          console.error("Unknown error:", error);
        }
      }
    };

    fetchMembers();
  }, []);

  const onClickDelete = (member: IMember) => {
    setSelectedMember(member);
    setDeleteModal(true);
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        await fetch(`${API_BASE_URL}/auth/users/${selectedMember._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setMembers(members.filter(m => m._id !== selectedMember._id));
        setDeleteModal(false);
        toast.success("User deleted successfully");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error deleting member:", error.message);
          setErrors({ delete: 'Error deleting member' });
        } else {
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const onClickEdit = (member: IMember) => {
    setSelectedMember(member);
    setEditModal(true);
  };

  const handleEditMember = async () => {
    if (selectedMember) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const updatedMember = {
          firstname: selectedMember.firstname,
          lastname: selectedMember.lastname,
          phone: selectedMember.phone,
          email: selectedMember.email,
          type: selectedMember.type, // Ensure type is included in updates
        };

        await fetch(`${API_BASE_URL}/auth/users/${selectedMember._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedMember)
        });

        setMembers(members.map(m => (m._id === selectedMember._id ? { ...m, ...updatedMember } : m)));
        setEditModal(false);
        toast.success("User updated successfully");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error updating member:", error.message);
          setErrors({ edit: 'Error updating member' });
        } else {
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".memberCheckBox");

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
    const ele: any = document.querySelectorAll(".memberCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
  };

  const deleteMultiple = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const checkall: any = document.getElementById("checkBoxAll");
    for (const element of Array.from(document.querySelectorAll(".memberCheckBox:checked")) as HTMLInputElement[]) {
      try {
        await fetch(`${API_BASE_URL}/auth/users/${element.value}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMembers(members.filter(m => m._id !== element.value));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error deleting user ${element.value}:`, error.message);
          setErrors({ delete: 'Error deleting selected members' });
        } else {
          console.error("Unknown error:", error);
        }
      }
    }
    setIsMultiDeleteButton(false);
    checkall.checked = false;
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
        header: "First Name",
        accessorKey: "firstname",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Last Name",
        accessorKey: "lastname",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Profile Picture",
        accessorKey: "profile_picture",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <img src={cell.getValue()} alt="Profile" width={50} height={50} />;
        },
      },
      {
        header: "Type",
        accessorKey: "type", // Add this column
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn btn-soft-secondary btn-sm dropdown"
                tag="button"
              >
                <i className="ri-more-fill align-middle"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem onClick={() => navigate(`/profile/${cellProps.row.original._id}`)}>
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
                </DropdownItem>
                <DropdownItem onClick={() => onClickEdit(cellProps.row.original)}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                  Edit
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => onClickDelete(cellProps.row.original)}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [checkedAll]
  );
  

  document.title = "Members List";

  return (
    <React.Fragment>
      <style>
        {`
          .hide-checkbox .form-check-input {
            display: none;
          }

          .hide-select-and-filters .custom-select,
          .hide-select-and-filters .date-filter,
          .hide-select-and-filters .filters {
            display: none !important;
          }
        `}
      </style>
      <div className="page-content">
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
          <ModalHeader toggle={() => setDeleteModal(false)}>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this user?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteMember}>Delete</Button>{' '}
            <Button color="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
          <ModalHeader toggle={() => setEditModal(false)}>Edit Member</ModalHeader>
          <ModalBody>
            {selectedMember && (
              <Form>
                <FormGroup>
                  <Label for="firstname">First Name</Label>
                  <Input
                    type="text"
                    id="firstname"
                    value={selectedMember.firstname}
                    onChange={e => setSelectedMember({ ...selectedMember, firstname: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="lastname">Last Name</Label>
                  <Input
                    type="text"
                    id="lastname"
                    value={selectedMember.lastname}
                    onChange={e => setSelectedMember({ ...selectedMember, lastname: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <Input
                    type="text"
                    id="phone"
                    value={selectedMember.phone}
                    onChange={e => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={selectedMember.email}
                    onChange={e => setSelectedMember({ ...selectedMember, email: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="type">Type</Label>
                  <Input
                    type="select"
                    id="type"
                    value={selectedMember.type}
                    onChange={e => setSelectedMember({ ...selectedMember, type: e.target.value })}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Owner">Owner</option>
                  </Input>
                </FormGroup>
              </Form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleEditMember}>Save</Button>{' '}
            <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Container fluid>
          <BreadCrumb title="Member List" pageTitle="Member" />
          <Row>
            <Col lg={12}>
              <Card id="memberList" className="hide-checkbox hide-select-and-filters">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Members</h5>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-primary me-1"
                            onClick={() => setDeleteModal(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        <Link to="/register" className="btn btn-danger">
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          Create Member
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {members.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={members}
                        isGlobalFilter={true}
                        customPageSize={10}
                        isInvoiceListFilter={false}
                        theadClass="text-muted text-uppercase"
                        SearchPlaceholder="Search for member, email, country, status or something..."
                      />
                    ) : (
                      <div>No members found</div>
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

export default Member;
