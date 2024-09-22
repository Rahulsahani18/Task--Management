const express=require('express');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const User= require('../model/UserModel');
const {registerValidation,loginValidation}= require('../joiValidation/validation')

const dotenv= require('dotenv');
const router= express.Router();

dotenv.config();

//Register
router.post('/register',async (req, res)=>{
const {error}=registerValidation(req.body)
if(error) return res.status(400).send(error.details[0].message);

 const emailExist= await User.findOne({ email:req.body.email});
if(emailExist){
    return res.status(400).send('Email already exists');
}
const user= new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
});
try{
const savedUser = await user.save();
res.send({user: savedUser})
}catch(err){
    res.status(400).send(err)
}
});

//Login

router.post('/login', async(req, res)=>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is  not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)  return res.status(400).send('Invalid Password');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token});
});

module.exports = router;