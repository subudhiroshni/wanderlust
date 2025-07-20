const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController. signUp));

router.route("/login")
.get(userController.renderLoginForm)
.post(savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    userController.login
);


// router.get("/signup",userController.renderSignUpForm);

// router.post("/signup",wrapAsync(userController. signUp)
// );

// router.get("/login",userController.renderLoginForm);

// router.post("/login"
//     ,savedRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash:true,
//     }),
//     userController.login
// );

router.get("/logout",userController.logout)

module.exports=router;