import React from "react";
import {
  Home,
  Settings,
  Calendar,
  FoldHorizontal,
  UnfoldHorizontal,
} from "lucide-react";
type SidebarProps = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onSelect: (section: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  onSelect,
}) => {
  const items = [
    { icon: <Home className="w-6 h-6 text-gray-600" />, label: "Dashboard" },
    {
      icon: <Calendar className="w-6 h-6 text-gray-600" />,
      label: "Calendar",
    },
    { icon: <Settings className="w-6 h-6 text-gray-600" />, label: "Settings" },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <button onClick={toggleCollapse} className="text-white">
          {isCollapsed ? (
            <UnfoldHorizontal className="w-6 h-6 text-gray-600" />
          ) : (
            <FoldHorizontal className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>
      <nav className="px-2">
        <ul className=" list-none">
          {items.map((item) => (
            <li
              key={item.label}
              className="py-2 px-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => onSelect(item.label)}
            >
              {isCollapsed ? (
                <span className="text-xl text-center block">{item.icon}</span>
              ) : (
                <span className="flex gap-3">
                  {item.icon} {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
