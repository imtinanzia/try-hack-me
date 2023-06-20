import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { Register as RegisterComponent } from '../../components/authentication';

const Register: FC = () => {
  return (
    <>
      <Helmet>
        <title>Register | Management App</title>
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
                    Register
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <RegisterComponent />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Link
                color="textSecondary"
                component={RouterLink}
                to="/authentication/login"
                variant="body2"
              >
                Having an account
              </Link>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Register;
