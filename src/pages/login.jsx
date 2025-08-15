import React from "react";
import { useForm } from "react-hook-form";
import API from "../api/api.helper";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import Cokies from "js-cookie"
export default function Login() {
  const navigate = useNavigate(); 

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      toast.success(res.data.message || "User logged in successfully");
      Cokies.set("token",res.data.items.token)
      Cokies.set("role",res.data.items.user.role)
     if(res.data.items.user.role=="admin"){
        navigate("/admin/dashboard")
     }
     else{
      navigate("/products")
     }
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
        <ToastContainer/>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <small className="text-danger">
                      {errors.email.message}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && (
                    <small className="text-danger">
                      {errors.password.message}
                    </small>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
