import React, { useState, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Use jwtDecode properly
import avatar1 from "../../assets/images/users/avatar-1.jpg";

interface SectionProps {
  rightClickBtn: () => void;
}

const Section: React.FC<SectionProps> = ({ rightClickBtn }) => {
    const API_BASE_URL = process.env.REACT_APP_APIBASEURL;
  const [userName, setUserName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [idx, setIdx] = useState("");
  const [profilePicture, setProfilePicture] = useState(avatar1);
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

        const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
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
          setProfilePicture(userData.profile_picture || avatar1);
        } else {
          console.error('No user data in response:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <React.Fragment>
      <Row className="mb-3 pb-1">
        <Col xs={12}>
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">Good Morning, {userName}!</h4>
              <p className="text-muted mb-0">Here's what's happening with your today.</p>
            </div>
            <div className="mt-3 mt-lg-0">
              <form action="#">
                <Row className="g-3 mb-0 align-items-center">
                  <div className="col-sm-auto">
                    <div className="input-group">
                      <Flatpickr
                        className="form-control border-0 dash-filter-picker shadow"
                        options={{
                          mode: "range",
                          dateFormat: "d M, Y",
                          defaultDate: ["01 Jan 2022", "31 Jan 2022"]
                        }}
                      />
                      <div className="input-group-text bg-primary border-primary text-white">
                        <i className="ri-calendar-2-line"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button type="button" className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn" onClick={rightClickBtn}>
                      <i className="ri-pulse-line"></i>
                    </button>
                  </div>
                </Row>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
