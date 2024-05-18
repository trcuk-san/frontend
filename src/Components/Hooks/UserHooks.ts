import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    const userToken = userProfileSession?.token || null;
    setUserProfile(userProfileSession);
    setToken(userToken);
    setLoading(false); // อัปเดต loading เป็น false เสมอหลังจากดึงข้อมูล
  }, []);

  return { userProfile, loading, token };
};

export { useProfile };
