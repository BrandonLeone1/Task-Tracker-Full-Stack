import { useState } from "react"
import { Link } from "react-router";

export function Board ({board, deleteMethod, updateBoard, selectedBoard, loadingBoards, setSelectedBoard}) {
    const [editingBoard, setEditingBoard] = useState(false);
    const [updatedBoard, setUpdatedBoard] = useState(board);


    async function handleDeleteClick (id) {
        await deleteMethod(id)
    }

    async function handleUpdateClick (id) {
        await updateBoard(id, updatedBoard);
        setEditingBoard(false);
    }

  
   
    return (
        <>
        { loadingBoards ? (
            <div className="flex flex-col gap-4 bg-gray-300 animate-pulse border border-slate-200/50 w-full rounded-lg p-6 duration-300 hover:-translate-y-0.5">
                <div className="bg-gray-400 w-[90%] h-full p-3 mx-auto rounded-xl "></div>
                <div className="bg-gray-400 w-[90%] h-full p-3 mx-auto rounded-xl "></div>
                <div className="bg-gray-400 w-[90%] h-full p-3 mx-auto rounded-xl "></div>
            </div>
        ) : !editingBoard ? (
            <div className="flex flex-col gap-4 bg-white border border-slate-200/50 w-full rounded-lg p-6 duration-300 hover:-translate-y-0.5">
                
                <div className="flex justify-between w-full gap-4">
                <button onClick={() => setEditingBoard(true)}><i className="fa-solid fa-pencil text-cyan-700 cursor-pointer text-xl hover:text-cyan-900 duration-150"></i></button>
                <button onClick={() => handleDeleteClick(board._id)}><i className="fa-solid fa-x text-xl cursor-pointer text-rose-500 hover:text-rose-700 duration-150"></i></button>
                
                </div>
                <p className="text-xl font-medium mt-2">{board.name}</p>
                <p className="text-sm">{board.category}</p>
                <Link to={`/board/${board._id}`} className="font-medium w-fit text-cyan-700 after:h-0.5 after:w-full after:bg-cyan-700 after:block after:scale-x-0 hover:after:scale-x-100 after:duration-150">View board</Link>
            </div>
        ) : (
            <>
            <div className="flex flex-col gap-4 bg-white border border-slate-200/50 w-full items-center rounded-lg p-6">
                
                <div className="flex justify-between w-full gap-4">
                <button onClick={() => setEditingBoard(true)}><i className="fa-solid fa-pencil text-cyan-700 cursor-pointer text-xl hover:text-cyan-900 duration-150"></i></button>
                <button onClick={() => handleDeleteClick(board._id)}><i className="fa-solid fa-x text-xl cursor-pointer text-rose-500 hover:text-rose-700 duration-150"></i></button>
                
                </div>
                <p className="text-xl font-medium">{board.name}</p>
                <p className="text-sm">{board.category}</p>
                <Link to={`/board/${board._id}`} onClick={() => setSelectedBoard(board)} className="font-medium text-cyan-700 after:h-0.5 after:w-full after:bg-cyan-700 after:block after:scale-x-0 hover:after:scale-x-100 after:duration-150">View board</Link>
            </div>
            
            <div className="flex items-center justify-center bg-white/80 backdrop-blur-[2px] fixed inset-0 z-60 p-6 max-h-[90vh]">

            <div className="bg-gray-100 border z-40 border-gray-400/50 flex flex-col gap-4 justify-center p-6 rounded-lg">
            <label htmlFor="new-name-input" className="text-lg">New name?
            <input 
            type="text"
            id="new-name-input"
            placeholder="New name"
            value={updatedBoard.name}
            onChange={(e) => setUpdatedBoard(prev => ({
                ...prev,
                name: e.target.value
            }))}
            className="border border-gray-200 p-2 rounded-xl mt-2 w-full"
            />
            </label>

            <label htmlFor="new-category-input" className="text-lg">New category?
            <input 
            id="new-category-input"
            type="text"
            placeholder="New category"
            value={updatedBoard.category}
            onChange={(e) => setUpdatedBoard(prev => ({
                ...prev,
                category: e.target.value
            }))}
            className="border border-gray-200 p-2 rounded-xl mt-2 w-full"
            />
            </label>

            <div className="flex gap-4 justify-between text-lg font-medium">
            <button onClick={() => setEditingBoard(false)} className="cursor-pointer text-cyan-700 after:h-0.5 after:w-full after:bg-cyan-700 after:block after:scale-x-0 hover:after:scale-x-100 after:duration-150">Cancel</button>
            <button onClick={() => handleUpdateClick(board._id)} className="cursor-pointer text-cyan-700 after:h-0.5 after:w-full after:bg-cyan-700 after:block after:scale-x-0 hover:after:scale-x-100 after:duration-150">Update</button>
            </div>
            </div>

            </div>
            </>
        )

        }

        
        </>
    )
}