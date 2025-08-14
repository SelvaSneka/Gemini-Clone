import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/Context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ContextProvider should wrap your entire App to provide context to all its children */}
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
);
