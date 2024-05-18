
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash'; // นำเข้า isEmpty จาก lodash
import {jwtDecode} from "jwt-decode";
import avatar1 from "../../assets/images/users/avatar-1.jpg";



const ProfileDropdown = () => {

    const profiledropdownData = createSelector(
        (state: any) => state.Profile,
        (user) => user.user
    );

    const user = useSelector(profiledropdownData);

    const [userName, setUserName] = useState("Admin");
    const [email, setEmail] = useState("");
    const [idx, setIdx] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            try {
                const decoded: any = jwtDecode(token);
                const userId = decoded.uid;
                console.log('Decoded userId from token:', userId);

                const response = await fetch(`http://localhost:4000/auth/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log('Fetched user data:', JSON.stringify(userData, null, 2));
                    setUserName(userData.firstname);
                    setEmail(userData.email);
                    setIdx(userData._id);
                } else {
                    console.error('No user data in response:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();

        const storedUser = sessionStorage.getItem("authUser");
        if (storedUser) {
            const obj = JSON.parse(storedUser);

            if (!isEmpty(user)) {
                obj.data.first_name = user.first_name;
                sessionStorage.setItem("authUser", JSON.stringify(obj));
            }

            setUserName(obj.data.first_name);
            setEmail(obj.data.email);
            setIdx(obj.data._id || "1");
        }
    }, [user]);

    // Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatar1} alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                {userName || "Admin"}
                            </span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                                Founder
                            </span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {userName}!</h6>
                    <DropdownItem className="p-0">
                        <Link to="/profile" className="dropdown-item">
                            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Profile</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className="p-0">
                        <Link to="/apps-chat" className="dropdown-item">
                            <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Messages</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className="p-0">
                        <Link to={"#"} className="dropdown-item">
                            <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Taskboard</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className="p-0">
                        <Link to="/pages-faqs" className="dropdown-item">
                            <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Help</span>
                        </Link>
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem className="p-0">
                        <Link to="/pages-profile" className="dropdown-item">
                            <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Balance : <b>$5971.67</b></span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className="p-0">
                        <Link to="/pages-profile-settings" className="dropdown-item">
                            <span className="badge bg-success-subtle text-success mt-1 float-end">New</span>
                            <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Settings</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className="p-0">
                        <Link to="/auth-lockscreen-basic" className="dropdown-item">
                            <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Lock screen</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className="p-0">
                        <Link to="/logout" className="dropdown-item">
                            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle" data-key="t-logout">Logout</span>
                        </Link>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
