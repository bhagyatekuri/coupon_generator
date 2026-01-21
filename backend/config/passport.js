//const passport = require("passport");
import passportConfig from "passport";
//import passport from "./config/passport.js";
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";
//const jwt = require("jsonwebtoken");
//const pool = require("../db");
import dotenv from "dotenv";
dotenv.config();
import pool from "../db.js";

passportConfig.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (_, __, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                let result = await pool.query(
                    "SELECT id, name FROM users WHERE email=$1",
                    [email]
                );

                let user;
                if (result.rowCount === 0) {
                    // SIGNUP
                    const insert = await pool.query(
                        "INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name",
                        [name, email]
                    );
                    user = insert.rows[0];
                } else {
                    // LOGIN
                    user = result.rows[0];
                }

                return done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

//module.exports = passport;
export default passportConfig;