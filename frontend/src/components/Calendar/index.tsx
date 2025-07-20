import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {useContext, useRef, useCallback} from "react";
import type {DateClickArg, EventDropArg} from "@fullcalendar/core";
import {TaskContext} from "../../context/TaskContext";

const Calendar = () => {
    const {tasks, setTasks} = useContext(TaskContext);
    const calendarRef = useRef<FullCalendar>(null);

    const handleDateClick = useCallback(
        (arg: DateClickArg) => {
            const title = prompt("Enter event title:");
            if (title) {
                setTasks((prevTasks) => [
                    ...prevTasks,
                    {
                        id: Date.now(),
                        title,
                        date: arg.dateStr,
                    },
                ]);
            }
        },
        [setTasks]
    );

    const handleEventDrop = useCallback(
        (arg: EventDropArg) => {
            const {event, oldEvent} = arg;
            const newDate = new Date(event.startStr);
            const oldDate = new Date(oldEvent.startStr);

            if (
                newDate.getMonth() !== oldDate.getMonth() ||
                newDate.getFullYear() !== oldDate.getFullYear()
            ) {
                arg.revert();
                alert("Tasks can only be moved within the current month!");
                return;
            }

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === Number(event.id)
                        ? {...task, date: event.startStr}
                        : task
                )
            );
        },
        [setTasks]
    );


    // @ts-ignore
    return (
        <div className="p-4">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={tasks}
                editable={true}
                droppable={true}
                dateClick={handleDateClick}
                eventDrop={handleEventDrop}
            />
        </div>
    );
};

export default Calendar;
