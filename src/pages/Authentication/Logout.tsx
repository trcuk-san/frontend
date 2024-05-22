import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import withRouter from "../../Components/Common/withRouter";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            localStorage.removeItem('token');
            navigate("/login");
        };

        handleLogout();
    }, [navigate]);

    return null;
};

export default withRouter(Logout);
