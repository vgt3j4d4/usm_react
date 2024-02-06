import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import MapSelectionProvider from './context/MapSelectionContext';
import StoriesProvider from './context/StoriesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <MapSelectionProvider>
        <StoriesProvider>
          <App />
        </StoriesProvider>
      </MapSelectionProvider>
    </BrowserRouter>
  </StrictMode>
);
