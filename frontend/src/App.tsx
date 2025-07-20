// src/App.tsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Body from "./components/Body";
import TaskSidebar from "./components/Sidebar/TaskSidebar";

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState("Calendar");

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed((prev) => !prev)}
        onSelect={(section) => setActiveSection(section)}
      />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Body activeSection={activeSection} />
      </main>
      {activeSection === "Calendar" && <TaskSidebar />}
    </div>
  );
};

export default App;
