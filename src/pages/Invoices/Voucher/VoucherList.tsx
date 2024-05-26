import React, { useState, useEffect, useMemo } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Common/Loader";

interface Iinvoice {
  no: number;
  month: string;
  year: number;
  detail: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getYearsOptions = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear, currentYear - 1, currentYear - 2];
};

const generateInvoices = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed (0 for January, 11 for December)
  const years = getYearsOptions();
  let invoices: Iinvoice[] = [];
  
  years.forEach((year) => {
    months.forEach((month, index) => {
      if (year === currentYear && index > currentMonth) {
        return; // Skip future months of the current year
      }
      invoices.push({
        no: invoices.length + 1,
        month: month,
        year: year,
        detail: "Detail information",
      });
    });
  });
  return invoices;
};

const VoucherList = () => {
  const [invoices, setInvoices] = useState<Iinvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Iinvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<Element[]>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Iinvoice | null>(null);
  const [yearsOptions] = useState<number[]>(getYearsOptions());
  const [selectedYear, setSelectedYear] = useState<number>(yearsOptions[0]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const sampleInvoices = generateInvoices();
        setInvoices(sampleInvoices);
        setFilteredInvoices(sampleInvoices.filter(invoice => invoice.year === selectedYear));
      } catch (error) {
        setError("Error fetching invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setFilteredInvoices(invoices.filter(invoice => invoice.year === year));
  };

  const handleDeleteInvoice = () => {
    if (invoiceToDelete) {
      // Implement the deletion logic here
      setDeleteModal(false);
    }
  };

  const checkedAll = () => {
    const checkAll: any = document.getElementById("checkBoxAll");
    const checkboxes = document.querySelectorAll(".invoiceCheckBox");

    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = checkAll.checked;
    });

    deleteCheckbox();
  };

  const deleteMultiple = () => {
    selectedCheckBoxDelete.forEach((element: any) => {
      // Implement the deletion logic here
    });
    setIsMultiDeleteButton(false);
  };

  const deleteCheckbox = () => {
    const checkboxes: any = document.querySelectorAll(".invoiceCheckBox:checked");
    setSelectedCheckBoxDelete(checkboxes);
    setIsMultiDeleteButton(checkboxes.length > 0);
  };

  const columns = useMemo(
    () => [
      {
        header: "NO",
        accessorKey: "no",
        cell: (cell: any) => cell.row.index + 1,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Month",
        accessorKey: "month",
        enableColumnFilter: false,
      },
      {
        header: "Detail",
        accessorKey: "detail",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link to={`/voucher/${cell.row.original.year}/${cell.row.original.month}`} className="btn btn-primary">
            More Detail
          </Link>
        ),
      },
    ],
    []
  );

  document.title = "voucher List";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteInvoice}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="voucher List" pageTitle="voucher" />
          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Invoices</h5>
                    <div className="flex-shrink-0">
                      <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => handleYearChange(parseInt(e.target.value))}
                      >
                        {yearsOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {isMultiDeleteButton && (
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => setDeleteModalMulti(true)}
                        >
                          <i className="ri-delete-bin-2-line"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  {loading ? (
                    <Loader />
                  ) : error ? (
                    <div>Error: {error}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={filteredInvoices}
                      customPageSize={12}
                      theadClass="text-muted text-uppercase"
                      isGlobalFilter={false}
                    />
                  )}
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VoucherList;
