const jwt = require("jsonwebtoken");
const db = require("../db");

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (request, response, next) => {
    console.log(error.message);

    if (error.name === "CastError") {
        return response.status(404).send({ error: "malformatted id" });
    }

    next(error);
};

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
        console.log(
            "BACKEND/utils/middleware/tokenExtractor, request.token: ",
            request.token
        );
    } else {
        request.token = null;
    }

    next();
};

const userExtractor = async (request, response, next) => {
    if (!request.token) {
        request.user = null;
    } else {
        const decodedToken = jwt.verify(request.token, process.env.SECRET);
        console.log(
            "BACKEND/utils/middleware/userExtractor, decodedtoken: ",
            decodedToken
        );
        if (!decodedToken.id) {
            return response.status(401).json({ error: "token invalid!" });
        }

        const existingUserQuery = "SELECT * FROM users where id = ?";
        db.query(existingUserQuery, [decodedToken.id], async (err, rows) => {
            if (err) {
                console.error(
                    "BACKEND/utils/middleware/userExtractor, Error querying users table: ",
                    err
                );
                return response
                    .status(500)
                    .json({ error: "Internal server error" });
            }

            request.user = rows[0];
        });
    }

    next();
};

module.exports = {
    unknownEndPoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};
