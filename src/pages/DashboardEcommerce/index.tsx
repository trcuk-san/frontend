import React, { useState, useEffect } from 'react';
import { Col, Row, Container, Card, CardBody } from 'reactstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import moment from 'moment';

import { fetchDashboardData } from '../../services/dashboard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalReceipts, setTotalReceipts] = useState<number>(0);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>([]);
  const [expenseStatus, setExpenseStatus] = useState<{ [key: string]: number }>({});
  const [unpaidInvoices, setUnpaidInvoices] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { receipts, orders, invoices, vehicles, users } = await fetchDashboardData();

        // Calculate total revenue
        const revenue = receipts.reduce((acc: number, receipt: any) => acc + receipt.amount, 0);
        setTotalRevenue(revenue);

        // Calculate total expenses
        const expenses = orders.reduce((acc: number, order: any) => acc + order.oilFee + order.tollwayFee + order.otherFee, 0);
        setTotalExpenses(expenses);

        // Calculate total orders
        setTotalOrders(orders.length);

        // Calculate total invoices
        const invoiceCount = invoices.filter((invoice: any) => invoice.invoicestatus).length;
        setTotalInvoices(invoiceCount);

        // Calculate total receipts
        setTotalReceipts(receipts.length);

        // Calculate total vehicles
        setTotalVehicles(vehicles.length);

        // Calculate total employees
        setTotalEmployees(users.length);

        // Monthly revenue
        const monthlyRev = Array(12).fill(0);
        receipts.forEach((receipt: any) => {
          const month = moment(receipt.createdAt).month();
          monthlyRev[month] += receipt.amount;
        });
        setMonthlyRevenue(monthlyRev);

        // Monthly expenses
        const monthlyExp = Array(12).fill(0);
        orders.forEach((order: any) => {
          const month = moment(order.createdAt).month();
          monthlyExp[month] += order.oilFee + order.tollwayFee + order.otherFee;
        });
        setMonthlyExpenses(monthlyExp);

        // Expense status
        const statusCount: { [key: string]: number } = { Pending: 0, 'Picked-Up': 0, 'In-Transit': 0, Delivered: 0, Cancelled: 0 };
        orders.forEach((order: any) => {
          statusCount[order.orderStatus] += 1;
        });
        setExpenseStatus(statusCount);

        // Unpaid invoices
        const unpaid = invoices.filter((invoice: any) => !invoice.invoicestatus);
        setUnpaidInvoices(unpaid);
      } catch (error) {
        console.error('Error loading data', error);
      }
    };

    loadData();
  }, []);

  const revenueData = {
    labels: moment.months(),
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        data: monthlyRevenue,
      },
    ],
  };

  const expensesData = {
    labels: moment.months(),
    datasets: [
      {
        label: 'Expenses',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        data: monthlyExpenses,
      },
    ],
  };

  const expenseStatusData = {
    labels: Object.keys(expenseStatus),
    datasets: [
      {
        data: Object.values(expenseStatus),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Revenue</h4>
                <p>${totalRevenue}</p>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Expenses</h4>
                <p>${totalExpenses}</p>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Orders</h4>
                <p>{totalOrders}</p>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Invoices</h4>
                <p>{totalInvoices}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Receipts</h4>
                <p>{totalReceipts}</p>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Vehicles</h4>
                <p>{totalVehicles}</p>
              </CardBody>
            </Card>
          </Col>
          <Col xl={3}>
            <Card>
              <CardBody>
                <h4>Total Employees</h4>
                <p>{totalEmployees}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <Card>
              <CardBody>
                <h4>Monthly Revenue</h4>
                <Bar data={revenueData} />
              </CardBody>
            </Card>
          </Col>
          <Col xl={6}>
            <Card>
              <CardBody>
                <h4>Monthly Expenses</h4>
                <Bar data={expensesData} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <Card>
              <CardBody>
                <h4>Expense Status</h4>
                <Doughnut data={expenseStatusData} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <h4>Unpaid Invoices</h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidInvoices.map((invoice, index) => (
                      <tr key={index}>
                        <td>{invoice._id}</td>
                        <td>{invoice.customer}</td>
                        <td>{invoice.amount}</td>
                        <td>{moment(invoice.createdAt).format('YYYY-MM-DD')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
