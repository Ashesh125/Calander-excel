import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Body from "./components/Body";
import TaskSidebar from "./components/Sidebar/TaskSidebar";

const App: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [activeSection, setActiveSection] = useState("Calendar");

    const handleActiveSection = (section: string) => {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const isYearMonth =
            pathParts.length === 2 &&
            /^\d{4}$/.test(pathParts[0]) &&
            /^\d{1,2}$/.test(pathParts[1]);

        if (isYearMonth && section !== 'Calendar') {
            window.history.replaceState(null, '', '/');
        }
        setActiveSection(section);
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed((prev) => !prev)}
                onSelect={(section) => handleActiveSection(section)}
            />
            <main className="flex-1 bg-gray-100 p-6 overflow-auto">
                <Body activeSection={activeSection}/>
            </main>
            {activeSection === "Calendar" && <TaskSidebar />}
        </div>
    );
};

export default App;
