import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "",
  port: 5432,
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = ($1)", [email])
    
    if (checkResult.rows.length > 0){
      res.send("User already exist! Please try to login istead")
    } else {  
      await db.query("INSERT INTO users (email, password) VALUES ($1, $2)",[email, password]);
      res.render("secrets.ejs")
    }
  } catch (err){
    console.log(err)
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = ($1)", [email]);
    if (checkResult.rows.length > 0){
      if (checkResult.rows[0].password === password){
        res.render("secrets.ejs")
      } else {
        res.send("Wrong Password! Try again");
      }
    }else {
      res.send("Email is incorrect or User is not Registered")
    }
  }catch(err){
    console.log(err)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
