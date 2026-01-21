import React from "react";
import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
function ValidateCoupon() {
    const [user, setUser] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Clear user authentication here
        localStorage.removeItem('token');

        // 2. Redirect to home page
        navigate('/'); // SPA-safe, respects basename
    };
    const tableContainerStyle = {
        margin: '30px', // Adds 30px margin on all sides
        border: '1px solid black',
        width: '80%',
        borderRadius: '10px',
        overflow: 'hidden', // Essential for rounded corners to work
        borderCollapse: 'collapse'

    }
    const validateStyle = {
        margin: '30px'
    }
    const list = {
        margin: '30px'
    }
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/coupons`)
            .then(res => res.json())
            .then(data => setCoupons(data));
    }, []);
    const validateCoupon = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch("http://localhost:5000/api/coupons/validate",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ couponCode })
                }
            );
            const data = await result.json();
            console.log(data)
            if (!result.ok) {
                //alert('message')
                setMessage(data.message);

            }

            setMessage(data.message);

            setCouponCode('');
            const updated = await fetch("http://localhost:5000/api/coupons");
            setCoupons(await updated.json());
        } catch (err) {
            setMessage('Something went wrong')

        }
    };

    return (
        <div className=''>

            <nav className="navbar navbar-light m-8 bg-primary text-secondary  justify-content-between" >

                <h2 className="navbar-brand mx-2 text-white">Home</h2>
                {user && (
                    <div className="mb-3 text-start">
                        <span className="fw-semibold">
                            <h2 className="text-white" >Welcome {user.user_name}</h2>
                        </span>
                    </div>
                )}

                <Nav.Link onClick={handleLogout} className="mx-2 text-white">Logout</Nav.Link>



            </nav>


            <div className="d-flex justify-content-center align-items-center " style={validateStyle}>
                <div className="bg-white text-light rounded mt-[30px] p-4 shadow">
                    {/* Generate Section */}
                    <div className="mb-6">
                        <label className="d-block small fw-medium text-secondary mb-4">
                            Validate Coupon
                        </label>
                        <form className="row g-3" onSubmit={validateCoupon}>

                            <div className="col-auto">

                                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="form-control" id="validate" placeholder="Enter Coupon Code" />
                            </div>
                            <div className="col-auto">
                                <button type="submit" onClick={validateCoupon} className="btn btn-primary mb-3">Validate Coupon</button>
                                <div>
                                    {(() => {
                                        switch (message) {
                                            case 'Coupon is valid and applied successfully':
                                                return <div className="mb-4 alert alert-success d-flex align-items-center gap-2 py-3 px-4 rounded">
                                                    <Check size={18} />
                                                    <span className="font-medium">{message}</span>
                                                </div>;
                                            case 'Coupon already used':
                                                return <div className="mb-4 alert alert-danger d-flex align-items-center gap-2 py-3 px-4 rounded">

                                                    <span className="font-medium">{message}</span>
                                                </div>;
                                            default:
                                                return null;
                                        }
                                    })()}
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <div className="mt-[30px]">
                <h2 className="m-20" style={list}>Coupons List</h2>
                <table className="table table-striped mx-20 table-bordered" style={tableContainerStyle}>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Coupon Code</th>
                            <th scope="col">Status</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Used At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((c, index) => (
                            <tr scope="row" key={index}>
                                <td>{c.code}</td>
                                <td>{c.status}</td>
                                <td>{new Date(c.created_at).toLocaleString()}</td>
                                <td>
                                    {c.used_at ? new Date(c.used_at).toLocaleString() : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </div>
    )
}
export default ValidateCoupon;