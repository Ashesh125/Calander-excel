import React, {useContext, useEffect} from "react";
import {Draggable} from "@fullcalendar/interaction";
import {TaskContext} from "../../context/TaskContext";
import TaskItem from "./TaskItem";
import {Download} from "lucide-react";

interface GroupedTasks {
    [date: string]: {
        id: number;
        title: string;
        date: string;
    }[];
}

const TaskSidebar: React.FC = () => {
    const {tasks, setTasks} = useContext(TaskContext);
    const containerEl = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerEl.current) {
            new Draggable(containerEl.current, {
                itemSelector: ".task-item",
                eventData: function (eventEl: HTMLElement) {
                    return {
                        title: eventEl.getAttribute("data-title"),
                        id: eventEl.getAttribute("data-id"),
                    };
                },
            });
        }
    }, []);

    const handleSave = (id: number, newTitle: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? {...task, title: newTitle} : task
            )
        );
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setTasks(tasks.filter((task) => task.id !== id));
        }
    };

    const handleExportXLSX = async () => {
        try {
            const response = await fetch('/api/export-tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tasks}),
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tasks-export.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export tasks. Please try again.');
        }
    };

    const groupedTasks = tasks
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .reduce((acc, task) => {
            const date = new Date(task.date).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(task);
            return acc;
        }, {} as GroupedTasks);

    return (
        <aside className="bg-gray-100 text-gray-800 w-64 p-4 border-r border-gray-200">
            <div className="sticky top-0 bg-gray-100 pb-4 z-10">
                <h2 className="text-lg font-semibold">Tasks</h2>
            </div>
            <div
                ref={containerEl}
                className="space-y-4 max-h-[calc(100vh-120px)]"
            >
                {Object.entries(groupedTasks).map(([date, tasks]) => (
                    <div key={date} className="space-y-2">
                        <h3 className="font-medium text-sm text-gray-600 sticky top-12 bg-gray-100 py-1">
                            {date}
                        </h3>
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onSave={handleSave}
                                    onDelete={handleDelete}
                                    data-title={task.title}
                                    data-id={task.id.toString()}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {
                tasks.length > 0 ? (<div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={handleExportXLSX}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download className="w-5 h-5"/>
                        Download XLSX
                    </button>
                </div>) : ''
            }
        </aside>
    );
};

export default TaskSidebar;
