import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, subscription_key } from "../../config";
import { toast } from "react-toastify";

interface RegisterProps {}
interface UserData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const Register: React.FC<RegisterProps> = () => {
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    if (isformcomplete() === false) return;

    if (userData.password !== userData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    if (userData.otp !== generatedOtp) {
      setValidationError("Invalid OTP");
      return;
    }

    const api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key,
      },
    });

    try {
      await api.post("/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 2000, // close the toast after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          setError("Invalid route");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("An error occurred");
      }
    }
  };

  const handleSendOtp = async () => {
    setIsOtpValidated(false); // Reset isOtpValidated

    if (!userData.email) {
      setValidationError("Email is required");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setIsOtpSent(true);

    const api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key,
      },
    });

    try {
      await api.post(`${API_URL}/SendEmail`, {
        toemail: userData.email,
        body: `Otp is ${otp}`,
        subject: "OTP for registration",
      });
      toast.success("OTP sent to your email!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      setError("Error sending OTP");
    }
  };

  function isformcomplete() {
    if (
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.confirmPassword ||
      !userData.otp
    ) {
      setValidationError("All fields are required");
      return false;
    }
    return true;
  }

  const handleValidateOtp = () => {
    if (isformcomplete() === false) return;

    if (userData.otp === generatedOtp) {
      toast.success("OTP validated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsOtpValidated(true); // Set isOtpValidated to true
    } else {
      setValidationError("Invalid OTP");
      setIsOtpValidated(false); // Set isOtpValidated to false
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (e.target.name === "otp") {
      setIsOtpValidated(false); // Reset isOtpValidated
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username:</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={userData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={userData.email}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleSendOtp}
                      disabled={isOtpSent}
                    >
                      {isOtpSent ? "OTP Sent" : "Send OTP"}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">OTP:</label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="otp"
                      className="form-control"
                      value={userData.otp}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleValidateOtp}
                    >
                      Validate OTP
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={userData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!isOtpValidated}
                >
                  Register
                </button>
                <button type="button" className="btn btn-secondary w-100 mt-2">
                  Cancel
                </button>
              </form>
              {validationError && (
                <p className="text-danger text-center mt-2">
                  {validationError}
                </p>
              )}
              {error && <p className="text-danger text-center mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
