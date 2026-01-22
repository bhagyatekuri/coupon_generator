import React from "react";
import "./coupon.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ComponentLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
            newErrors.password =
                "Password must contain uppercase, lowercase, and a number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(
            'Calling API:',
            `${import.meta.env.VITE_API_URL}/api/auth/login`
        );
        if (!validate()) return;
        //alert('Login sucess')

        try {
            // ✅ POST CREDENTIALS
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    email,
                    password,
                }
            );
            console.log(res.data)
            if (res.data.token) {
                const { token, user } = res.data;

                console.log('assigned data', user.role);

                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        user_id: user.id,
                        user_name: user.name,
                        role: user.role,
                        token
                    })
                );
                // ROLE-BASED REDIRECT
                if (user.role === "admin") {

                    navigate("/generate-coupon");
                } else if (user.role === "user") {
                    console.log(res.data)
                    navigate("/validate-coupon");
                }
            }

            // if (res.data.success) {
            //     //console.log(res.data)
            //     const { userId, UserName, role, token } = res.data;

            //     console.log("assigned data", role)
            //     // ✅ SAVE AUTH DATA
            //     localStorage.setItem(
            //         'user',
            //         JSON.stringify({
            //             user_id: userId,
            //             user_name: UserName
            //         })
            //     );

            //     localStorage.setItem('token', token);
            //     // localStorage.setItem("token", token);
            //     localStorage.setItem("role", role);

            //     // ROLE-BASED REDIRECT
            //     if (role === "admin") {

            //         navigate("/generate-coupon");
            //     } else if (role === "user") {
            //         console.log(res.data)
            //         navigate("/validate-coupon");
            //     }

            // }
        } catch (err) {
            //console.log(res.data)
            console.error(err);
            alert("Login failed");
        }
    };
    return (

        <div className=" login-page ">
            <div className=" login-card ">
                <h1>Login Page</h1>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="name@example.com" />
                        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder="Password" />
                        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                    </div>
                    <button type="submit" className="btn btn-success w-full md:w-auto bg-blue-500 text-white px-4 py-2 w-100">Log in</button>
                    <p></p>
                    <Link to="/signup" className="btn btn-default border w-100 text-decoration-none">Create Account</Link >

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


    )
}
export default ComponentLogin;