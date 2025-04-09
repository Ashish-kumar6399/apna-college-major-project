 const express = require("express");
 const app = express();
 const session = require("express-session");
 const flash = require("connect-flash");
 const path = require("path");


 app.set("views",path.join(__dirname,"views"));
 app.set("view engine","ejs");

const sessionOptions = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
}

 
 app.use(session(sessionOptions));
 app.use(flash());

 app.use((req,res,next)=>{
   res.locals.successMsg = req.flash("success");
   res.locals.errorMsg = req.flash("error");
   next();
 })

 app.get("/register",(req,res)=>{
    let {name ="anonymus"} =req.query;
    req.session.name = name;

    if(name==="anonymus"){
      req.flash("error","user not registerd");
    } else{
      req.flash("success"," new user registeerd to the classroom");
    }

   //  req.flash("success"," new user registeerd to the classroom");
    res.redirect("/hello");
 });





 app.get("/hello",(req,res)=>{
   res.locals
    res.render("page.ejs",{name:req.session.name});
 });
 app.get("/",(req,res)=>{
    res.send("hi i am root");
 });


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
