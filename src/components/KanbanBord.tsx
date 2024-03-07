import { useMemo, useState } from "react";
import Plusicons from "../icons/Plusicons";
import { Id, Task, column } from "../Type";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Taskscard from "./Taskscard";
const KanbanBord = () => {
  const [columns, setcolumns] = useState<column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  // console.log(columns);
  const [activeColumn, setactiveColumn] = useState<column | null>(null);
  const [activetask, setactivetask] = useState<Task | null>(null);
  const [tasks, settasks] = useState<Task[]>([]);
  const sensor = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  return (
    <div
      className="m-auto
     flex
     min-h-screen
     items-center
     overflow-x-auto
     overflow-y-hidden
     px-[40px]
     "
    >
      <DndContext
        sensors={sensor}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragover}
      >
        <div className="m-auto flex gap-4 
        
        
        ">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteCloum}
                  updatecolumn={updatecolumn}
                  createTask={createTask}
                  tasks={tasks.filter((tasks) => tasks.columnId == col.id)}
                  deletetask={deletetask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
        h-[60px]
        w-[350px]
        min-w-[350px]
        cursor-pointer
        bg-mainBackgroundColor
        border-2
        border-columnBackgroundColor
        p-4
        ring-rose-500
        hover:ring-2
        flex
        gap-2
        "
          >
            <Plusicons />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteCloum}
                updatecolumn={updatecolumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (tasks) => tasks.columnId == activeColumn.id
                )}
                deletetask={deletetask}
                updateTask={updateTask}
              />
            )}
            {activetask && <Taskscard task={activetask} deletetask={deletetask} updateTask={updateTask}/>}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
  function createNewColumn() {
    const columnToAdd: column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setcolumns([...columns, columnToAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function deleteCloum(id: Id) {
    const filtercolumn = columns.filter((col) => col.id !== id);
    setcolumns(filtercolumn);

    const newtasks = tasks.filter(t=>t.columnId!==id)
    settasks(newtasks)
  }

  function onDragover(event:DragOverEvent){
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId == overId) return;

    const isactiveatask = active.data.current?.type=="Task";

    const isoveratask = over.data.current?.type=="Task";

    if(!isactiveatask)return;
    
    if(isactiveatask && isoveratask){
      settasks((tasks)=>{
        const activeindex = tasks.findIndex((t)=>t.id==activeId)
        const overindex=tasks.findIndex((t)=>t.id==overId)
          tasks[activeindex].columnId = tasks[overindex].columnId
          return arrayMove(tasks,activeindex,overindex)
      })
    }
    const isovercolumn = over.data.current?.type=="column"

    if(isactiveatask && isovercolumn){
      settasks((tasks)=>{
        const activeindex = tasks.findIndex((t)=>t.id==activeId)
        
          tasks[activeindex].columnId = overId
          return arrayMove(tasks,activeindex,activeindex)
      })
    }
  }

  function updatecolumn(id: Id, title: String) {
    const newcolumn = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setcolumns(newcolumn);
  }

  function updateTask(id: Id, content: String) {
    const newtasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    settasks(newtasks);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    settasks([...tasks, newTask]);
  }

  function onDragStart(event: DragStartEvent) {
    // console.log(event);
    if (event.active.data.current?.type === "column") {
      setactiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type == "Task") {
      setactivetask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setactiveColumn(null)
    setactivetask(null)
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId == overColumnId) return;

    setcolumns((columns) => {
      const activeColumnindex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnindex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns, activeColumnindex, overColumnindex);
    });
  }

  function deletetask(id: Id) {
    const newtasks = tasks.filter((task) => task.id !== id);
    settasks(newtasks);
  }
};
export default KanbanBord;
