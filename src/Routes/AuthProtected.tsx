import React, { useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthorization } from "../helpers/api_helper";
import { useProfile } from "../Components/Hooks/UserHooks";
import { logoutUser } from "../slices/auth/login/thunk";

const AuthProtected = ({ children }: { children: ReactNode }) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();

  useEffect(() => {
    if (token) {
      setAuthorization(token);
    } else {
      dispatch(logoutUser());
    }
  }, [token, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile || !token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthProtected;
