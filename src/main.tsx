import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { ChatProvider } from './contexts/ChatContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MusicPlayerProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </MusicPlayerProvider>
  </React.StrictMode>,
);
