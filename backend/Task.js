import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    boardID: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const Task = mongoose.model("Task", taskSchema);

export default Task;