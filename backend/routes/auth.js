//const express = require("express");
import express from "express"
//const bcrypt = require("bcrypt");
import bcrypt from "bcrypt"
//const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"
//const passport = require("passport");
import passport from "passport";
//import passport from "passport.js";
import pool from "../db.js";
//import pool from "../db.js";
//const pool = require("../db");
import dotenv from "dotenv";
dotenv.config();
//require('dotenv').config();

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// router.post("/login", async (req, res) => {
//     console.log("✅ LOGIN API HIT");
//     console.log("📦 BODY:", req.body);

//     res.status(200).json({
//         success: true,
//         message: "Login API reached",
//     });
// });
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, name: req.user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.redirect(
            `http://localhost:3000/oauth-success?token=${token}`
        );
    }
);

router.get("/debug-db", async (req, res) => {
    const db = await pool.query("SELECT current_database()");
    const users = await pool.query("SELECT * FROM users");
    console.log(users)
    res.json({
        database: db.rows,
        users: users.rows,
    });
});

router.post("/login", async (req, res) => {
    console.log("LOGIN HIT:", req.body);

    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const result = await pool.query(
            "SELECT id, name, email, password, role FROM users WHERE LOWER(TRIM(email)) = $1",
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            console.log("No user found for:", result.rows);
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        //console.log(result.rows[0])
        const user = result.rows[0];
        console.log(user)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(user.password)
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }


        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                UserName: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            userId: user.id,
            UserName: user.name,
            token,
            role: user.role,
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//module.exports = router;
export default router;
