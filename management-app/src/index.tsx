import 'react-perfect-scrollbar/dist/css/styles.css';
import 'nprogress/nprogress.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import App from './App';
import { AuthProvider, SettingsProvider } from './context';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <StyledEngineProvider injectFirst>
          <SettingsProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </SettingsProvider>
        </StyledEngineProvider>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>
);
