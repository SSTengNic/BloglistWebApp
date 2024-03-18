const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../db");

usersRouter.get("/", (request, response) => {
    const sql = "SELECT * from users";
    db.query(sql, (error, rows) => {
        if (error) return response.json(error);
        else {
            return response.json(rows);
        }
    });
});

usersRouter.get("/:id", async (request, response, next) => {
    const existingUserQuery = "SELECT * from users WHERE id = ?";
    db.query(existingUserQuery, [request.params.id], async (err, rows) => {
        if (err) {
            console.log(
                "BACKEND/controllers/users/get/:id, Error occured when retrieving user: ",
                err
            );
            return response
                .status(500)
                .json({ error: "Internal server error" });
        } else {
            return response.json(rows);
        }
    });
});

usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;

    console.log("request body: ", request.body);

    // Check if the password meets the length requirement
    if (password.length < 3) {
        return response.status(401).json({
            error: "Password must be at least 3 characters long",
        });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if the username already exists in the database
    const existingUserQuery = "SELECT * FROM users WHERE username = ?";
    db.query(existingUserQuery, [username], async (err, rows) => {
        if (err) {
            console.error(
                "BACKEND/controllers/users/post, Error querying users table:",
                err
            );
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }

        if (rows.length > 0) {
            // Username already exists
            return response
                .status(409)
                .json({ error: "Username already exists" });
        }

        // Insert the new user into the database
        const insertUserQuery =
            "INSERT INTO users (username, name, password_hash) VALUES (?, ?, ?)";
        db.query(
            insertUserQuery,
            [username, name, passwordHash],
            (err, result) => {
                if (err) {
                    console.error(
                        "BACKEND/controllers/users/post, Error inserting data into users table:",
                        err
                    );
                    return response
                        .status(500)
                        .json({ error: "Internal server error" });
                }
                console.log(
                    "BACKEND/controllers/users/post, Data inserted into users table successfully:",
                    result
                );
                return response
                    .status(201)
                    .json({ message: "User created successfully" });
            }
        );
    });
});

module.exports = usersRouter;
