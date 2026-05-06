import { useAuth } from '../context/AuthContext';
import { UserCircle, Mail, Phone, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-dark-card border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20" />
        
        <div className="relative z-10 flex flex-col items-center mt-12 mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-1 shadow-[0_0_30px_rgba(181,0,255,0.3)]">
            <div className="w-full h-full bg-dark-bg rounded-full flex items-center justify-center">
              <UserCircle size={80} className="text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">{user?.name || 'User'}</h1>
          <p className="text-neon-blue font-medium mt-1">RealityOS Member</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email Address</p>
              <p className="text-white">{user?.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Mobile Number</p>
              <p className="text-white">{user?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Joined On</p>
              <p className="text-white">Today</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl px-4 py-3 transition-colors">
            Update Profile
          </button>
          <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl px-4 py-3 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
