import BreadCrumb from 'Components/Common/BreadCrumb';
import { useState } from 'react';
import { Col, Container, Input, Label, Row } from 'reactstrap';


const Create = () => {
  const [dropOffLocations, setDropOffLocations] = useState([
    { id: 1, value: '' },
  ]);

  const handleAddDropOff = () => {
    const newId = dropOffLocations.length + 1;
    setDropOffLocations([...dropOffLocations, { id: newId, value: '' }]);
  };

  const handleDeleteDropOff = (id: number) => {
    const updatedLocations = dropOffLocations.filter(
      (location) => location.id !== id
    );
    setDropOffLocations(updatedLocations);
  };


  return (

    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create" pageTitle="Order List" />
        <Row>
          <Col md={5}>
            <div>
              <Label htmlFor="datePickUp" className="form-label">วันที่รับ</Label>
              <Input type="date" className="form-control" id="datePickUp" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="timePickUp" className="form-label">เวลาที่รับ</Label>
              <Input type="time" className="form-control" id="timePickUp" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="dateDropOff" className="form-label">วันที่ส่ง</Label>
              <Input type="date" className="form-control" id="dateDropOff" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="timeDropOff" className="form-label">เวลาที่ส่ง</Label>
              <Input type="time" className="form-control" id="timeDropOff" />
            </div>
          </Col>
          <Row>
            <Col md={5}>
              <Label htmlFor="vehicle" className="form-label">รถ</Label>
              <select className="form-select rounded-pill mb-3" aria-label="vehicle">
                <option >Select your vehicle </option>
                <option defaultValue="1">Declined Payment</option>
                <option defaultValue="2">Delivery Error</option>
                <option defaultValue="3">Wrong Amount</option>
              </select>
            </Col>
            <Col md={5}>
              <Label htmlFor="driver" className="form-label">คนขับ</Label>
              <select className="form-select rounded-pill mb-3" aria-label="driver">
                <option >Search for driver</option>
                <option defaultValue="1">Information Architecture</option>
                <option defaultValue="2">UI/UX Design</option>
                <option defaultValue="3">Back End Development</option>
              </select>
            </Col>
          </Row>
          <Col md={5}>
            <div>
              <Label htmlFor="pick_up" className="form-label">สถานที่รับสินค้า</Label>
              <Input type="text" className="form-control" id="pick_up" />
            </div>
          </Col>
          <Col md={5}>
            <div style={{ position: 'relative' }}>
              <Label htmlFor="drop_off" className="form-label">
                สถานที่ส่งสินค้า
              </Label>
              {dropOffLocations.map((location, index) => (
                <div key={location.id} style={{ position: 'relative' }}>
                  <Input
                    key={location.id}
                    id={`drop_off${location.id}`}
                    rows="1"
                    className="form-control"
                  />
                  <div style={{ position: 'absolute', bottom: '5px', right: '5px', display: 'flex' }}>
                    {index === 0 && (
                      <button
                        onClick={handleAddDropOff}
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: '5px' }}
                      >
                        +
                      </button>
                    )}
                    {index > 0 && (
                      <button
                        onClick={() => handleDeleteDropOff(location.id)}
                        style={{ marginRight: '5px' }}
                        className="btn btn-danger btn-sm"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col md={10}>
            <div>
              <Label htmlFor="consumer" className="form-label">ชื่อลูกค้า</Label>
              <Input type="text" className="form-control" id="consumer" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="income" className="form-label">ราคา</Label>
              <Input type="number" className="form-control" id="income" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="oilFee" className="form-label">ค่าน้ำมัน</Label>
              <Input type="number" className="form-control" id="oilFee" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="tollwayFee" className="form-label">ค่าทางด่วน</Label>
              <Input type="number" className="form-control" id="tollwayFee" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="otherFee" className="form-label">ค่าใช่จ่ายอื่นๆ</Label>
              <Input type="number" className="form-control" id="otherFee" />
            </div>
          </Col>
          <Col md={5}>
            <div>
              <Label htmlFor="remark" className="form-label">หมายเหตุ</Label>
              <Input type="text" className="form-control" id="remark" />
            </div>
          </Col>
          <div></div>
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
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>

  );
};

export default Create;