import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RTL, SettingsDrawer, SplashScreen } from './components';
import { useAuth, useScrollReset, useSettings } from './hooks';

import routes from './routes';
import { createCustomTheme } from './theme';

const App: FC = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();

  useScrollReset();

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={settings.direction ?? 'ltr'}>
        <CssBaseline />
        <Toaster position="top-center" />
        <SettingsDrawer />
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  );
};

export default App;
