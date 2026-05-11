import { useState } from "react";
import { Link } from "react-router";
import { TaskCard } from "../components/TaskCard";
import { DndContext } from '@dnd-kit/core'
import { DroppableColumn } from "../components/DroppableColumn";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {arrayMove} from '@dnd-kit/sortable';
import { DragOverlay } from "@dnd-kit/core";
import {useParams} from 'react-router-dom';

export function ViewBoard ({addTask, tasks, deleteTaskMethod, updateTasks, boards, isLoading}) {
    
    const {id} = useParams();
    
    const selectedBoard = boards.find(board => board._id === id);
   
    const tasksForThisBoard = tasks.filter(task => task.boardID === selectedBoard._id).toSorted((a,b) => a.order-b.order)

    const [newTask, setNewTask] = useState({
        name: "",
        status: "",
        description: "",
        boardID: selectedBoard._id
    })
    
    async function handleClick () {
        console.log(newTask)

        await addTask(newTask)
        setNewTask({
            name: "",
            status: "",
            description: "",
            boardID: selectedBoard._id
        })
    }

   async function handleDragEnd (event) {
    const boardTasks = tasks.filter(task => task.boardID === selectedBoard._id);
    const {active, over} = event;
  
        if (!active || !over) {
            return
        }

        
        
        if (active.data.current.status === over.data.current.status) {
            const oldIndex = tasksForThisBoard.filter(task => task.status === active.data.current.status).toSorted((a,b) => a.order-b.order).findIndex(task => task._id === active.id)
            const overTask = tasksForThisBoard.find(task => task._id === over.id);

            const newIndex = overTask ? tasksForThisBoard.filter(task => task.status === over.data.current.status).toSorted((a,b) => a.order - b.order).findIndex(task => task._id === over.id) : oldIndex
            
            console.log(oldIndex, "old index")
            console.log(newIndex, "new index")
           
          
            let movedTasks = [...tasksForThisBoard.filter(task => task.status === active.data.current.status)];
            
            
            movedTasks = arrayMove(movedTasks, oldIndex, newIndex);
           console.log(movedTasks, "moved")
            
          

            let updatedTasks = movedTasks.map((task,index) => {
                return {
                    ...task,
                    order: index
                }
            })

            let completedTasks = tasks.map(task => {
            const updatedTask = updatedTasks.find(t => t._id === task._id);
            if (updatedTask) {
                return {
                    ...task,
                    order: updatedTask.order
                }
            } else {
                return task
            }
           })
            
            
            await updateTasks(completedTasks);
            
        } else {
          console.log(over.data.current.status)
          let activeColumn = boardTasks.filter(task => task.status === active.data.current.status);
          let overColumn = boardTasks.filter(task => task.status === over.data.current.status);

          const activeTask = { ...activeColumn.find(task => task._id === active.id) }
          activeTask.status = over.data.current.status;

          activeColumn = activeColumn.filter(task => task._id !== activeTask._id);
        
          let indexOfOver = overColumn.findIndex(task => task._id === over.id);

          if (indexOfOver === -1) {
            indexOfOver = overColumn.length
          }

          overColumn.splice(indexOfOver, 0, activeTask);
          console.log(overColumn)
          
          let otherTasks = boardTasks.filter(task => task.status !== over.data.current.status && task.status !== active.data.current.status);

        
          const activeUpdated = activeColumn.map((t,index) => {
            return {
                ...t,
                order: index
            }
          });
          const overUpdated = overColumn.map((t,index) => {
            return {
                ...t,
                order: index
            }
          })
          
          const fullyUpdated = [
            ...otherTasks,
            ...activeUpdated,
            ...overUpdated,
          ]
          await updateTasks(fullyUpdated);

        }
            
      setTaskBeingDragged(null)      
    }
    

    const [taskBeingDragged, setTaskBeingDragged] = useState(null);
    function handleDragStart(event) {
        const {active} = event;

        if (!active) {
            return
        }
        const activeTask = tasks.find(task => task._id === active.id);
        if (!activeTask) {
            return
        }

        setTaskBeingDragged(activeTask);
    }

    
    return (
        <>
        <div className="max-w-7xl mx-auto p-6">
        <div className="w-fit"><Link to={`/`} className="text-xl text-cyan-700 font-medium after:h-0.5 after:w-full after:bg-cyan-700 after:block after:scale-x-0 hover:after:scale-x-100 after:duration-150 w-fit">Go back</Link></div>
        
        <div className="max-w-5xl mx-auto p-6 mt-12">
        <p className="text-3xl text-center font-semibold">Add a task to {selectedBoard.name}</p>
       
       <div className="flex flex-col gap-4 mt-12">
        <label htmlFor="new-task-name">Task name
        <input 
        type="text"
        id="new-task-name"
        placeholder="Enter name"
        value={newTask.name}
        onChange={(e) => setNewTask(prev => ({
            ...prev,
            name: e.target.value
        }))}
        className="border mt-2 border-gray-300 p-2 rounded-xl w-full"
        />
        </label>
        <label htmlFor="task-status-input">Task status
        <select 
        id="task-status-input"
        value={newTask.status}
        onChange={(e) => setNewTask(prev => ({
            ...prev,
            status: e.target.value
        }))}
        className="border border-gray-300 p-2 rounded-xl mt-2 w-full cursor-pointer">
            <option defaultValue>Choose a status</option>
            <option value={`ToDo`}>ToDo</option>
            <option value={`Started`}>Started</option>
            <option value={`Finished`}>Finished</option>
        </select>
        </label>

        <label htmlFor="task-description-input">Task description
        <textarea 
        id="task-description-input"
        placeholder="Enter description"
        className="border border-gray-300 p-2 rounded-xl w-full mt-2"
        value={newTask.description}
        onChange={(e) => setNewTask(prev => ({
            ...prev,
            description: e.target.value
        }))}
        />
        </label>
        <button onClick={handleClick} className="bg-cyan-700 py-1.5 overflow-hidden rounded-lg text-neutral-100 cursor-pointer font-medium text-lg after:w-0 hover:after:w-full after:duration-300 after:h-full after:block after:bg-cyan-800 after:absolute relative after:inset-0 after:rounded-lg z-10 after:z-[-1]">Add task</button>
       </div>

        { tasksForThisBoard.length > 0 && (
       <p className="mt-12 text-center text-2xl font-medium">Current tasks:</p>
        )
    }
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto text-center mt-6">
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div>
                
                <DroppableColumn id={"ToDo"} status={"ToDo"}>
                <p>ToDo: ({tasksForThisBoard.filter(task => task.status === "ToDo").length})</p>
                <div className="w-full bg-orange-500 h-2 -mt-4 -mb-4 rounded-lg"></div>
                { tasksForThisBoard.length < 1 && (
                <p className="mt-6">Add a task above!</p>
                )
                }
                <SortableContext items={tasksForThisBoard.filter(task => task.status === "ToDo").toSorted((a,b) => a.order - b.order).map(task => task._id)} strategy={verticalListSortingStrategy}>
                { tasksForThisBoard.filter(task => task.status === "ToDo")
                  .toSorted((a, b) => a.order - b.order)
                  .map(task => (
                    <TaskCard key={task._id} task={task} deleteTaskMethod={deleteTaskMethod} taskBeingDragged={taskBeingDragged} />
                  ))

                }
                </SortableContext>
                
                </DroppableColumn>
            </div>

            <div>
                

                    <DroppableColumn id={"Started"} status={"Started"}>
                        <p>Started: ({tasksForThisBoard.filter(task => task.status === "Started").length})</p>
                        <div className="w-full bg-cyan-700 h-2 -mt-4 -mb-4 rounded-lg"></div>
                        { tasksForThisBoard.length < 1 && (
                         <p className="mt-6">Add a task above!</p>
                        )
                        }
                        <SortableContext items={tasksForThisBoard.filter(task => task.status === "Started").toSorted((a,b) => a.order - b.order).map(task => task._id)} strategy={verticalListSortingStrategy}>
                    { tasksForThisBoard.filter(task => task.status === "Started")
                      .toSorted((a, b) => a.order - b.order)
                      .map(task => (
                        <TaskCard key={task._id} task={task} deleteTaskMethod={deleteTaskMethod} taskBeingDragged={taskBeingDragged}/>
                      ))
                    }
                    </SortableContext>
                    </DroppableColumn>
                
            </div>

            <div>
                

                <DroppableColumn id={"Finished"} status={"Finished"}>
                    <p>Finished: ({tasksForThisBoard.filter(task => task.status === "Finished").length})</p>
                    <div className="w-full bg-emerald-600 h-2 -mt-4 -mb-4 rounded-lg"></div>
                    { tasksForThisBoard.length < 1 && (
                    <p className="mt-6">Add a task above!</p>
                    )
                    }
                    <SortableContext items={tasksForThisBoard.filter(task => task.status === "Finished").toSorted((a,b) => a.order - b.order).map(task => task._id)} strategy={verticalListSortingStrategy}>
                { tasksForThisBoard.filter(task => task.status === "Finished")
                  .toSorted((a, b) => a.order - b.order)
                  .map(task => (
                    <TaskCard key={task._id} task={task} deleteTaskMethod={deleteTaskMethod} taskBeingDragged={taskBeingDragged}/>
                  ))

                }
                </SortableContext>
                </DroppableColumn>
                
            </div>
            <DragOverlay>
                { taskBeingDragged && (
                <div className="flex flex-col p-4 gap-2 bg-white border border-gray-300 rounded-lg opacity-60" >
                
                <div className="flex gap-2 justify-between mb-2">
                <button className="text-3xl cursor-pointer text-cyan-700 hover:text-cyan-800 duration-150">☰</button>
                <button className="ml-auto cursor-pointer"><i className="fa-solid fa-x text-xl text-rose-500 hover:text-rose-700 duration-150"></i></button>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-xl font-medium text-left px-2">{taskBeingDragged.name}</p>
                    <p className="text-sm text-neutral-700 text-left px-2">{taskBeingDragged.description}</p>
                    <p className={`text-sm w-fit px-2 py-1 rounded-xl ${taskBeingDragged.status === "ToDo" ? "bg-orange-50 text-orange-700" : taskBeingDragged.status === "Started" ? "bg-cyan-50 text-cyan-800" : "bg-emerald-50 text-emerald-800" }`}>{taskBeingDragged.status}</p>
                </div>
            </div>
                )

                }
            </DragOverlay>
            </DndContext>
       </div>

        </div>
        </div>
        </>
    )
}