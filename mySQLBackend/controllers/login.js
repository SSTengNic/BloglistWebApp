const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const db = require("../db");

loginRouter.post("/", async (request, response) => {
    const { username, password } = request.body;

    // Query the MySQL database to find the user with the given username
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (error, rows) => {
            if (error) {
                console.error(
                    "BACKEND/controllers/login/post, Error querying users table:",
                    error
                );
                return response
                    .status(500)
                    .json({ error: "Internal server error" });
            }

            if (rows.length === 0) {
                return response
                    .status(401)
                    .json({ error: "Invalid username or password" });
            }

            // Compare the password hash from the database with the provided password
            const user = rows[0];
            const passwordCorrect = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordCorrect) {
                return response
                    .status(401)
                    .json({ error: "Invalid username or password" });
            }

            // Generate JWT token
            const userForToken = {
                username: user.username,
                id: user.id,
            };

            const token = jwt.sign(userForToken, process.env.SECRET, {
                expiresIn: "3h",
            });

            response.status(200).send({
                token,
                username: user.username,
                name: user.name,
                id: user.id,
            });
        }
    );
});

module.exports = loginRouter;
