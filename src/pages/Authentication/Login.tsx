import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  FormFeedback,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import logoLight from "../../assets/images/logo-light.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });
      console.log("Response:", response);
      const { token, message } = response.data || response; // ตรวจสอบ response.data หรือ response

      if (token) {
        localStorage.setItem("token", token);
        console.log(
          "Token saved to localStorage:",
          localStorage.getItem("token")
        ); // เพิ่ม log เพื่อตรวจสอบ token ใน localStorage
        navigate("/profile");
      } else {
        setErrors({ email: "Invalid email or password" });
        console.error("No token in response:", response.data);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrors({ email: "Invalid email or password" });
    }
  };
  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="20" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">
                  Premium Admin & Dashboard Template
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p className="text-muted">Sign in to continue to Velzon.</p>
                  </div>
                  <div className="p-2 mt-4">
                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">
                          Email
                        </Label>
                        <Input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter email"
                          name="email"
                          value={email}
                          onChange={handleChange}
                          invalid={!!errors.email}
                        />
                        {errors.email && (
                          <FormFeedback type="invalid">
                            {errors.email}
                          </FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="float-end">
                          <Link
                            to="/auth-pass-reset-basic"
                            className="text-muted"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Label className="form-label" htmlFor="password-input">
                          Password
                        </Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5 password-input"
                            placeholder="Enter password"
                            id="password-input"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            invalid={!!errors.password}
                          />
                          {errors.password && (
                            <FormFeedback type="invalid">
                              {errors.password}
                            </FormFeedback>
                          )}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                            type="button"
                            id="password-addon"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>

                      <div className="form-check">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="auth-remember-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="auth-remember-check"
                        >
                          Remember me
                        </Label>
                      </div>

                      <div className="mt-4">
                        <Button
                          color="success"
                          className="btn btn-success w-100"
                          type="submit"
                        >
                          Sign In
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13 mb-4 title">Sign In with</h5>
                        </div>
                        <div>
                          <Button color="primary" className="btn-icon">
                            <i className="ri-facebook-fill fs-16"></i>
                          </Button>{" "}
                          <Button color="danger" className="btn-icon">
                            <i className="ri-google-fill fs-16"></i>
                          </Button>{" "}
                          <Button color="dark" className="btn-icon">
                            <i className="ri-github-fill fs-16"></i>
                          </Button>{" "}
                          <Button color="info" className="btn-icon">
                            <i className="ri-twitter-fill fs-16"></i>
                          </Button>{" "}
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Don't have an account ?{" "}
                  <Link
                    to="/register"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Signup{" "}
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

export default Login;
