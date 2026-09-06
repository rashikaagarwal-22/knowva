const express=require('express')
const authRouter=express.Router();
const {register,login,logout,deleteProfile}=require('../controller/userAuthent');
const userMiddleware=require('../middleware/userMiddleware')

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{

    const reply = {
        firstName: req.user.firstName,
        emailId: req.user.emailId,
        _id:req.user._id,
        role:req.user.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})

module.exports=authRouter;