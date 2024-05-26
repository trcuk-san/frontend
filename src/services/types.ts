export interface IOrder {
    datePickUp: string;
    timePickUp: string;
    dateDropOff: string;
    timeDropOff: string;
    vehicle: string;
    driver: string;
    pick_up: string;
    drop_off: string[];
    consumer: string;
    income: number;
    oilFee: number;
    tollwayFee: number;
    otherFee: number;
    orderStatus: string;
    invoiced: boolean;
    remark: string;
    createdAt: string;
  }
  
  export interface IInvoice {
    _id: string;
    invoiceId: string;
    customer: string;
    address: string;
    listorderId: string[];
    amount: number;
    invoicestatus: boolean;
    createdAt: string;
  }
  
  export interface IVehicle {
    _id: string;
    vehicleId: string;
    vehicleStatus: string;
    remarks: string;
  }
  
  export interface IMember {
    _id: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    profile_picture: string;
  }
  
  export interface IReceipt {
    _id: string;
    receiptId: string;
    customer: string;
    address: string;
    listinvoice: string[];
    amount: number;
    createdAt: string;
  }
  