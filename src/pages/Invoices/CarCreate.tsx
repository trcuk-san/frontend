import BreadCrumb from "Components/Common/BreadCrumb";
import { useState } from "react";
import { Col, Container, Form, Input, Label, Row } from "reactstrap";
import { createVehicle } from "services/vehicle";
import { Link, useNavigate } from "react-router-dom";

const CarCreate = () => {
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "vehicleId") {
      setVehicleId(value);
    } else if (name === "vehicleStatus") {
      setVehicleStatus(value);
    }
  };

  // const validateForm = () => {
  //   const newErrors: ErrorState = {};
  //   if (!email) newErrors.email = "Email is required";
  //   if (!password) newErrors.password = "Password is required";
  //   return newErrors;
  // };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const carCreate: any = await createVehicle({
        vehicleId: vehicleId,
        vehicleStatus: vehicleStatus,
        remarks: remarks,
      });
      console.log("car create successful:");
      navigate("/car");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create" pageTitle="Order List" />
        <Row>
          <Form onSubmit={submit}>
            <Row>
              <Col md={6}>
                <div>
                  <Label htmlFor="vehicleId" className="form-label">
                    ทะเบียนรถ
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="vehicleId"
                    placeholder="Enter Vehicle Id"
                    name="vehicleId"
                    value={vehicleId}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col md={6}>
                <Label htmlFor="vehicleStatus" className="form-label">
                  สถานะ
                </Label>
                <select
                  className="form-select rounded-pill mb-3"
                  aria-label="vehicleStatus"
                >
                  <option>Select Vehicle Status </option>
                  <option defaultValue="Ok">Declined Payment</option>
                  <option defaultValue="notOK">Delivery Error</option>
                </select>
              </Col>
              <Col md={12}>
                <div>
                  <Label htmlFor="remarks" className="form-label">
                    หมายเหตุ
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="remarks"
                    placeholder="Enter Vehicle Id"
                    name="remarks"
                    value={remarks}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>
            <div></div>
            <Row>
              <Col md={10}>
                <div className="text-end">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    Back
                  </button>
                </div>
              </Col>

              <Col md={1}>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Row>
      </Container>
    </div>
  );
};

export default CarCreate;
