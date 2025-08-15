import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.helper";
import {toast, ToastContainer} from "react-toastify";
export default function Register() {
    const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        address: [
          {
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            zipCode: data.zipCode,
          },
        ],
      };

      const res = await API.post("/users/", payload);
      toast.success(res.data.message || "User registered successfully")
      navigate("/login")
      reset();
    } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed")
    }
  };




  return (
    <div className="container mt-5">
        <ToastContainer/>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Register</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("fullName", { required: "Name is required" })}
                  />
                  {errors.fullName && <small className="text-danger">{errors.fullName.message}</small>}
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <small className="text-danger">{errors.email.message}</small>}
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <small className="text-danger">{errors.password.message}</small>}
                </div>

                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) => value === watch("password") || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">{errors.confirmPassword.message}</small>
                  )}
                </div>

                <h6 className="mt-3">Address</h6>
                <div className="mb-2">
                  <label>Street</label>
                  <input type="text" className="form-control" {...register("street")} />
                </div>
                <div className="mb-2">
                  <label>City</label>
                  <input type="text" className="form-control" {...register("city")} />
                </div>
                <div className="mb-2">
                  <label>State</label>
                  <input type="text" className="form-control" {...register("state")} />
                </div>
                <div className="mb-2">
                  <label>Country</label>
                  <input type="text" className="form-control" {...register("country")} />
                </div>
                <div className="mb-3">
                  <label>Zip Code</label>
                  <input type="text" className="form-control" {...register("zipCode")} />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Register
                </button>

                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
