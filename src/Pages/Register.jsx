import React, { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  CssBaseline,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Grid,
} from '@mui/material';
import { Context } from '../index';
import toast from 'react-hot-toast';
import { BASE_URL, headers } from '../Constants';

const RegistrationForm = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading, user, setUserRole } = useContext(Context);
  const textStyle = {
    fontWeight: '900',
    color: '#f57c00'
  };

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    dob: '',
    gender: 'Male',
    mobileNumber: '',
  });

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRegistration = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/v1/register`, form, {
        headers,
        withCredentials: true,
      });
      toast.success("You have registered successfully...");
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong! Registration failed. Try again");
      }
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    if (user?.role === "admin") {
      setUserRole("ADMIN");
    } else {
      setUserRole("USER");
    }
    return <Navigate to={"/"} />
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ width: '80%' }}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7EFE5',
          borderRadius: '2px',
          margin: '2rem',
          padding: '2rem',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <img
              src={`/Authentication/Register.jpg`}
              alt="Register Pic"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography component="h1" variant="h5" fontWeight={"bold"} sx={{ marginBottom: 2 }}>
                Registration
              </Typography>
              <form onSubmit={handleRegistration}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  required
                  type="text"
                  variant="outlined"
                  value={form.username}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 1.5 }}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  required
                  variant="outlined"
                  value={form.email}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 1.5 }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  name="password"
                  required
                  variant="outlined"
                  value={form.password}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 1.5 }}
                />
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  defaultValue="Male"
                  sx={{ marginBottom: 1.5 }}
                  value={form.gender}
                  onChange={handleFormChange}
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
                <TextField
                  fullWidth
                  type="date"
                  label="DOB"
                  name="dob"
                  required
                  variant="outlined"
                  value={form.dob}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginBottom: 1.5 }}
                />
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  required
                  variant="outlined"
                  value={form.mobileNumber}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 1.5 }}
                />
                <Button type="submit" disabled={loading} fullWidth variant="contained" color="primary">
                  Register
                </Button>
                <Typography variant="h6" align="center" margin={1}>
                  Already have an account?{' '}
                  <Link to={'/login'} style={textStyle}>
                    LogIn
                  </Link>
                </Typography>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
