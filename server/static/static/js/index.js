import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from "./contexts/ThemeContext";
import ClientThemeWrapper from "./contexts/ClientThemeWrapper";
import Navbar from "./components/Navbar";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ClientThemeWrapper>
        <Navbar />
        <br></br>
        <App />
      </ClientThemeWrapper>
    </ThemeProvider>
  </React.StrictMode>
);