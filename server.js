const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const PORT = 3000;
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger",
    database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/homePage', (req, res) => {
    res.render(
        'home',
        {msg:""}
    );
})

app.post('/home',(req, res) => {
    const { username, password } = req.body;
    try {
        // using prepared statement & placeholder to avoid SQL Injection
        var sql = 'INSERT INTO users (username, password) VALUES (?,?)';
        con.query(sql, [username, password] ,function (err, result) {
        if (err) throw err;
        res.render(
            'home',
            {msg:"Login Record Inserted"}
        );
  });        
    } catch(error) {
        console.log(error);
    }
})

app.get('/createDB',(req, res) => {
    try {
        con.query("CREATE DATABASE mydb", function (err, result) {
            if (err) throw err;
            console.log("Database created");
          });
    } catch(error) {
        console.log(err);
    }
})

app.get('/createTable',(req, res) => {
    try {
        var sql = "CREATE TABLE users (username VARCHAR(255), password VARCHAR(255))";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table created");
        });
    } catch(error) {
        console.log(error);
    }
})


app.listen(
    PORT, 
    () => console.log(`server running on ${PORT}`)
);