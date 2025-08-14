import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';

const App = () => {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); 
  
  const handleSend = async () => {
    try {
      
      const res = await fetch('http://localhost:3000/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const newEntry = {
        question: input,
        answer: data.reply,
      };

      
      setPreviousQuestions([newEntry, ...previousQuestions]);
      setReply(data.reply); 
      setInput(''); 
      setSelectedIndex(null);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setReply('Error fetching Gemini response');
    }
  };
  
  const handleSelect = (index) => {
    setSelectedIndex(index); 
    setReply(previousQuestions[index].answer); 
    setInput(''); 
  };

  const startNewChat = () => {
    setInput(''); 
    setReply(''); 
    setSelectedIndex(null);
  };

  
  const currentChatContent = selectedIndex !== null 
    ? previousQuestions[selectedIndex].answer 
    : reply;

  return (
    <>
      {}
      <Sidebar
        previousQuestions={previousQuestions}
        onSelect={handleSelect}
        startNewChat={startNewChat}
      />
      {}
      <Main
        input={input}
        setInput={setInput}
        reply={currentChatContent}
        handleSend={handleSend}
      />
    </>
  );
};

export default App;