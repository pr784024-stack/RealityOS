import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Play, Square, AlertTriangle, Brain, Clock, Activity } from 'lucide-react';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Timer state
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get('/api/habits/get');
      setHabits(res.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimer = () => {
    setIsTracking(true);
    setStartTime(Date.now() - elapsedTime);
  };

  const handleStopTimer = async () => {
    setIsTracking(false);
    const studyHoursCalculated = Number((elapsedTime / (1000 * 60 * 60)).toFixed(2));
    
    if (studyHoursCalculated > 0.01) { // Only save if more than ~36 seconds
      try {
        await axios.post('/api/habits/add', {
          studyHours: studyHoursCalculated,
          sleepHours: 0, // Assuming 0 for auto-track, user can edit later
          distractionTime: 0,
          mood: 'Good'
        });
        fetchHabits(); // Refresh graph
        setElapsedTime(0); // Reset timer after saving
      } catch (error) {
        console.error('Error saving auto-tracked habit:', error);
      }
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Process data for charts
  const chartData = habits.slice(0, 7).reverse().map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
    Study: h.studyHours,
    Distraction: h.distractionTime
  }));

  // Calculate today's stats
  const todayHabit = habits.length > 0 ? habits[0] : null;
  const todayStudy = todayHabit ? todayHabit.studyHours : 0;
  const todaySleep = todayHabit ? todayHabit.sleepHours : 0;
  const productivityScore = todayHabit 
    ? Math.min(100, Math.round((todayHabit.studyHours / (todayHabit.studyHours + todayHabit.distractionTime || 1)) * 100))
    : 0;

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Activity className="animate-spin text-neon-blue" size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Auto Tracking Timer */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 flex items-center space-x-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="text-2xl font-mono text-neon-blue font-bold px-4">
            {formatTime(elapsedTime)}
          </div>
          {!isTracking ? (
            <button 
              onClick={handleStartTimer}
              className="flex items-center space-x-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Play size={18} />
              <span>Start Study</span>
            </button>
          ) : (
            <button 
              onClick={handleStopTimer}
              className="flex items-center space-x-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors font-medium animate-pulse"
            >
              <Square size={18} fill="currentColor" />
              <span>Stop & Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {todayStudy < 2 && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-xl flex items-start space-x-3 backdrop-blur-sm">
          <AlertTriangle className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">You are going off track</h4>
            <p className="text-sm opacity-80">You have studied less than 2 hours today. Let's start the timer and get focused!</p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-neon-blue/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-blue/10 rounded-full blur-xl group-hover:bg-neon-blue/20 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 font-medium">Today's Study</p>
              <h3 className="text-4xl font-black mt-2">{todayStudy}<span className="text-xl text-gray-500 font-medium ml-1">hrs</span></h3>
            </div>
            <div className="p-3 bg-neon-blue/10 rounded-xl text-neon-blue">
              <Brain size={24} />
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-neon-purple/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl group-hover:bg-neon-purple/20 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 font-medium">Sleep Time</p>
              <h3 className="text-4xl font-black mt-2">{todaySleep}<span className="text-xl text-gray-500 font-medium ml-1">hrs</span></h3>
            </div>
            <div className="p-3 bg-neon-purple/10 rounded-xl text-neon-purple">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 font-medium">Productivity Score</p>
              <h3 className="text-4xl font-black mt-2">{productivityScore}<span className="text-xl text-gray-500 font-medium ml-1">%</span></h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-dark-card border border-gray-800 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">Study vs Distraction (Last 7 Entries)</h3>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16171d', borderColor: '#2e303a', borderRadius: '0.5rem' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Study" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: '#00f0ff', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Distraction" stroke="#ff3b3b" strokeWidth={3} dot={{ r: 4, fill: '#ff3b3b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No data available yet. Start tracking to see your progress!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
