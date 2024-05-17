import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import {jwtDecode} from "jwt-decode";
import avatar from "../../assets/images/users/avatar-1.jpg";
import { editProfile, resetProfileFlag } from "../../slices/thunks";
import { createSelector } from "reselect";

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

const UserProfile = () => {
  const dispatch = useDispatch<any>();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("admin@gmail.com");
  const [idx, setIdx] = useState("1");
  const [userName, setUserName] = useState("Admin");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectLayoutState = (state: any) => state.Profile;
  const userprofileData = createSelector(selectLayoutState, (state) => ({
    user: state.user,
    success: state.success,
    error: state.error,
  }));

  const { user: reduxUser, success: reduxSuccess, error: reduxError } = useSelector(userprofileData);

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
          setUserName(userData.firstname);
          setEmail(userData.email);
          setIdx(userData._id);
        } else {
          console.error("No user data in response:", response.statusText);
          setError("No user data found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const storedUser = sessionStorage.getItem("authUser");
      if (storedUser) {
        const obj = JSON.parse(storedUser);

        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
          setUserName(obj.displayName);
          setEmail(obj.email || "admin@gmail.com");
          setIdx(obj.uid || "1");
        } else if (
          process.env.REACT_APP_DEFAULTAUTH === "jwt"
        ) {
          if (!isEmpty(reduxUser)) {
            obj.data.first_name = reduxUser.first_name;
            sessionStorage.removeItem("authUser");
            sessionStorage.setItem("authUser", JSON.stringify(obj));
          }

          setUserName(obj.data.first_name || "Admin");
          setEmail(obj.data.email || "admin@gmail.com");
          setIdx(obj.data._id || "1");
        }
        setTimeout(() => {
          dispatch(resetProfileFlag());
        }, 3000);
      }
    }
  }, [dispatch, reduxUser]);

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

          // อัปเดต user ใน state และ sessionStorage ทันที
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

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">Username Updated To {userName}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={avatar}
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

export default UserProfile;
