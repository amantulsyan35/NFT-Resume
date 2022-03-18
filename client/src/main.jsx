import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import { ResumeProvider } from './context/ResumeNFTContext';

ReactDOM.render(
  <ResumeProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ResumeProvider>,
  document.getElementById('root')
);
