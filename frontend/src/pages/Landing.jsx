import { Link } from 'react-router-dom';
import { Activity, BrainCircuit, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col items-center">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-purple/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-blue/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-black tracking-tighter">
          <span className="text-white">Reality</span>
          <span className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">OS</span>
        </h1>
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2 rounded-full font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/signup" className="px-6 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10 mt-20">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-neon-blue mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          <span>AI-Powered Study Tracker</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Master your habits with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue animate-gradient-x">
            Intelligent Tracking
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
          RealityOS helps you track study hours, analyze distractions with AI, and compete with friends. Build a system that actually works.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/signup" className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all transform hover:scale-105">
            Start Free Trial
          </Link>
          <button className="px-8 py-4 rounded-full font-bold text-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            Try Demo
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          <div className="p-8 rounded-2xl bg-dark-card border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Activity className="text-neon-blue mb-6 w-12 h-12" />
            <h3 className="text-2xl font-bold mb-4">Auto Tracking</h3>
            <p className="text-gray-400">Smart timers that automatically log your deep work sessions and calculate productivity scores.</p>
          </div>
          <div className="p-8 rounded-2xl bg-dark-card border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <BrainCircuit className="text-neon-purple mb-6 w-12 h-12" />
            <h3 className="text-2xl font-bold mb-4">AI Prediction</h3>
            <p className="text-gray-400">Ask the built-in AI about your habits, risk factors, and how to optimize your sleep schedule.</p>
          </div>
          <div className="p-8 rounded-2xl bg-dark-card border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Users className="text-white mb-6 w-12 h-12" />
            <h3 className="text-2xl font-bold mb-4">Social Leaderboard</h3>
            <p className="text-gray-400">Add friends, compare your weekly study hours, and stay motivated through healthy competition.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
