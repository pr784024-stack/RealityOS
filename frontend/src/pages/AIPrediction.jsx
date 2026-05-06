import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const AIPrediction = () => {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/ai/history');
      setHistory(res.data.reverse());
    } catch (error) {
      console.error('Error fetching AI history:', error);
    } finally {
      setFetching(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setQuestion('');
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    setHistory([...history, { _id: tempId, question: userQ, answer: '' }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/predict', { question: userQ });
      setHistory(prev => prev.map(item => item._id === tempId ? res.data : item));
    } catch (error) {
      console.error('AI Error:', error);
      setHistory(prev => prev.map(item => item._id === tempId ? { ...item, answer: 'Sorry, I encountered an error. Please try again.' } : item));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-card border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent pointer-events-none" />
      
      <div className="p-6 border-b border-gray-800 flex items-center space-x-3 bg-gray-900/50 backdrop-blur-md relative z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(181,0,255,0.4)]">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Reality AI</h2>
          <p className="text-sm text-gray-400 font-medium">Ask me about your habits, sleep schedule, or productivity tips</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {fetching ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-neon-purple w-8 h-8" />
          </div>
        ) : history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <Bot size={64} className="opacity-20" />
            <p className="text-lg">No conversation history. Start chatting below!</p>
          </div>
        ) : (
          history.map((msg) => (
            <div key={msg._id} className="space-y-4">
              {/* User Message */}
              <div className="flex items-start justify-end space-x-3">
                <div className="bg-neon-blue/10 border border-neon-blue/30 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%]">
                  {msg.question}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <User size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-800/80 border border-gray-700 text-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 max-w-[80%] whitespace-pre-wrap leading-relaxed">
                  {msg.answer || (
                    <div className="flex space-x-1 items-center h-6">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800 relative z-10">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 bg-dark-bg border border-gray-800 focus-within:border-neon-purple rounded-2xl overflow-hidden transition-colors">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g., How can I improve my focus?"
              className="w-full bg-transparent p-4 text-white resize-none focus:outline-none max-h-32"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="p-4 bg-gradient-to-r from-neon-purple to-neon-blue rounded-2xl text-white hover:shadow-[0_0_15px_rgba(181,0,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} className={loading ? "animate-pulse" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPrediction;
