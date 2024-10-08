import { useNavigate, useParams } from "react-router-dom";
import { LockOpen, VpnKey } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { server } from "./Account";
import "./ResetPassword.css";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        `${server}/user/password/reset/${params.token}`,
        { password, confirmPassword },
        config
      );

      toast.success("Password Reset Successfully");
      navigate("/login");
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="resetPasswordContainer">
        <div className="resetPasswordBox">
          <h2 className="resetPasswordHeading">Reset Password </h2>
          <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
            <div className="resetPassword">
              <VpnKey />
              <input
                type="password"
                placeholder="New Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="resetPassword">
              <LockOpen />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <input
              type="submit"
              value={"Continue"}
              className="resetPasswordBtn"
              style={{ backgroundColor: "tomato" }}
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
