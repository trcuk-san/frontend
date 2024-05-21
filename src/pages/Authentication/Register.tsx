import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

interface RegisterFormValues {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  userName: string;
  password: string;
}

const Register: React.FC = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    userName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    userName: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
  });

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const response = await axios.post("http://localhost:4000/auth/register", values);
      console.log("Registration response:", response);
      const { token } = response.data || response;
      if (token) {
        navigate("/login");
      } else {
        console.error("Token not found in response:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error response:", error.response.data);
      } else {
        console.error("Error message:", (error as Error).message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="150" />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Create New Account</h5>
                    <p className="text-muted">Get your free Velzon account now</p>
                  </div>
                  <div className="p-2 mt-4">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                      }) => (
                        <Form onSubmit={handleSubmit} className="needs-validation">
                          <div className="mb-3">
                            <Label htmlFor="firstname" className="form-label">
                              Firstname <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="firstname"
                              placeholder="Enter your firstname"
                              name="firstname"
                              value={values.firstname}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              invalid={!!(errors.firstname && touched.firstname)}
                            />
                            {errors.firstname && touched.firstname ? (
                              <FormFeedback type="invalid">
                                {errors.firstname}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="lastname" className="form-label">
                              Lastname <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="lastname"
                              placeholder="Enter your lastname"
                              name="lastname"
                              value={values.lastname}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              invalid={!!(errors.lastname && touched.lastname)}
                            />
                            {errors.lastname && touched.lastname ? (
                              <FormFeedback type="invalid">
                                {errors.lastname}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="phone" className="form-label">
                              Phone <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="tel"
                              className="form-control"
                              id="phone"
                              placeholder="Enter phone number"
                              name="phone"
                              value={values.phone}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              invalid={!!(errors.phone && touched.phone)}
                            />
                            {errors.phone && touched.phone ? (
                              <FormFeedback type="invalid">
                                {errors.phone}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="useremail" className="form-label">
                              Email <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="email"
                              className="form-control"
                              id="useremail"
                              placeholder="Enter email address"
                              name="email"
                              value={values.email}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              invalid={!!(errors.email && touched.email)}
                            />
                            {errors.email && touched.email ? (
                              <FormFeedback type="invalid">
                                {errors.email}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="userName" className="form-label">
                              Username <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="userName"
                              placeholder="Enter username"
                              name="userName"
                              value={values.userName}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              invalid={!!(errors.userName && touched.userName)}
                            />
                            {errors.userName && touched.userName ? (
                              <FormFeedback type="invalid">
                                {errors.userName}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label className="form-label" htmlFor="password-input">
                              Password
                            </Label>
                            <div className="position-relative auth-pass-inputgroup">
                              <Input
                                type={passwordShow ? "text" : "password"}
                                className="form-control pe-5 password-input"
                                placeholder="Enter password"
                                id="password-input"
                                name="password"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                invalid={!!(errors.password && touched.password)}
                              />
                              {errors.password && touched.password ? (
                                <FormFeedback type="invalid">
                                  {errors.password}
                                </FormFeedback>
                              ) : null}
                              <Button
                                color="link"
                                onClick={() => setPasswordShow(!passwordShow)}
                                className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                type="button"
                                id="password-addon"
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </Button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="mb-0 fs-12 text-muted fst-italic">
                              By registering you agree to the Velzon
                              <Link
                                to="#"
                                className="text-primary text-decoration-underline fst-normal fw-medium"
                              >
                                Terms of Use
                              </Link>
                            </p>
                          </div>

                          <div className="mt-4">
                            <Button
                              color="success"
                              className="btn btn-success w-100"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Signing Up..." : "Sign Up"}
                            </Button>
                          </div>

                          
                        </Form>
                      )}
                    </Formik>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Signin{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default Register;
