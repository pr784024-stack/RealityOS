import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { UserPlus, Check, X, Trophy, Loader2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Social = () => {
  const { user } = useAuth();
  const [friendEmail, setFriendEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      const [listRes, boardRes] = await Promise.all([
        axios.get('/api/social/list'),
        axios.get('/api/social/leaderboard')
      ]);
      setFriends(listRes.data.friends);
      setPendingRequests(listRes.data.pendingRequests);
      setLeaderboard(boardRes.data);
    } catch (error) {
      console.error('Error fetching social data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setAdding(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.post('/api/social/add-friend', { friendEmail });
      setMessage({ type: 'success', text: 'Friend request sent!' });
      setFriendEmail('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send request' });
    } finally {
      setAdding(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post('/api/social/accept', { requestId });
      fetchSocialData();
    } catch (error) {
      console.error('Error accepting request', error);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-neon-blue" size={40} /></div>;
  }

  // Prep chart data
  const chartData = leaderboard.map(l => ({
    name: l.userId === user._id ? 'You' : l.name.split(' ')[0],
    Hours: l.totalStudyHours,
    isYou: l.userId === user._id
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-neon-blue/10 rounded-xl text-neon-blue">
          <Users size={28} />
        </div>
        <h1 className="text-3xl font-bold">Social & Leaderboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Add Friend & Requests */}
        <div className="space-y-6 lg:col-span-1">
          {/* Add Friend */}
          <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-neon-blue/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-transparent" />
            <h3 className="text-xl font-bold mb-4">Add Friend</h3>
            
            {message.text && (
              <div className={`p-3 rounded-xl mb-4 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleAddFriend} className="space-y-4">
              <input
                type="email"
                required
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="Friend's email address"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={adding || !friendEmail}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl px-4 py-3 transition-colors flex justify-center items-center group-hover:border-neon-blue/50"
              >
                {adding ? <Loader2 className="animate-spin w-5 h-5" /> : <><UserPlus size={18} className="mr-2 text-neon-blue" /> Send Request</>}
              </button>
            </form>
          </div>

          {/* Pending Requests */}
          <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req._id} className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <div>
                      <p className="font-medium">{req.userId.name}</p>
                      <p className="text-xs text-gray-500">{req.userId.email}</p>
                    </div>
                    <button
                      onClick={() => handleAcceptRequest(req._id)}
                      className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                      title="Accept"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Leaderboard & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comparison Chart */}
          <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl shadow-xl h-80">
            <h3 className="text-xl font-bold mb-6">Study Hours Comparison (Today)</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#1f2028' }}
                    contentStyle={{ backgroundColor: '#16171d', borderColor: '#2e303a', borderRadius: '0.5rem' }}
                  />
                  <Bar dataKey="Hours" radius={[4, 4, 0, 0]}>
                    {
                      chartData.map((entry, index) => (
                        <cell key={`cell-${index}`} fill={entry.isYou ? '#00f0ff' : '#2e303a'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No data to compare
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center space-x-2 mb-6 text-yellow-500">
              <Trophy size={20} />
              <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-sm">
                    <th className="pb-3 font-medium w-16">Rank</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium text-right">Study Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-500 text-sm">
                        No friends added yet. Start inviting!
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((userStats) => (
                      <tr 
                        key={userStats.userId} 
                        className={`border-b border-gray-800/50 hover:bg-white/5 transition-colors ${userStats.userId === user._id ? 'bg-neon-blue/5' : ''}`}
                      >
                        <td className="py-4">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            userStats.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                            userStats.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                            userStats.rank === 3 ? 'bg-amber-700/20 text-amber-600' : 'text-gray-500'
                          }`}>
                            {userStats.rank}
                          </span>
                        </td>
                        <td className="py-4 font-medium flex items-center space-x-2">
                          <span>{userStats.name}</span>
                          {userStats.userId === user._id && (
                            <span className="text-[10px] uppercase tracking-wider bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full">You</span>
                          )}
                        </td>
                        <td className="py-4 font-mono text-right text-neon-blue font-bold">
                          {userStats.totalStudyHours}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Social;
