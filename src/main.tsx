import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ConfigProvider, Modal } from '@easy-shadcn/react';
import { zhCN } from 'date-fns/locale';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider dateLocal={zhCN}>
        <Modal.Provider>
          <App />
        </Modal.Provider>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
