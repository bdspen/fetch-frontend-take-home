import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './App';
import { BrowserRouter } from 'react-router-dom';
import { App, ConfigProvider } from 'antd';
import './index.css';
import { fetchTheme } from './styles/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConfigProvider theme={fetchTheme}>
      <App>
        <BrowserRouter>
          <RootApp />
        </BrowserRouter>
      </App>
    </ConfigProvider>
  </React.StrictMode>
);
