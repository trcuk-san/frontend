import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
   

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/dashboard-analytics",
            click: function (e: any) {
                e.preventDefault();
            }

        },
        {
            id: "order",
            label: "order",
            icon: "ri-list-ordered",
            link: "/order",
            click: function (e: any) {
                e.preventDefault();
              
            }
            // subItems: [
            //     {
            //         id: "invoices",
            //         label: "Invoices",
            //         link: "/#",
            //         isChildItem: true,
            //         click: function (e: any) {
            //             e.preventDefault();
            //             setIsInvoices(!isInvoices);
            //         },
            //         parentId: "apps",
            //         stateVariables: isInvoices,
            //         childItems: [
            //             { id: 1, label: "List View", link: "/apps-invoices-list" },
            //             { id: 2, label: "Details", link: "/apps-invoices-details" },
            //             { id: 3, label: "Create Invoice", link: "/apps-invoices-create" },
            //         ]
            //     },
            // ],
        },
        {
            id: "car",
            label: "car",
            icon: "ri-car-line",
            link: "/car",
            click: function (e: any) {
                e.preventDefault();           
            }
        },{
            id: "member",
            label: "member",
            icon: "ri-contacts-book-line",
            link: "/member",
            click: function (e: any) {
                e.preventDefault();
                
            }
        },{
            id: "invoices",
            label: "Invoices",
            icon: "ri-archive-line",
            link: "/invoices",
            click: function (e: any) {
                e.preventDefault();
             
            }
        },{
            id: "receipt",
            label: "receipt",
            icon: "ri-file-text-line",
            link: "/apps-invoices-create",
            click: function (e: any) {
                e.preventDefault();
             
            }
        },{
            id: "voucher",
            label: "voucher",
            icon: "ri-ticket-2-line",
            link: "/apps-invoices-create",
            click: function (e: any) {
                e.preventDefault();
             
            }
        },{
            id: "history",
            label: "history",
            icon: "ri-history-line",
            link: "/apps-invoices-create",
            click: function (e: any) {
                e.preventDefault();
             
            }
        },
       
        //     id: "forms",
        //     label: "Forms",
        //     icon: "ri-file-list-3-line",
        //     link: "/#",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIsForms(!isForms);
        //         setIscurrentState('Forms');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isForms,
        //     subItems: [
        //         { id: "basicelements", label: "Basic Elements", link: "/forms-elements", parentId: "forms" },
        //         { id: "formselect", label: "Form Select", link: "/forms-select", parentId: "forms" },
        //         { id: "checkboxsradios", label: "Checkboxs & Radios", link: "/forms-checkboxes-radios", parentId: "forms" },
        //         { id: "pickers", label: "Pickers", link: "/forms-pickers", parentId: "forms" },
        //         { id: "inputmasks", label: "Input Masks", link: "/forms-masks", parentId: "forms" },
        //         { id: "advanced", label: "Advanced", link: "/forms-advanced", parentId: "forms" },
        //         { id: "rangeslider", label: "Range Slider", link: "/forms-range-sliders", parentId: "forms" },
        //         { id: "validation", label: "Validation", link: "/forms-validation", parentId: "forms" },
        //         { id: "wizard", label: "Wizard", link: "/forms-wizard", parentId: "forms" },
        //         { id: "editors", label: "Editors", link: "/forms-editors", parentId: "forms" },
        //         { id: "fileuploads", label: "File Uploads", link: "/forms-file-uploads", parentId: "forms" },
        //         { id: "formlayouts", label: "Form Layouts", link: "/forms-layouts", parentId: "forms" },
        //         { id: "select2", label: "Select2", link: "/forms-select2", parentId: "forms" },
        // 
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;