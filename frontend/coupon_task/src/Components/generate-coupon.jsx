import React, { useState, useEffect } from 'react';
import { Copy, Check, Link } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';


function CouponGenerator() {
    const [user, setUser] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    console.log(user)
    const generateCoupon = async () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        try {
            const response = await fetch('http://localhost:5000/api/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ couponCode: code, createdBy: user.user_id }),
            });

            if (!response.ok) {

                throw new Error('Failed to save coupon');
            }


        } catch (error) {
            console.error(error);
            alert('Error saving coupon');
        }
        setCouponCode(code);
        setShowSuccess(true);
        setCopied(false);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const copyCoupon = () => {
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

                <Nav.Link href="/" className="mx-2 text-white">Logout</Nav.Link>



            </nav>

            <div className="d-flex justify-content-center align-items-center  vh-100">

                <div className="bg-white p-3 rounded w-50 margin-0 auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 mb-4">
                            <span className="text-white font-bold text-xl">₵</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Coupon Generator</h1>

                    </div>

                    {/* Main Card */}
                    <div className="bg-white text-light rounded p-4 shadow">
                        {/* Generate Section */}
                        <div className="mb-6">
                            <label className="d-block small fw-medium text-secondary mb-4">
                                Generate New Coupon
                            </label>
                            <button
                                onClick={generateCoupon}
                                className="btn btn-primary w-100 fw-semibold py-3 px-4 rounded shadow-sm"
                            >
                                GENERATE
                            </button>
                        </div>

                        {/* Coupon Code Display */}
                        {couponCode && (
                            <div className="mb-6 ">
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        readOnly
                                        className="form-control flex-grow-1 bg-white text-black border border-secondary fs-5 font-monospace py-3 px-4 rounded"
                                        onClick={(e) => e.target.select()}
                                    />
                                    <button
                                        onClick={copyCoupon}
                                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white p-3 rounded-lg transition-colors duration-200"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? (
                                            <Check size={20} className="text-green-400" />
                                        ) : (
                                            <Copy size={20} />
                                        )}
                                    </button>
                                </div>
                                <p className="small text-muted mt-2">Click to select • Button to copy</p>
                            </div>
                        )}

                        {/* Success Toast */}
                        {showSuccess && (
                            <div className="mb-4 alert alert-success d-flex align-items-center gap-2 py-3 px-4 rounded">
                                <Check size={18} />
                                <span className="font-medium">Code Generated Successfully!</span>
                            </div>
                        )}

                        {!couponCode && (
                            <div className="text-center py-4 text-muted">
                                <p className="text-sm">Click generate to create a new coupon code</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="text-center mt-6 text-slate-500 text-sm">
                        <p>Each code is unique and randomly generated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CouponGenerator;