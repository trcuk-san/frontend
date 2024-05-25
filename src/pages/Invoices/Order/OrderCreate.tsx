import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Label, Input, Form, Alert, InputGroup, InputGroupText } from "reactstrap";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "Components/Common/BreadCrumb";
import { createOrder, IOrder, setAuthorization } from "../../../services/order";
import MapModal from "../../../services/map/MapModal";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS

const OrderCreate = () => {
  const navigate = useNavigate();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedDropOffIndex, setSelectedDropOffIndex] = useState<number | null>(null);
  const [formState, setFormState] = useState<IOrder>({
    datePickUp: "",
    timePickUp: "",
    dateDropOff: "",
    timeDropOff: "",
    vehicle: "",
    driver: "",
    pick_up: "",
    drop_off: [""], // Initialize with one empty string
    consumer: "",
    income: 0,
    oilFee: 0,
    tollwayFee: 0,
    otherFee: 0,
    orderStatus: "Start",
    invoiced: false,
    remark: "",
  });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const API_BASE_URL = process.env.REACT_APP_APIBASEURL;

  useEffect(() => {
    const fetchVehiclesAndDrivers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setError("No token found in localStorage");
        return;
      }
      setAuthorization(token);

      try {
        const vehicleResponse = await fetch(
          `${API_BASE_URL}/vehicle/listVehicle`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userResponse = await fetch(`${API_BASE_URL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!vehicleResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch vehicles or drivers");
        }

        const vehicleData = await vehicleResponse.json();
        const userData = await userResponse.json();

        console.log("Fetched vehicles:", JSON.stringify(vehicleData, null, 2));
        console.log("Fetched users:", JSON.stringify(userData, null, 2));

        const filteredVehicles = vehicleData.data.filter(
          (vehicle: any) => vehicle.vehicleStatus === "available"
        );
        setVehicles(filteredVehicles);
        setDrivers(userData.data);
        console.log("Filtered vehicles:", filteredVehicles);
        console.log("Drivers set:", userData.data);
      } catch (error: any) {
        console.error("Error fetching vehicles or drivers:", error.message);
        setError("Error fetching vehicles or drivers");
      }
    };

    fetchVehiclesAndDrivers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropOffChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { value } = e.target;
    const updatedDropOff = formState.drop_off.map((dropOff, i) =>
      i === index ? value : dropOff
    );
    setFormState((prevState) => ({
      ...prevState,
      drop_off: updatedDropOff,
    }));
  };

  const handleAddDropOff = () => {
    setFormState((prevState) => ({
      ...prevState,
      drop_off: [...prevState.drop_off, ""],
    }));
  };

  const handleRemoveDropOff = (index: number) => {
    const updatedDropOff = formState.drop_off.filter((_, i) => i !== index);
    setFormState((prevState) => ({
      ...prevState,
      drop_off: updatedDropOff,
    }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    const { lat, lng, address } = location;
    const formattedLocation = `${address},${lat},${lng}`;

    if (selectedDropOffIndex !== null) {
      const updatedDropOff = formState.drop_off.map((dropOff, i) => (i === selectedDropOffIndex ? formattedLocation : dropOff));
      setFormState((prevState) => ({
        ...prevState,
        drop_off: updatedDropOff,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        pick_up: address,
      }));
    }
    setSelectedDropOffIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form state at submission:", formState);

    // Ensure vehicle and driver are selected
    if (!formState.vehicle || !formState.driver) {
      setError("Vehicle and driver must be selected.");
      return;
    }

    try {
      const response = await createOrder(formState);
      console.log("Order created successfully:", response);
      setSuccess("Order created successfully");
      setError(null);

      // Redirect to the order list page after successful order creation
      navigate("/order");

      // Handle success, e.g., navigate to the order list or show a success message
    } catch (error: any) {
      console.error("Error creating order:", error.message);
      setError("Error creating order");
      setSuccess(null);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create" pageTitle="Order List" />
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={5}>
              <div>
                <Label htmlFor="datePickUp" className="form-label">
                  วันที่รับ
                </Label>
                <Input
                  type="date"
                  className="form-control"
                  id="datePickUp"
                  name="datePickUp"
                  value={formState.datePickUp}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="timePickUp" className="form-label">
                  เวลาที่รับ
                </Label>
                <Input
                  type="time"
                  className="form-control"
                  id="timePickUp"
                  name="timePickUp"
                  value={formState.timePickUp}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="dateDropOff" className="form-label">
                  วันที่ส่ง
                </Label>
                <Input
                  type="date"
                  className="form-control"
                  id="dateDropOff"
                  name="dateDropOff"
                  value={formState.dateDropOff}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="timeDropOff" className="form-label">
                  เวลาที่ส่ง
                </Label>
                <Input
                  type="time"
                  className="form-control"
                  id="timeDropOff"
                  name="timeDropOff"
                  value={formState.timeDropOff}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Row>
              <Col md={5}>
                <Label htmlFor="vehicle" className="form-label">
                  รถ
                </Label>
                <Input
                  type="select"
                  className="form-select rounded-pill mb-3"
                  aria-label="vehicle"
                  name="vehicle"
                  value={formState.vehicle}
                  onChange={handleChange}
                >
                  <option value="">Select your vehicle</option>
                  {vehicles.map((vehicle: any) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleId}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={5}>
                <Label htmlFor="driver" className="form-label">
                  คนขับ
                </Label>
                <Input
                  type="select"
                  className="form-select rounded-pill mb-3"
                  aria-label="driver"
                  name="driver"
                  value={formState.driver}
                  onChange={handleChange}
                >
                  <option value="">Search for driver</option>
                  {drivers.map((driver: any) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.firstname} {driver.lastname}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
            <Col md={5}>
              <div>
                <Label htmlFor="pick_up" className="form-label">
                  สถานที่รับสินค้า
                </Label>
                <InputGroup>
                  <Input
                    type="text"
                    className="form-control"
                    id="pick_up"
                    name="pick_up"
                    value={formState.pick_up}
                    onChange={handleChange}
                  />
                  <InputGroupText>
                    <i
                      className="fa-solid fa-map-location"
                      onClick={() => {
                        setSelectedDropOffIndex(null);
                        setIsMapModalOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={5}>
              <div style={{ position: "relative" }}>
                <Label htmlFor="drop_off" className="form-label">
                  สถานที่ส่งสินค้า
                </Label>
                {formState.drop_off.map((location, index) => (
                  <div key={index} style={{ position: "relative", marginBottom: "10px" }}>
                    <InputGroup>
                      <Input
                        id={`drop_off${index}`}
                        name={`drop_off${index}`}
                        value={location}
                        onChange={(e) => handleDropOffChange(e, index)}
                        rows="1"
                        className="form-control"
                      />
                      <InputGroupText>
                        <i
                          className="fa-solid fa-map-location"
                          onClick={() => {
                            setSelectedDropOffIndex(index);
                            setIsMapModalOpen(true);
                          }}
                          style={{ cursor: 'pointer', marginRight: '10px' }}
                        ></i>
                        {index !== 0 && (
                          <Button color="danger" className="btn btn-sm" onClick={() => handleRemoveDropOff(index)}>
                            -
                          </Button>
                        )}
                      </InputGroupText>
                    </InputGroup>
                  </div>
                ))}
                <Button onClick={handleAddDropOff} color="primary" className="btn btn-primary btn-sm" type="button">
                  Add Drop Off Location
                </Button>
              </div>
            </Col>
            <Col md={10}>
              <div>
                <Label htmlFor="consumer" className="form-label">
                  ชื่อลูกค้า
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="consumer"
                  name="consumer"
                  value={formState.consumer}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="income" className="form-label">
                  ราคา
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="income"
                  name="income"
                  value={formState.income}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="oilFee" className="form-label">
                  ค่าน้ำมัน
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="oilFee"
                  name="oilFee"
                  value={formState.oilFee}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="tollwayFee" className="form-label">
                  ค่าทางด่วน
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="tollwayFee"
                  name="tollwayFee"
                  value={formState.tollwayFee}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="otherFee" className="form-label">
                  ค่าใช่จ่ายอื่นๆ
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="otherFee"
                  name="otherFee"
                  value={formState.otherFee}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={5}>
              <div>
                <Label htmlFor="remark" className="form-label">
                  หมายเหตุ
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="remark"
                  name="remark"
                  value={formState.remark}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <div></div>
            <Col md={10}>
              <div className="text-end">
                <Button
                  color="danger"
                  className="btn btn-danger"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  Back
                </Button>
              </div>
            </Col>

            <Col md={1}>
              <div className="text-end">
                <Button color="primary" type="submit" className="btn btn-primary">
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
      <MapModal
        isOpen={isMapModalOpen}
        toggle={() => setIsMapModalOpen(!isMapModalOpen)}
        onSelectLocation={(location) => handleLocationSelect(location)}
      />
    </div>
  );
};

export default OrderCreate;