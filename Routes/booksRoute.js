
import {Book} from '../models/bookModel.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyAccessToken from '../MiddleWare/verifyAccessToken.js'

 const router = express.Router();

router.post("/",async(req,res)=>{
    try{
         if(!req.body.title || !req.body.author || !req.body.publisheYear){
                    return res.status(400).send({message:"All fields are required"});
         }
         const newBook = {
           title:req.body.title,
           author:req.body.author,
           publisheYear:req.body.publisheYear
         };
         const book = await Book.create(newBook);
         res.status(201).send(book);

    }catch(err){
       console.log(err);
       res.status(500).send({message:err.message});

    }
})

router.get("/",verifyAccessToken,async(req,res)=>{
   try{
      
      //  let authToken=req.headers.authorization;//req.cookie["access-token"]
      //  var isValidToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

      //  if(isValidToken){
         const books = await Book.find();
         res.status(200).send({
            count:books.length,
            data:books
         });
      //  }else{
      //    res.status(400).send({error:"Invalid Token"})
      //  }

      //  console.log("------isValidToken",isValidToken)
        
   }catch(err){
       console.log(err);
       res.status(500).send({message:err.message})
   }
})

router.get("/:id",async(req,res)=>{
   try{
       const {id}=req.params;
        const book = await Book.findById(id);
        res.status(200).send({
           book
        });
   }catch(err){
       console.log(err);
       res.status(500).send({message:err.message})
   }
})

router.put("/:id",async(req,res)=>{
   try{
       if(!req.body.title || !req.body.author || !req.body.publisheYear){
           return res.status(400).send({message:"All fields are required"});
       }
       
           const {id} = req.params;
           
           const result = await Book.findByIdAndUpdate(id,req.body)
           console.log(typeof result);
           if(!result){
              return res.status(404).json({message:"Book not Found"});
           }

    
        return res.status(200).send({message:"Book Updated Successfully"})
   }catch(err){
       console.log(err);
       res.status(500).send({message:err.message});
   }

})


router.delete('/:id',async(req,res)=>{
   try{
    const {id}=req.params;

    const result =await Book.findByIdAndDelete(id);
    if(!result){
       return res.status(404).send({message:"Book NOt Found"})
    }
    return res.status(200).send({message:"Book is Deleted Successfully"})
   }catch(err){
       console.log(err);
       res.status(500).send({message:err.message});
   }
})


export default router;