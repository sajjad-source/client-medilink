import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import {
  useLazyGetPractitionerOnLoginQuery,
  useLazyGetReceptionistOnLoginQuery
} from '../../services/api';

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [triggerPractitioner] = useLazyGetPractitionerOnLoginQuery();
  const [triggerReceptionist] = useLazyGetReceptionistOnLoginQuery();

  // called when login button clicked
  const handleLoginAttempt = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    if (username === '' || password === '') {
      alert('Please enter a username and password');
      return;
    }

    triggerPractitioner({
      username: username.toString(),
      password: password.toString()
    })
      .unwrap()
      .then((result) => {
        navigate('/home', { state: { practitioner: result } });
      })
      .catch((err) => {
        console.error(err);
        triggerReceptionist({
          username: username.toString(),
          password: password.toString()
        })
          .unwrap()
          .then((result) => {
            navigate('/receptionist-home', { state: { receptionist: result } });
          })
          .catch((err) => {
            console.error(err);
            alert('Invalid login or login server error');
          });
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLoginAttempt}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              defaultValue="demo1"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              defaultValue="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              id="signInButton"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
