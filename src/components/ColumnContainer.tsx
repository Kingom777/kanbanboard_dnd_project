import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Id, Task, column } from "../Type";
import Trashicon from "../icons/Trashicon";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Plusicons from "../icons/Plusicons";
import Taskscard from "./Taskscard";
interface Props {
  column: column;
  deleteColumn: (id: Id) => void;
  updatecolumn: (id: Id, title: String) => void;
  createTask: (columnId: Id) => void;
  deletetask: (id: Id) => void;
  tasks: Task[];
  updateTask: (id: Id, content: String) => void;
}

const ColumnContainer = (prpos: Props) => {
  const [editMode, seteditMode] = useState(false);

  const {
    column,
    deleteColumn,
    updatecolumn,
    createTask,
    tasks,
    deletetask,
    updateTask,
  } = prpos;

  const tasksids = useMemo(()=>{
    return tasks.map((tasks)=>tasks.id)
  },[tasks])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          className="
          border-2
          border-rose-500
          opacity-40
      bg-columnBackgroundColor
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      
      "
        ></div>
      </>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    
    "
      >
        {/* Column title */}
        <div
          {...attributes}
          {...listeners}
          onClick={() => seteditMode(true)}
          className="flex  justify-between items-center bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4"
        >
          <div className="flex gap-2">
            <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
              0
            </div>
            {!editMode && column.title}
            {editMode && (
              <input
                className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                autoFocus
                onBlur={() => {
                  seteditMode(false);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  seteditMode(false);
                }}
                value={column.title}
                onChange={(e) => {
                  updatecolumn(column.id, e.target.value);
                }}
              />
            )}
          </div>
          <div>
            <button
              className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
              onClick={() => deleteColumn(column.id)}
            >
              <Trashicon />
            </button>
          </div>
        </div>
        {/* column task conatiner */}
        <div className="flex flex-grow flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksids}>
          {tasks.map((task) => (
            <Taskscard
              task={task}
              key={task.id}
              deletetask={deletetask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
        </div>
        {/* column footer */}
        <div className="flex items-center justify-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black">
          <button
            className="flex gap-2 flex-grow"
            onClick={() => {
              createTask(column.id);
            }}
          >
            <Plusicons />
            Add Task
          </button>
        </div>
      </div>
    </>
  );
};

export default ColumnContainer;
