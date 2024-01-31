import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import SelectionProvider from './context/SelectionContext';
import StoriesProvider from './context/StoriesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <SelectionProvider>
        <StoriesProvider>
          <App />
        </StoriesProvider>
      </SelectionProvider>
    </BrowserRouter>
  </StrictMode>
);
