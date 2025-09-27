import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RecipientsProvider } from './context/RecipientsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecipientsProvider>
      <App />
    </RecipientsProvider>
  </React.StrictMode>
);
