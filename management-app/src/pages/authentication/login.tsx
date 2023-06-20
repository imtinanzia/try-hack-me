import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { Login as LoginComponent } from '../../components/authentication';

const Login: FC = () => {
  return (
    <>
      <Helmet>
        <title>Login | Management App</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ py: '80px' }}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    Log in
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <LoginComponent />
              </Box>
              <Divider sx={{ my: 3 }} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
