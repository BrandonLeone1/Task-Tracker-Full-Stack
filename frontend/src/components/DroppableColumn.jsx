import { useDroppable } from "@dnd-kit/core";

export function DroppableColumn ({id, status, children}) {
    const {setNodeRef} = useDroppable ( {
        id: id,
        data: {
            status: status
        }
    })

    return (
        <div ref={setNodeRef} className="flex flex-col gap-6 mt-6 h-full">
            {children}
        </div>
    )
}