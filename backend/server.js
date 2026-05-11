import express, { response } from 'express'
import connectDB from './db.js';
import User from './User.js';
import bcrypt from 'bcrypt'
import generateToken from './generateToken.js';
import verifyToken from './verifyToken.js';
import checkAuth from './checkAuth.js';
import Board from './Board.js';
import Task from './Task.js';
import dotenv from 'dotenv'

const app = express();
app.use(express.json())
dotenv.config()
app.post("/api/auth/signup", async (req, res) => {
    const {name, email, password} = req.body;

    try {
      if (!name || !email ||!password || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
        return res.status(401).json({success: false, message: "Didn't receive all input fields."})
    }

    const userExistsAlready = await User.findOne({email});
    if (userExistsAlready) {
        return res.status(401).json({success: false, message: "Account exists with this email"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword
    });  

    await user.save()
    generateToken(user._id, res);

    res.status(200).json({success: true, message: "Signed up", user: {
        ...user._doc,
        password: null
    }})

    } catch (error) {
        return res.status(401).json({success: false, message: "Failed to add user", error: error})
    }
    
})

app.post("/api/auth/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return res.status(401).json({success: false, message: "Not provided email and/or password"})
        }

        const userExistsAlready = await User.findOne({email});
        if (!userExistsAlready) {
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }

        const isPasswordTheSame = await bcrypt.compare(password, userExistsAlready.password);
        if (!isPasswordTheSame) {
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }

        generateToken(userExistsAlready._id, res);

        res.status(200).json({success: true, message: "Signed in successfully", user: { 
            ...userExistsAlready._doc,
            password: null
        }})
    } catch (error) {
        return res.status(401).json({success: false, message: "Failed"})
    }
})

app.get("/api/auth/check", verifyToken, checkAuth);





app.post("/api/boards/add", verifyToken, async (req, res) => {
    const {name, category} = req.body;

    try {
        if (!name || typeof category !== "string" || !category || typeof name !== "string") {
            return res.status(400).json({success: false, message: "Failed to add board, didnt receive proper or all data required"})
        }

        const newBoard = new Board({
            userID: req.userID,
            name: name,
            category: category
        })

        await newBoard.save();

        res.status(200).json({success: true, message: "Added board", data: newBoard})
    } catch (error) {
        return res.status(400).json({success: false, message: "Failed to add board"})
    }
})

app.get("/api/boards/get", verifyToken, async (req, res) => {
    try {
        const usersBoards = await Board.find({userID: req.userID});
        if (!usersBoards) {
            return res.status(400).json({success: false, message: "Failed to get boards"})
        }
        res.status(200).json({success: true, message: "Got boards", data: usersBoards})
    } catch (error) {
        return res.status(400).json({success: false, message: "Failed to get boards"})
    }
})


app.delete("/api/boards/delete/:id", verifyToken, async (req, res) => {
    const {id} = req.params;

    try {
        if (!id) {
            return res.status(400).json({success: false, message: "Wasnt passed an ID"})
        }

        const deletedBoard = await Board.findOneAndDelete({userID: req.userID, _id: id});
        if (!deletedBoard) {
            return res.status(400).json({success: false, message: "Couldn't delete board"})
        }

        res.status(200).json({success: true, message: "Successfully delete board", data: deletedBoard});
    } catch (error) {
        return res.status(400).json({success: false, message: "Couldn't delete board"})
    }
})

app.put("/api/boards/edit/:id", verifyToken, async (req, res) => {
    const {id} = req.params;
    const updatedBoard = req.body;

    try {
        if (!id || !updatedBoard) {
            return res.status(401).json({success: false, message: "Failed, didnt receive ID or updated contents"})
        }

        const updatedBoardToReturn = await Board.findOneAndUpdate({userID: req.userID, _id: id}, updatedBoard, {new: true})
        if (!updatedBoardToReturn) {
            return res.status(402).json({success: false, message: "Failed to update board"})
        }

        res.status(200).json({success: true, message: "Updated board", data: updatedBoardToReturn});
    } catch (error) {
        return res.status(405).json({success: false, message: "Failed to update board"})
    }
})

app.post("/api/tasks/add", verifyToken, async (req, res) => {
    const {name, status, description, boardID} = req.body;

    try {
        if (!name || !status || !description || !boardID || typeof name !== "string" || typeof status !== "string" || typeof description !== "string" || typeof boardID !== "string") {
            return res.status(400).json({success: false, message: "Failed to add task. Didnt receive all data"})
        }

        const newTask = new Task({
            userID: req.userID,
            boardID: boardID,
            order: Date.now(),
            name: name,
            status: status,
            description: description,
        })
        await newTask.save();
        res.status(200).json({success: true, message: "Added task", data: newTask})
    } catch (error) {
        return res.status(400).json({success: false, message: "Failed to add task."})
    }
})

app.get("/api/tasks/get", verifyToken, async (req, res) => {
    try {
        const usersTasks = await Task.find({userID: req.userID})
        if (!usersTasks) {
            return res.status(400).json({success: false, message: "Failed to retreive tasks"})
        }
        res.status(200).json({success: true, message: "Got tasks", data: usersTasks})
    } catch (error) {
        return res.status(400).json({success: false, message: "Failed to retreive tasks"})
    }
})

app.delete("/api/tasks/delete/:id", verifyToken, async (req,res) => {
    const {id} = req.params;

    try {
        if (!id) {
            return res.status(400).json({success: false, message: "Failed to delete task, not provided an ID"})
        }

        const deletedTask = await Task.findOneAndDelete({userID: req.userID, _id: id});
        if (!deletedTask) {
            return res.status(400).json({success: false, message: "Failed to delete task, couldn't find it"})
        }
        res.status(200).json({success: true, message: "Deleted task", data: deletedTask})
    } catch (error) {
        return res.status(400).json({success: false, message: "Failed to delete task"})
    }
})


app.put("/api/tasks/update-all", verifyToken, async (req, res) => {
    const updatedTasks = req.body;

    try {
        if (!updatedTasks) {
            return res.status(402).json({success: false, message: "Failed to update tasks, didnt receive them from user"})
        }
        const operations = updatedTasks.map(task => ({
        updateOne: {
            filter: {
                _id: task._id,
                userID: req.userID
            },
            update: {
                $set: {
                    order: task.order,
                    status: task.status
                }
            }
        }  
        }))

        const result = await Task.bulkWrite(operations);
        if (!result) {
            return res.status(420).json({success: false, message: "NO RESULT FROM BULKWRITE"})
        }
        res.status(200).json({success: true, message: "Updated all tasks", data: result})
    } catch (error) {
        return res.status(409).json({success: false, message: "Failed to update tasks"})
    }
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Started server on port 5000")
    connectDB();
})
