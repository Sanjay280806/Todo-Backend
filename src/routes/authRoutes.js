import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  db  from "../db.js";
import prisma from "../prismaClient.js";

const router = express.Router();

//register a new user
router.post('/register' , async(req,res) => {
    const {username , password} = req.body
    //save sanjay|1234

    const hashedPassword = bcrypt.hashSync(password,8)

    //save the new user and hashed password to the DB
    try{
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword 
            }
        })

        //now that we have a user , I want to add their first todo
        const defaultTodo = `Hello :) Add Your First Todo!`
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        //Create a Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET,{expiresIn : '24h'})
        res.json({ token })

    }catch(err){
        console.log(err.message)
        res.sendStatus(503)

    }

})

router.post('/login' , async (req,res) =>{
    //we get the email , and we look up the password associated with email in db
    //but we get it back and see its encrypted, which means we cannot compare it to the one user trying to login
    //so we do , is again one way encrypt the password the user given

    const {username , password} = req.body

    try{
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        //if we cannot find a user associate with the username , return out the function
        if(!user) {return res.status(404).send({message : "user Not Found" })}

        const passwordIsValid = bcrypt.compareSync(password , user.password)
        //if the Password does not match , return out the function
        if(!passwordIsValid){return res.status(404).send({message : "Invalid Password"})}

        //Successful aunthentication
        const token = jwt.sign({ id: user.id} , process.env.JWT_SECRET,{expiresIn: '24h'})
        res.json({ token })
    }catch (err){
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router