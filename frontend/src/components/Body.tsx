// src/components/Body.tsx
import React from "react";
import { Home } from "lucide-react";
import Calendar from "./Calendar";

type BodyProps = {
  activeSection: string;
};

const Body: React.FC<BodyProps> = ({ activeSection }) => {
  return (
    <div className="text-xl font-semibold">
      {activeSection === "Dashboard" && (
        <p>
          <Home></Home> Dashboard Content
        </p>
      )}
      {activeSection === "Calendar" && <Calendar />}
      {activeSection === "Settings" && <p>⚙️ Settings Content</p>}
      {!["Dashboard", "Calendar", "Settings"].includes(activeSection) && (
        <p>no contetnt on {activeSection}</p>
      )}
    </div>
  );
};

export default Body;
