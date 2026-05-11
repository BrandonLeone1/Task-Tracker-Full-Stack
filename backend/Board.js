import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    
    userID: {
        type: String,
        required: true
    },
    
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
}, {timestamps: true})


const Board = mongoose.model("Board", boardSchema);

export default Board;