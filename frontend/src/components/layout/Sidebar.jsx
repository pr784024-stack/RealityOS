import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ListPlus, 
  BrainCircuit, 
  Users, 
  UserCircle, 
  LogOut 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Habits', path: '/habits', icon: ListPlus },
    { name: 'AI Prediction', path: '/ai', icon: BrainCircuit },
    { name: 'Social', path: '/social', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-dark-card border-r border-gray-800 flex flex-col h-full shadow-xl relative overflow-hidden">
      {/* Decorative side glow */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent" />
      
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-2xl font-black tracking-tighter">
          <span className="text-white">Reality</span>
          <span className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">OS</span>
        </h1>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              twMerge(
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group',
                  isActive
                    ? 'bg-gradient-to-r from-neon-blue/10 to-transparent text-neon-blue border-l-2 border-neon-blue shadow-[inset_0px_0px_20px_rgba(0,240,255,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )
              )
            }
          >
            <item.icon 
              size={20} 
              className={clsx(
                "transition-transform duration-300 group-hover:scale-110",
                "drop-shadow-[0_0_5px_currentColor]"
              )} 
            />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors group"
        >
          <LogOut size={20} className="group-hover:animate-pulse" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
