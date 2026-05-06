import { useState } from 'react';
import axios from 'axios';
import { Save, Loader2 } from 'lucide-react';

const Habits = () => {
  const [formData, setFormData] = useState({
    studyHours: '',
    sleepHours: '',
    distractionTime: '',
    mood: 'Good',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('/api/habits/add', {
        ...formData,
        studyHours: Number(formData.studyHours),
        sleepHours: Number(formData.sleepHours),
        distractionTime: Number(formData.distractionTime),
      });
      setMessage({ type: 'success', text: 'Data saved successfully!' });
      setFormData({ studyHours: '', sleepHours: '', distractionTime: '', mood: 'Good' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-dark-card border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple" />
        
        <h1 className="text-3xl font-bold mb-2">Add Manual Data</h1>
        <p className="text-gray-400 mb-8">Manually log your daily habits and track your progress.</p>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/50' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Study Hours</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="studyHours"
                required
                value={formData.studyHours}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="e.g. 5.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sleep Hours</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="sleepHours"
                required
                value={formData.sleepHours}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                placeholder="e.g. 7"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Distraction Time (Hours)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="distractionTime"
              required
              value={formData.distractionTime}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
              placeholder="e.g. 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mood</label>
            <div className="relative">
              <select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
              >
                <option value="Great">Great 😃</option>
                <option value="Good">Good 🙂</option>
                <option value="Okay">Okay 😐</option>
                <option value="Bad">Bad 😕</option>
                <option value="Terrible">Terrible 😫</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl px-4 py-4 mt-4 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex justify-center items-center group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <Save className="mr-2 group-hover:scale-110 transition-transform" />
                Save Data
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Habits;
