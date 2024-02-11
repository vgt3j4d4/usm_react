import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import NoteProvider from './context/NoteContext';
import StoriesProvider from './context/StoriesContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <NoteProvider>
        <StoriesProvider>
          <App />
        </StoriesProvider>
      </NoteProvider>
    </BrowserRouter>
  </StrictMode>
);
