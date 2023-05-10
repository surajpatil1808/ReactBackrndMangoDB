
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Harrisgood$oy';


// route 1:create a user using : POST "/api/auth/createuser"  Doesnt require authintication
router.post('/createuser',[
   body('name','Enter a valid name').isLength({ min: 3 }),
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'password must be atleast five characters').isLength({ min: 5 }),
   

], async (req, res)=>{
   // console.log(req.body);
   // const user=User(req.body);
   // user.save();
   // res.send(req.body);
   
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
   }
   //check whethere the use with this enmail exist
   try {
      

   let user= await User.findOne({email:req.body.email});
   
   if (user){
      return res.status(400).json({error:"sorry email exists"})
   }
   const salt=await bcrypt.genSalt(10);
   const secPass= await bcrypt.hash(req.body.password, salt);

   //create new user
    user= await User.create({
      name: req.body.name,
      email: req.body.email,
      // password: req.body.password,
      password: secPass
    });

   const data={
      user:{
         id: user.id

      }
    
   }
   const authToken= jwt.sign(data, JWT_SECRET);
  
    
   //  .then(user => res.json(user))
   //  .catch(err=>{console.log(err)
   //  res.json({error:'please enter a unique value for email', message:err.message})})

     // res.json(user)
     res.json({authToken})
   } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");

   }

})


//// route:2 authenticate a user using : POST "/api/auth/login"  Doesnt require login
router.post('/login',[
   //body('name','Enter a valid name').isLength({ min: 3 }),
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'password cannot be blank').exists(),
   

], async (req, res)=>{
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
   
}

const {email, password}= req.body;
try {
   let user= await User.findOne({email});
   if(!user){
      return res.status(400).json({error:"please try to login with correct credentials"});
   }

   const passwordCompare = await bcrypt.compare(password, user.password);
   if(!passwordCompare)
   {
      return res.status(400).json({error:"please try to login with correct credentials"});

   }

   const data={
      user:{
         id: user.id

      }
    
   }
   const authToken= jwt.sign(data, JWT_SECRET);
   res.json({authToken})
   
} catch (error) {

   console.error(error.message);
   res.status(500).send("internal serevr error");
}
})


//// route3: get logging user details : POST "/api/auth/getuser"  login required
router.post('/getuser', fetchuser, async (req, res)=>{


try {
   userId=req.user.id;
   const user= await User.findById(userId).select("-password")
   res.send(user)
   
} catch (error) {
   console.error(error.message);
   res.status(500).send("internal serevr error");
}
})

module.exports = router