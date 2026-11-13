
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  BrainCircuit,
  FileText,
  Settings,
  GraduationCap,
  Library,
  Upload,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", path: "/courses", icon: GraduationCap },
  { name: "Course Catalog", path: "/course-catalog", icon: Library },
  { name: "Resources", path: "/resources", icon: FileText },
  {
    name: "Faculty Resources",
    path: "/faculty-resources",
    icon: Upload,
  },
  { name: "AI Assistant", path: "/ai-assistant", icon: BrainCircuit },
  { name: "Marketplace", path: "/marketplace", icon: ShoppingBag },
  { name: "Study Library", path: "/study-library", icon: BookOpen },
];

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-900 p-5">

      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-xl bg-violet-600 p-2">
          <GraduationCap size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">CampusBook</h1>
          <p className="text-xs text-slate-400">Learning Platform</p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Workspace
      </p>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            isActive
              ? "bg-violet-600 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <Settings size={19} />
        Settings
      </NavLink>

    </aside>
  );
}

export default Sidebar;
