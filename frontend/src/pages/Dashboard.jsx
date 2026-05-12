import { useState } from "react"
import { Board } from "../components/Board";
import { useEffect } from "react";

export function Dashboard ({activeUser, loadingBoards, addBoard, getBoards, getTasks, boards, deleteMethod, selectedBoard, setSelectedBoard, updateBoard}) {
    
    const [newBoard, setNewBoard] = useState({
        name: "",
        category: ""
    })
    async function handleAddBoard () {
        await addBoard(newBoard);

        setNewBoard({
            name: "",
            category: ""
        })
    }

    useEffect(() => {
        getBoards()
        getTasks()
    },[])
    return (

        <>
        <div className="max-w-7xl mx-auto p-6">
            <p className="text-sm italic">User: {activeUser.name}</p>
            { boards.length < 1 && (
            <p className="text-3xl text-center mt-18 font-semibold">Add boards to start tracking your notes. Create boards for any category of work and create + sort tasks per board.</p>
            )    
        }
            <p className="text-3xl text-center mt-18 font-semibold text-neutral-800">New board?</p>

            <div className="flex items-center justify-center mt-6">
            <div className="flex justify-center flex-col gap-4 bg-white p-6 rounded-lg">
                
                <label htmlFor="board-name-input">Name for board:
                <input 
                type="text"
                id="board-name-input"
                placeholder="Name"
                value={newBoard.name}
                onChange={(e) => setNewBoard(prev => ({
                    ...prev,
                    name: e.target.value
                }))}
                className="border border-gray-200 p-2 rounded-xl w-full mt-2"
                />
                </label>
                <label htmlFor="board-category-input">Category (optional):
                <input 
                type="text"
                id="board-category-input"
                placeholder="Work, personal, etc."
                value={newBoard.category}
                onChange={(e) => setNewBoard(prev => ({
                    ...prev,
                    category: e.target.value
                }))}
                className="border border-gray-200 p-2 rounded-xl w-full mt-2"
                />
                </label>

                <button 
                onClick={handleAddBoard}
                className="bg-cyan-700 w-full mt-2 hover:bg-cyan-800 cursor-pointer text-neutral-100 py-1.5 rounded-xl  font-medium">Add</button>
            </div>
            </div>

            <div>

                { boards.length > 0 && (
                <p className="text-center mt-12 text-2xl font-semibold text-neutral-800">Your boards</p>
                )    
            }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto p-6 mt-6">
                { boards.map((board => (
                    <Board board={board} loadingBoards={loadingBoards} key={board._id} selectedBoard={selectedBoard} setSelectedBoard={setSelectedBoard} deleteMethod={deleteMethod} updateBoard={updateBoard}/>
                )))

                }
                </div>
            </div>
        </div>
        </>
    )
}