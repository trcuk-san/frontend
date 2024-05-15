import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import logoLight from '../../assets/images/logo-light.png';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';

interface RegisterFormValues {
    email: string;
    userName: string;
    password: string;
}

const Register = () => {
    const [passwordShow, setPasswordShow] = useState(false);
    const navigate = useNavigate();

    const initialValues: RegisterFormValues = {
        email: '',
        userName: '',
        password: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        userName: Yup.string().required('Username is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
    });

    const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: FormikHelpers<RegisterFormValues>) => {
        try {
            const response = await axios.post('http://localhost:4000/auth/register', values);
            console.log('Registration successful:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('Error response:', error.response.data);
                // Handle errors
            } else {
                console.error('Error message:', (error as Error).message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                            <p className="text-muted">Get your free velzon account now</p>
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
                                                    isSubmitting
                                                }) => (
                                                    <Form onSubmit={handleSubmit} className="needs-validation">
                                                        <div className="mb-3">
                                                            <label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></label>
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
                                                                <FormFeedback type="invalid">{errors.email}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="username"
                                                                placeholder="Enter username"
                                                                name="userName"
                                                                value={values.userName}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                invalid={!!(errors.userName && touched.userName)}
                                                            />
                                                            {errors.userName && touched.userName ? (
                                                                <FormFeedback type="invalid">{errors.userName}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="password-input">Password</label>
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
                                                                    <FormFeedback type="invalid">{errors.password}</FormFeedback>
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
                                                                <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">Terms of Use</Link>
                                                            </p>
                                                        </div>

                                                        <div id="password-contain" className="p-3 bg-light mb-2 rounded">
                                                            <h5 className="fs-13">Password must contain:</h5>
                                                            <p id="pass-length" className={`fs-12 mb-2 ${values.password.length >= 8 ? 'valid' : 'invalid'}`}>Minimum <b>8 characters</b></p>
                                                            <p id="pass-lower" className={`fs-12 mb-2 ${/[a-z]/.test(values.password) ? 'valid' : 'invalid'}`}>At <b>lowercase</b> letter (a-z)</p>
                                                            <p id="pass-upper" className={`fs-12 mb-2 ${/[A-Z]/.test(values.password) ? 'valid' : 'invalid'}`}>At least <b>uppercase</b> letter (A-Z)</p>
                                                            <p id="pass-number" className={`fs-12 mb-0 ${/[0-9]/.test(values.password) ? 'valid' : 'invalid'}`}>A least <b>number</b> (0-9)</p>
                                                        </div>

                                                        <div className="mt-4">
                                                            <Button color="success" className="btn btn-success w-100" type="submit" disabled={isSubmitting}>
                                                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                                            </Button>
                                                        </div>

                                                        <div className="mt-4 text-center">
                                                            <div className="signin-other-title">
                                                                <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>
                                                            </div>

                                                            <div>
                                                                <Button type="button" color="primary" className="btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></Button>{" "}
                                                                <Button type="button" color="danger" className="btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></Button>{" "}
                                                                <Button type="button" color="dark" className="btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></Button>{" "}
                                                                <Button type="button" color="info" className="btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></Button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/auth-signin-basic" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
