import { useAuth } from '../../context/AuthContext';
import { User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-dark-card border-b border-gray-800 shadow-sm z-10 relative">
      {/* Decorative neon top line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-neon-blue/20 via-neon-purple/50 to-neon-blue/20" />
      
      <div className="flex items-center">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple hidden md:block">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
          <Bell size={20} className="text-gray-400 hover:text-neon-blue" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-purple rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-2 bg-gray-900/50 rounded-full px-3 py-1.5 border border-gray-800 hover:border-neon-blue/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-200 hidden sm:block">
            {user?.name || 'Profile'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
