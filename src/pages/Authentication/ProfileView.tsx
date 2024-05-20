import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert, CardBody, Button, Label, Input, FormFeedback, Form } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
}

const MemberProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("admin@gmail.com");
  const [idx, setIdx] = useState("1");
  const [userName, setUserName] = useState("Admin");
  const [profilePicture, setProfilePicture] = useState(avatar);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("userId from URL params:", userId);

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

        console.log("Fetching member with userId:", userId);

        const response = await fetch(`http://localhost:4000/auth/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const memberData = await response.json();
          console.log("Fetched member data:", memberData);

          if (!memberData || !memberData.firstname) {
            throw new Error("Invalid member data structure");
          }

          setUser(memberData);
          setUserName(memberData.firstname);
          setEmail(memberData.email);
          setIdx(memberData._id);
          setProfilePicture(memberData.profile_picture || avatar);
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to fetch member: ${response.status} ${response.statusText} - ${errorText}`);
        }
      } catch (error) {
        console.error("Error fetching member:", error);
        setError("Error fetching member");
      }
    };

    fetchMember();
  }, [userId]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userName || "Admin",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4000/auth/profile/${idx}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.first_name);
          setSuccess(true);
          setError("");

          // Update user in state and sessionStorage
          setUser((prevUser: User | null) =>
            prevUser ? { ...prevUser, firstname: data.first_name } : prevUser
          );
          const storedUser = sessionStorage.getItem("authUser");
          if (storedUser) {
            const obj = JSON.parse(storedUser);
            obj.data.first_name = data.first_name;
            sessionStorage.setItem("authUser", JSON.stringify(obj));
          }

          // Reload the page after update
          window.location.reload();
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        setError("Failed to update profile");
        console.error("Error updating profile:", error);
        setTimeout(() => setError(""), 3000);
      }
    },
  });

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

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
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Name</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="first_name"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name || ""}
                    invalid={validation.touched.first_name && !!validation.errors.first_name}
                  />
                  {validation.touched.first_name && validation.errors.first_name ? (
                    <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update UserName
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MemberProfile;
