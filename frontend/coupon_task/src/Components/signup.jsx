import { useState } from "react";
import "./signup.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


function ComponentSignup() {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",

        role: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const errors = {};

        if (!form.email) {
            errors.email = "Email is required";
        }

        if (!form.password) {
            errors.password = "Password is required";
        }

        // if (form.password !== form.confirmPassword) {
        //     errors.confirmPassword = "Passwords do not match";
        // }

        if (!form.role) {
            errors.role = "Please select a role";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/signup`,
                form
            );

            console.log("Signup response:", res.data);

            if (res.data.success) {
                const { user, token } = res.data;

                localStorage.setItem("token", token);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));

                // 🔀 Role-based redirect
                if (user.role === "admin") {
                    navigate("/generate-coupon");
                } else {
                    navigate("/validate-coupon");
                }
            }

        } catch (err) {
            console.error("Signup error:", err.response?.data);
            alert(err.response?.data?.message || "Signup failed");
        }
    };


    return (

        <div className="signup-page ">
            <div className="signup-card ">
                <h1>SignUp Page</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">User Name</label>
                        <input
                            name="name"
                            placeholder="Name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <p style={{ color: "red" }}>{errors.email}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <p style={{ color: "red" }}>{errors.password}</p>
                    </div>
                    {/* <div className="mb-3">
                        <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                        <p style={{ color: "red" }}>{errors.confirmPassword}</p>
                    </div> */}
                    <div className="mb-3">
                        <select
                            name="role"
                            className="form-control"
                            value={form.role}
                            onChange={handleChange}>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <p style={{ color: "red" }}>{errors.role?.message}</p>
                    </div>
                    <button type="submit" className="btn btn-success w-100">SignUp</button>
                    <p></p>
                    <Link to="/" className="btn btn-default border w-100 text-decoration-none">Login here</Link >

                </form>
                {/* <button
                    className="btn btn-danger w-100 mt-3"
                    onClick={() =>
                        window.location.href =
                        "http://localhost:5000/api/auth/google"
                    }
                >
                    Continue with Google
                </button> */}

            </div>
        </div>
    );
}

export default ComponentSignup;
