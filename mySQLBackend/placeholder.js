const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Soulen300698!",
    database: 'bloglists'
})

app.get('/', (request, response) => {
    return response.json('From Backend Side')
})

app.get('/books', (request, response)=> {
    const sql = "SELECT * from books"
    db.query(sql, (error,data) => {
        if (error) return response.json(error);
        else {
            return response.json(data);
        }
    })
})

app.post("/books", (request, response) => {

    const body = request.body

    const q = "INSERT INTO books (`title`, `description`, `cover`) VALUES (?, ?, ?)";
    const values = [body.title,body.description,body.cover];

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Error inserting data into books table:", err);
            return response.status(500).json({ error: "Internal server error" });
        } else {
            console.log("Data inserted into books table successfully:", data);
            return response.status(201).json(data); // Respond with status 201 for created
        }
    });
});

app.listen(8081, ()=> {
    console.log("listening")
})