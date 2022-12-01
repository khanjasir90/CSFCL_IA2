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

app.get('/insecureLogin', (req, res) => {
    res.render(
        'home',
        {msg:""}
    );
})

app.get('/secureLogin', (req, res) => {
    res.render(
        'secure',
        {msg: ""}
    );
})

app.post('/secureLogin',(req, res) => {
    const { username, password} = req.body;
    try {
        // using prepared statement & placeholder to avoid SQL Injection
        var sql = 'SELECT * FROM users where username=?';
        con.query(sql, [username] ,function (err, result) {
            console.log(result);
        if (err) res.render(
            'home',
           { msg: "please enter correct username and pasword" }
        );
        res.render(
            'home',
            {msg:"Login Successfull"}
        );
  });        
    } catch(error) {
        console.log(error);
    }
})

app.post('/insecureLogin',(req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const sql = "SELECT * FROM users where username='"+username+"'";
        con.query(sql, (err, rows) => {
            console.log(rows);
            if(err) console.log(err);
            else res.render(
                'outputInsecure',   
                {
                    data: rows
                }
            )
        })
    } catch (error) {
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