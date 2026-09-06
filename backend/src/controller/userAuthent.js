const User=require('../models/user');
const validate=require('../utils/validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const redisClient = require('../config/redis');

const register=async(req,res)=>{
    try{
        validate(req.body);
        const {firstName,emailId,password}=req.body;
        req.body.password=await bcrypt.hash(password,10);

        const user=await User.create(req.body);
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        const token=jwt.sign({_id:user._id,emailId:emailId},process.env.JWt_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});

        res.status(201).json({
            user:reply,
            message:"User registered Successfully"
        })
        
    }
    catch(err){
        if (err.code === 11000) {
        return res.status(409).json({
            message: "An account with this email already exists."
        });
    }
        res.status(400).json({message:err.message});
    }
}

const login=async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        
        if(!emailId)
            throw new Error("Enter Email ID");
        if(!password)
            throw new Error("Enter Password");

        const user=await User.findOne({emailId});
        if(!user) throw new Error("Invalid Credentials")
        const match=await bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("Invalid credentials");
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWt_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});

        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).json({message:err.message});
    }


}

const logout=async(req,res)=>{
    try{
        const {token}=req.cookies;
        const payload=jwt.decode(token);
        await redisClient.set(`KBtoken:${token}`,'Blocked');
        await redisClient.expireAt(`KBtoken:${token}`,payload.exp);
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("logged out successfully");
    }
    catch(err){
        res.status(203).send("Error: "+err);
    }
}


const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    await User.findByIdAndDelete(userId);//findByIdAndDelete is a mongoose function, in schema, we have to give equivalent mongoDB function

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});// but can handle it in schema using post
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}


module.exports={register,login,logout,deleteProfile};
