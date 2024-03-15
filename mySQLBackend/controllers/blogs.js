const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const db = require("../db");

blogRouter.get("/", (request, response) => {
    const selectBlogsQuery = `
    SELECT b.id AS blog_id, b.title, b.author, b.url, b.likes, u.user_id, u.user_username 
        FROM blogs AS b
        JOIN user_bloglist AS u ON b.id = u.bloglist_id
`;
    db.query(selectBlogsQuery, (err, rows) => {
        if (err) {
            console.log(
                "BACKEND/controllers/blogs/get, An error occured: ",
                err
            );
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }
        return response.json(rows);
    });
});

blogRouter.get("/:id", (request, response) => {
    blogId = request.params.id;
    const selectBlogQuery = "SELECT * FROM blogs WHERE id = ?";

    db.query(selectBlogQuery, [blogId], (err, rows) => {
        if (err) {
            console.log(
                "BACKEND/controllers/blogs/get/:id, An error occured: ",
                err
            );
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }
        return response.json(rows);
    });
});

blogRouter.post("/", (request, response) => {
    console.log(
        "BACKEND/controllers/blogs/post, request.token:",
        request.token
    );
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    console.log(
        "BACKEND/controllers/blogs/post, decoded.token: ",
        decodedToken
    );
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid!" });
    }

    const existingUserQuery = "SELECT * FROM users where id = ?";
    db.query(existingUserQuery, [decodedToken.id], async (err, rows) => {
        if (err) {
            console.error(
                "BACKEND/controllers/blogs/post, Error querying users table: ",
                err
            );
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }

        const user = rows[0];
        console.log("user id: ", user.id);

        const { title, author, url, likes } = request.body;

        //Inserts into the blogs table
        const insertBlogQuery =
            "INSERT INTO blogs (title, author, url,likes, user_id) VALUES (?,?,?,?,?)";
        db.query(
            insertBlogQuery,
            [title, author, url, likes, user.id],
            (err, result) => {
                if (err) {
                    console.error(
                        "BACKEND/controllers/blogs/post, Error inserting data into blogs table:",
                        err
                    );
                    return response
                        .status(500)
                        .json({ error: "Internal server error" });
                }
                console.log(
                    "BACKEND/controllers/blogs/post, Data inserted into users table successfully:",
                    result
                );
                const blogId = result.insertId;

                //Inserts into the users_bloglist table
                const insertUser_BloglistQuery =
                    "INSERT INTO user_bloglist (user_id, user_username,bloglist_id) VALUES (?,?,?)";
                db.query(
                    insertUser_BloglistQuery,
                    [user.id, user.username, blogId],
                    (err, result) => {
                        if (err) {
                            console.error(
                                "BACKEND/controllers/blogs/post, Error inserting data into user_bloglist table:",
                                err
                            );
                            return response
                                .status(500)
                                .json({ error: "Internal server error" });
                        }
                        console.log(
                            "BACKEND/controllers/blogs/post, Data inserted into user_bloglist table successfully:",
                            result
                        );
                        return response
                            .status(201)
                            .json({ message: "User created successfully" });
                    }
                );
            }
        );
    });
});

blogRouter.put("/:id", (request, response) => {
    const { title, author, url, likes } = request.body;

    const blogId = request.params.id;

    const updateBlogQuery =
        "update blogs SET title = ?, author = ?, url = ?, likes = ? where id = ?";

    db.query(
        updateBlogQuery,
        [title, author, url, likes, blogId],
        (error, result) => {
            if (error) {
                console.error(
                    "BACKEND/controllers/blogs/put, Error updating blog:",
                    error
                );
                return response
                    .status(500)
                    .json({ error: "Internal server error" });
            }

            if (result.affectedRows > 0) {
                console.log("BACKEND/controllers/blogs/put, Put successful.");
                return response
                    .status(200)
                    .json({ message: "Blog updated successfully" });
            } else {
                return response.status(404).json({ error: "Blog not found" });
            }
        }
    );
});

blogRouter.delete("/:id", (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    console.log(
        "BACKEND/controllers/blogs/delete, deleting bloglist. decodedToken.id: ",
        decodedToken.id
    );
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid!" });
    }

    const blogId = request.params.id;

    //Finds if the currentblog being deleted is created by the user
    const user_bloglistQuery =
        "SELECT user_id FROM user_bloglist WHERE bloglist_id = ?";

    db.query(user_bloglistQuery, [blogId], (err, rows) => {
        if (err) {
            console.error(
                "BACKEND/controllers/blogs/delete, Error querying user_bloglist database:",
                err
            );
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }

        if (rows.length === 0) {
            return response.status(404).json({ error: "Blog not found" });
        }

        const creatorId = rows[0].user_id;
        console.log("creator ID is: ", creatorId);

        if (decodedToken.id === creatorId) {
            const delUser_BloglistQuery =
                "DELETE FROM user_bloglist where bloglist_id = ?";

            db.query(delUser_BloglistQuery, [blogId], (err, rows) => {
                if (err) {
                    console.error(
                        "BACKEND/controllers/blogs/delete, Error querying user_bloglist database:",
                        err
                    );
                    return response
                        .status(500)
                        .json({ error: "Internal server error" });
                }
                console.log(
                    "BACKEND/controllers/blogs/delete, Blog deleted from user_blogs table successfully"
                );
            });

            const delBlogsQuery = "DELETE FROM blogs where id = ?";
            db.query(delBlogsQuery, [blogId], (err, rows) => {
                if (err) {
                    console.error(
                        "BACKEND/controllers/blogs/delete, Error querying blogs database:",
                        err
                    );
                    return response
                        .status(500)
                        .json({ error: "Internal server error" });
                }

                console.log(
                    "BACKEND/controllers/blogs/delete, Blog deleted from blogs table successfully"
                );
                return response.status(204).end(); // Respond with status 204 (No Content) for successful deletion
            });
        } else {
            return response.status(403).json({ error: "Unauthorized" });
        }
    });
});

module.exports = blogRouter;
