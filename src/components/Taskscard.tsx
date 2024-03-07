import { useState } from "react";
import { Id, Task } from "../Type";
import Trashicon from "../icons/Trashicon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Prpos {
  task: Task;
  deletetask: (id: Id) => void;
  updateTask:(id:Id,content:String)=>void;
}



const Taskscard = ({ task, deletetask,updateTask }: Prpos) => {
  const [isMouseover, setisMouseover] = useState(false);
  const [editMode, seteditMode] = useState(false);

  const toggleeditMode = () => {

    seteditMode((prev) => !prev);
    setisMouseover(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if(isDragging){
    return <div ref={setNodeRef}
    style={style} className="bg-mainBackgroundColor p-2.5 relative h-[100px] min-h-[100px] items-center flex text-left rounded-xl opacity-40 border-2 border-rose-500"/>
  }

  if (editMode) {
    return (
      <div ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}

      className="bg-mainBackgroundColor p-2.5 relative h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab">
        <textarea
          className="
            h-[90%]
            w-full
            resize-none
            border-none
            rounded
            bg-transparent
            text-white
            focus:outline-none"
            autoFocus
            placeholder="Task content here"
            onBlur={toggleeditMode}
            onKeyDown={e=>{
                if(e.key==='Enter' && e.shiftKey){
                    toggleeditMode()
                }
            }}
            onChange={(e)=>{
                updateTask(task.id, e.target.value)
                if(task.content.length==0){
                  updateTask(task.id, "Untitled");
                }
            }
            }
            value={task.content}
        ></textarea>
      </div>
    );
  }

  return (
    <div
    ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleeditMode}
      onMouseEnter={() => {
        setisMouseover(true);
      }}
      onMouseLeave={() => {
        setisMouseover(false);
      }}
      className="bg-mainBackgroundColor p-2.5 relative h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab task"
    >
        <p className="
        my-auto
        h-[90%]
        w-full 
        overflow-y-auto
        overflow-x-hidden
        whitespace-pre-wrap
        ">
      {task.content}
        </p>
      {isMouseover && (
        <button
          onClick={() => {
            deletetask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded-lg opacity-60 hover:opacity-100"
        >
          <Trashicon />
        </button>
      )}
    </div>
  );
};

export default Taskscard;
