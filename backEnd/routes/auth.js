const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') 
const fetchuser = require('../midlleware/fetchUser')

const JWT_SECRET = "samisalwaysgreat"

////////   Create new User /////////

router.post('/createuser',[

    body('name','name must be atleast 3 characters').isLength({ min: 3 }),
    body('email','enter a valid email').isEmail(),
    body('password','password must be atleast 5 characters').isLength({ min: 5 }),

],async (req,res) =>{
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    // check user already exist or not
    try {

    let user  = await User.findOne({email : req.body.email})

    if(user){
        return res.status(400).json({success,error : "email already exists"})
    }

    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password,salt)

    // create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })



    const data = {
        user:{
            id:user.id
        }
    }

    const authtoken = jwt.sign(data,JWT_SECRET)
 

    // res.json("successfully registered")
    let success = true
    res.json({success,authtoken})

 
    } catch (error) {
        console.error(error.message);
        res.status(500).send('some error occured')
    }
    })


    ////////   Login User /////////


    router.post('/login',[

        body('email','enter a valid email').isEmail(),
        body('password','password can not be blank').exists()
        
    ],async (req,res) =>{
        let success = false
        
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body

    try {

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error: " please enter valid email and password"})
        }

        let passwordcompare = await bcrypt.compare(password,user.password)

        if(!passwordcompare){
            success = false
            return res.status(400).json({success,error: " please enter valid email and password"})
        }

        const data = {
            user:{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET)
        success = true
        res.json({success,authtoken})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("intrnal server occured")
    }


    })


    ////////  Get Login User Details /////////

    router.post('/getuser',fetchuser,async (req,res) =>{

try {
 
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("intrnal server occured")
}
})

module.exports = router  