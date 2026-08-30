import express from "express";
import path ,{dirname}from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from "./middleware/authMiddleware.js";


const app = express()
const PORT = process.env.PORT || 3000

//Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
//Get the directory name from the file path
const __dirname = dirname(__filename);

//middleware
app.use(express.json())
//serves the HTML file from the /public directory
//tells express to serve all files in the /public directory as static files
//This means that any file in the /public directory can be accessed by its URL path
app.use(express.static(path.join(__dirname, '../public')));

//serving teh HTMl file from the /public directory
app.get('/' , (req,res) => {
    res.sendFile(path.join(__dirname,'../public/index.html'))
})

//Routes
app.use('/auth' , authRoutes)
app.use('/todos' ,authMiddleware, todoRoutes)

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})