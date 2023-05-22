const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

const {Client} = require('pg');
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"root",
    database:"resturantDB"
});
client.connect();

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

let weatherData;
const url = "https://api.openweathermap.org/data/2.5/weather?q=dhamnod&units=metric&appid=65ed6d0afca34c7e9d4f8359067ee7a2"
https.get(url,function(response){
response.on("data",function(data){
weatherData = JSON.parse(data);
})
  
app.get("/",function(req,res){
  res.render("home",{weatherData: weatherData});
  })
});

app.get("/contact",function(req,res){
    res.render("contact",{weatherData: weatherData});
});

app.post("/contact",function(req,res){
  let sql = 'INSERT INTO users (name,email,message) VALUES ($1,$2,$3);';
  client.query(sql,[req.body.name,req.body.mail,req.body.message],function(err,result){
    if(!err){
      console.log("Successfully inserted");
      res.redirect("/contact");
    }
  })
})

app.get("/about",function(req,res){
  res.render("about",{weatherData: weatherData});
})

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});