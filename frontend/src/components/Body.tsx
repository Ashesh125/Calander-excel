import React from "react";
import Calendar from "./Calendar";
import ListComponent from "./ListComponent";

type BodyProps = {
  activeSection: string;
};

const Body: React.FC<BodyProps> = ({ activeSection }) => {

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const isYearMonth =
      pathParts.length === 2 &&
      /^\d{4}$/.test(pathParts[0]) &&
      /^\d{1,2}$/.test(pathParts[1]);

  const sectionToRender = isYearMonth ? "Calendar" : activeSection;

  return (
    <div className="text-xl font-semibold">
      {sectionToRender === "Dashboard" && (
        <ListComponent></ListComponent>
      )}
      {sectionToRender === "Calendar" && <Calendar />}
      {sectionToRender === "Settings" && <p>⚙️ Settings Content</p>}
      {!["Dashboard", "Calendar", "Settings"].includes(sectionToRender) && (
        <p>no contetnt on {sectionToRender}</p>
      )}
    </div>
  );
};

export default Body;
