import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";

const DashboardEcommerce = () => {
  document.title = "Dashboard";

  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  <Widget />
                </Row>
                <Row>
                  <Col xl={8}>
                    <Revenue />
                  </Col>
                  <SalesByLocations />
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
