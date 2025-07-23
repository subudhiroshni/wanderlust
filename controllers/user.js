const User=require("../models/user")

module.exports.renderSignUpForm=(req,res)=>{
    res.render("Users/signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to wanderlust!");
        res.redirect("/listings");
    });
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("Users/login.ejs");
}

module.exports.login=async(req,res)=>{
        req.flash("success","welcome back to wanderlust!");
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
    }

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}

module.exports.toggleWishlist=async(req,res,next)=>{
    const listingId=req.params.id;//Gets listing id from the url
    const user=await User.findById(req.user._id);//Gets currently logged-in user's ID from session
    const alreadyInWishlist=user.wishlist.includes(listingId);
    if(alreadyInWishlist){
        user.wishlist.pull(listingId);
    }else{
        user.wishlist.push(listingId);
    }
    await user.save();
    res.status(200).json({success:true,wishlist:user.wishlist});
};

module.exports.wishlist=async(req,res)=>{
    const user=await User.findById(req.user._id).populate("wishlist");
    res.render("Users/wishlist",{listings:user.wishlist});
}


module.exports.destroyWishlist = async (req, res) => {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    const alreadyInWishlist = user.wishlist.includes(listingId);
    if (alreadyInWishlist) {
        user.wishlist.pull(listingId); // removes it from the array
        await user.save();
        req.flash("success", "Listing removed from wishlist!");
    } else {
        req.flash("error", "Listing not found in wishlist!");
    }

    res.redirect("/wishlist"); // or wherever you want to go after
};
