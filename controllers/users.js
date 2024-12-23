const User = require("../models/user.js");

// signup
module.exports.signupGet = (req,res)=>{
    res.render("users/signup.ejs")
};
module.exports.signupPost = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const newUser = new User({email:email,username:username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","user was registered successfully!");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

// login
module.exports.loginGet = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginPost = async(req,res)=>{
    req.flash("success","welcome to WanderLust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout
module.exports.logoutGet = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged You Out!")
        res.redirect("/listings");
    })
}