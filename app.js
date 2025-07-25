// if (process.env.NODE_ENV!="production"){
//     require('dotenv').config();
// }
require('dotenv').config();

const express =require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path"); 
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dbUrl=process.env.ATLASDB_URL

main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.get("/", (req, res) => {
  res.redirect("/listings"); // or your actual homepage route
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//helps in storing info of user into the session so that the user does not req to authenticate again.
passport.serializeUser(User.serializeUser());

//helps in removing stored info of the user from the session once user gets logout.
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser=req.user || null; 
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
 
    next();
})

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!!"}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("server is listening");
})

