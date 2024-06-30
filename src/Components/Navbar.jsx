import React, { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import { useNavigate, Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Context } from "../index";
import axios from 'axios';
import toast from "react-hot-toast";
import { BASE_URL, headers } from "../Constants";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading, user, setUser, setUserRole } = useContext(Context);
  const history = useNavigate();
  const [servicesMenuAnchor, setServicesMenuAnchor] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [titles, setTitles] = useState([]);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleServicesMenuOpen = (event) => {
    setServicesMenuAnchor(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    setServicesMenuAnchor(null);
  };

  const navigateTo = (path) => {
    history(path);
    handleServicesMenuClose();
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/logout`, { headers, withCredentials: true });
      toast.success(data.message);
      setIsAuthenticated(false);
      setLoading(false);
      setUser({});
      setUserRole("PUBLIC");
      history('/login');
    } catch (error) {
      console.error(error.response.data.message);
      setIsAuthenticated(true);
      if (user.role === "admin") {
        setUserRole("ADMIN");
      } else {
        setUserRole("USER");
      }
      setLoading(false);
    }
  }

  const fetchTitlesFromDatabase = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/allServices`);
      setTitles(data.allServices);
    } catch (error) {
      console.log(error);
    }
  }

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  useEffect(() => {
    fetchTitlesFromDatabase();
  }, [])

  return (
    <>
      <AppBar position="sticky" sx={{ top: 0, backgroundColor: "black", zIndex: 1000 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant={matches ? "subtitle2" : "h6"} style={{ fontWeight: 'Poppins' }}>
            HelperHub
          </Typography>
          <Hidden smDown implementation="css">
            {isAuthenticated && user && user.role === 'admin' && (
              <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={() => history("/Admin")}>
                Admin
              </Button>
            )}
            <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={() => history("/Home")}>
              Home
            </Button>
            <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={handleServicesMenuOpen}>
              Services
            </Button>
            <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={() => history("/About")}>
              About Us
            </Button>
            <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={() => history("/Contact")}>
              Contact Us
            </Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={() => history("/Profile")}>
                  My Profile
                </Button>
                <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }} onClick={handleLogout} disabled={loading}>
                  Log Out
                </Button>
              </>
            ) : (
              <Link to="/login" style={{ color: 'white' }}>
                <Button color="inherit" sx={{ fontSize: matches ? '0.7rem' : '1rem', fontWeight: 'Poppins', mx: matches ? 0 : 1, px: matches ? "5px" : 1 }}>
                  Log In
                </Button>
              </Link>
            )}
          </Hidden>
          <Hidden smUp implementation="css">
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={servicesMenuAnchor}
        open={Boolean(servicesMenuAnchor)}
        onClose={handleServicesMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'black',
            color: 'white',
          },
        }}
      >
        <MenuItem onClick={() => navigateTo("/Services/All services")}>
          Services(All)
        </MenuItem>
        {titles && titles.length !== 0 && titles.map((item) => (
          <MenuItem key={item._id} sx={{ fontWeight: 'Poppins' }} onClick={() => navigateTo(`/Service/${item.title}`)}>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
      <Drawer anchor="left" 
      open={isDrawerOpen} 
      onClose={toggleDrawer}
      >
        <List>
          {isAuthenticated && user && user.role === 'admin' && (
            <ListItem button onClick={() => history("/Admin")}>
              <ListItemText primary="Admin" />
            </ListItem>
          )}
          <ListItem button onClick={() => history("/Home")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleServicesMenuOpen}>
            <ListItemText primary="Services" />
          </ListItem>
          <ListItem button onClick={() => history("/About")}>
            <ListItemText primary="About Us" />
          </ListItem>
          <ListItem button onClick={() => history("/Contact")}>
            <ListItemText primary="Contact Us" />
          </ListItem>
          {isAuthenticated ? (
            <>
              <ListItem button onClick={() => history("/Profile")}>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout} disabled={loading}>
                <ListItemText primary="Log Out" />
              </ListItem>
            </>
          ) : (
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Log In" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
