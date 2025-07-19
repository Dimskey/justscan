import React, { useState } from 'react';
import Layout from '../components/Layout';
import { aiAPI, apiUtils } from '../services/api';

const Assistant = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message;
      setChatHistory([...chatHistory, { type: 'user', content: userMessage }]);
      setMessage('');
      setIsLoading(true);
      
      try {
        console.log('Sending message to AI:', userMessage);
        console.log('API Base URL:', import.meta.env.VITE_API_URL);
        const res = await aiAPI.analyzeWithReplicate(userMessage);
        console.log('AI Response:', res);
        
        const data = res.data;
        console.log('AI response data:', data);
        
        const aiResponse = data.result || data.output || 'No response from AI.';
        setChatHistory(history => [
          ...history,
          { type: 'ai', content: aiResponse }
        ]);
      } catch (err) {
        console.error('Error in AI chat:', err);
        const errorMessage = apiUtils.handleError(err).message;
        setChatHistory(history => [
          ...history,
          { type: 'ai', content: `Error: ${errorMessage}` }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">AI Assistant</p>
      </div>
      
      {/* Chat History */}
      <div className="flex-1 px-4 py-3 space-y-4 max-h-96 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
              chat.type === 'user' 
                ? 'bg-[#0b79ee] text-white' 
                : 'bg-[#283039] text-white'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg bg-[#283039] text-white">
              <p className="text-sm">AI sedang berpikir...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Type your message..."
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
          />
        </label>
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 text-white text-sm font-bold leading-normal tracking-[0.015em] ${
            isLoading || !message.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#0b79ee]'
          }`}
        >
          <span className="truncate">{isLoading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>
    </Layout>
  );
};

export default Assistant; 