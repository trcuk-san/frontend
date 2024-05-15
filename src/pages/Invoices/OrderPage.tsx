import React, { useEffect, useState } from "react";
import { listOrder } from "services/order";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";

interface IOrder {
  _id: string;
  date: String;
  time: string;
  vehicle: string;
  driver: string;
  pick_up: string;
  drop_off: [string];
  consumer: string;
  remark: string;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await listOrder();
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title">Order List</h4>
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Pick Up</th>
                    <th>Drop Off</th>
                    <th>Consumer</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.date}</td>
                      <td>{order.time}</td>
                      <td>{order.vehicle}</td>
                      <td>{order.driver}</td>
                      <td>{order.pick_up}</td>
                      <td>{order.drop_off.join(', ')}</td>
                      <td>{order.consumer}</td>
                      <td>{order.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
