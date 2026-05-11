import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export function TaskCard ({task, deleteTaskMethod, taskBeingDragged}) {
    
    const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: task._id,
    data: {
        status: task.status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };



    async function handleDeleteClick (id) {
        await deleteTaskMethod(id);
    }
    
    return (
        <>

            
            <div
            ref={setNodeRef} style={style} className={`flex flex-col p-4 gap-2 bg-white border border-gray-300 rounded-lg ${ !taskBeingDragged || taskBeingDragged._id !== task._id ? "opacity-100" : "opacity-30"}`} >
                
                <div className="flex gap-2 justify-between mb-2">
                <button {...attributes} {...listeners} className="text-3xl cursor-pointer text-cyan-700 hover:text-cyan-800 duration-150">☰</button>
                <button className="ml-auto cursor-pointer" onClick={() => handleDeleteClick(task._id)}><i className="fa-solid fa-x text-xl text-rose-500 hover:text-rose-700 duration-150"></i></button>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-xl font-medium text-left px-2">{task.name}</p>
                    <p className="text-sm text-neutral-700 text-left px-2">{task.description}</p>
                    <p className={`text-sm w-fit px-2 py-1 rounded-xl ${task.status === "ToDo" ? "bg-orange-50 text-orange-700" : task.status === "Started" ? "bg-cyan-50 text-cyan-800" : "bg-emerald-50 text-emerald-800" }`}>{task.status}</p>
                </div>
            </div>
            
            
         
        </>
    )
}