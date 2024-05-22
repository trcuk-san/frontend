import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash'; // นำเข้า isEmpty จาก lodash
import {jwtDecode} from "jwt-decode"; // ใช้ jwtDecode อย่างถูกต้อง
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
    const [profilePicture, setProfilePicture] = useState(avatar1); // สถานะสำหรับ profile picture
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                navigate("/login");
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
                    setProfilePicture(userData.profile_picture || avatar1); // ใช้ profile_picture จากฐานข้อมูล
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
            setProfilePicture(obj.data.profile_picture || avatar1); // ใช้ profile_picture จาก sessionStorage
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
                        <img className="rounded-circle header-profile-user" src={profilePicture} alt="Header Avatar" />
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
                    <div className="dropdown-divider"></div>
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
