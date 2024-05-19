var express = require('express');
var router = express.Router();
const user = require("./users");
const posts = require("./posts");
const passport = require('passport');
const upload = require('./multer')

const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

router.get('/register', async function(req, res, next) {
    res.render("register.ejs")
});



router.get('/login', async function(req, res, next) {
  res.render("login.ejs", {error: req.flash('error')});
});



router.post('/upload',isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
   return res.status(404).send('No Files Selected');
  }
  const userprofile = await user.findOne({username:req.session.passport.user});
  
  const postdata=await posts.create({

    image:req.file.filename,
    postText:req.body.filecaption,
    user:user._id
    

  });


  userprofile.posts.push(postdata._id);
  await userprofile.save();
  res.redirect("/profile")
 
  
});

router.post("/delete", async (req, res) => {
  const imgid = req.body._id; 
  console.log("received image id--->", imgid);

  try {
    const deletedPost = await posts.deleteMany({ "_id": imgid });

    if (deletedPost.deletedCount > 0) {
      console.log("Image post deleted successfully:", deletedPost);
      res.redirect("/profile");
    } else {
      console.log("Image post not found");
      res.status(404).send("Image post not found");
    }
  } catch (error) {
    console.error("Error deleting image post:", error);
    res.status(500).send("Error deleting image post");
  }
});



router.get('/profile',isLoggedIn, async function(req, res, next) {
  const userprofile = await user.findOne({
   username: req.session.passport.user
  })
  .populate("posts");
  console.log(userprofile);
  res.render("profile.ejs", {userprofile});
});

router.get('/feed', async function(req, res, next) {
  try {
    const userprofile = await user.find({}).populate("posts");
    console.log(userprofile);
    res.render("feed.ejs", { userprofile});
  } catch (error) {
    next(error);
  }
});

router.get('/', async function(req, res, next) {
  try {
    const userprofile = await user.find({}).populate("posts");
    console.log(userprofile);
    res.render("home.ejs", { userprofile});
  } catch (error) {
    next(error);
  }
});


router.post("/register", function(req, res) {
    const { username, email, fullname } = req.body;
    const userData = new user({ username, email, fullname });

    user.register(userData, req.body.password)
        .then(function() {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/profile");
            });
        })
        .catch(function(err) {
            console.error("Error registering user:", err);
            res.redirect("/register");
        });


});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash:true
   
   
}));

router.get("/logout", function(req, res) {
  req.logout(function(err) {
      if (err) {
          console.error("Error logging out:", err);
          return next(err);
      }
      res.redirect('/login');
  });
});

router.post("/fileupload", isLoggedIn,upload.single("image"),async function(req,res,next){
  const userdp = await user.findOne({username:req.session.passport.user});
  userdp.profileimage = req.file.filename;
  await userdp.save();
  console.log(userdp);
  res.redirect("/profile")
});

router.post("/uploadbio", isLoggedIn,async function(req,res,next){
  const userbio = await user.findOne({username:req.session.passport.user});
  userbio.bio= req.body.userbio;
  await userbio.save();
  console.log(userbio);
  res.redirect("/profile")
});









function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login"); 
}

module.exports = router;
