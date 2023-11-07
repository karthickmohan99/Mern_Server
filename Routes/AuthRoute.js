import {Signup} from '../models/bookModel.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRoute = express.Router();

authRoute.post('/',async(req,res)=>{
    try{
       const saltRounds =5;
       let myPlaintextPassword = req.body.password;
       let isemailExists = await Signup.findOne({email:req.body.email});
       console.log(isemailExists,"email existed or not");
        if(!req.body.name || !req.body.email || !req.body.password ){
                   return res.status(400).send({message:"All fields are required"});
        }

        else if(isemailExists == null){
         const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
         console.log(hash,"-------hash-------")
         const signupData = {
           name:req.body.name,
           email:req.body.email,
           password:hash,
           
         };
         const signData = await Signup.create(signupData);
         res.status(201).send({message:"registered Successfully",data:signData});
 
        }else{
         return res.status(400).send({error:"email already exists"});
        }
        
   }catch(err){
      console.log(err);
      res.status(500).send({message:err.message});

    }
})

authRoute.post('/login',async(req,res)=>{
   let email = req.body.email;
   let myPlaintextPassword = req.body.password;
     console.log(req.body,"bodyyy")
     
      let emailExists=await Signup.findOne({email:email});
      console.log(emailExists,"email existed or not");
       if(emailExists){
        let dbpassword=emailExists.password;
       
         
        const isValid = bcrypt.compareSync(myPlaintextPassword, dbpassword);
        if(isValid){
          const accessToken = jwt.sign({ email:email }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '10m'});
          const refreshToken = jwt.sign({ email:email,password:myPlaintextPassword },process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '1d'});
        
         return res.status(200).send({message:"login Successfully",token:accessToken,refreshToken:refreshToken});
        }else{
         return res.status(400).send({error:"Invalid Password"});
        }
       }else{
         return res.status(400).send({error:"email does not exists"});
       }
})

authRoute.post('/refresh',async(req,res)=>{
     const refreshToken =  req.body.refreshToken;
    
     console.log(refreshToken,"--refreshToken--")
     console.log(process.env.REFRESH_TOKEN_SECRET,"--refreshTokenSecret--")
     //verifying refreshToken
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded)=>{
         if(err){
          console.log(err,"refresh error")
          return res.status(401).send({error:"Invalid refresh token Login again"});
         }
         const email = decoded.email;
         console.log(decoded.exp, "--token expiration--");
        console.log(email,"--mail--")
         const accessToken = jwt.sign({ email:email }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1m'});
        return res.status(200).send({message:"refresh token",token:accessToken});
    }); 
    
})

export default authRoute;