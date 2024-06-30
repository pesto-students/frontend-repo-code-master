import React, { useCallback, useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, Card, CardMedia, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Loader from '../../Components/Loader';
import { BASE_URL } from '../../Constants';

function ServicesDescription() {
  const navigate = useNavigate();
  const { title } = useParams();
  const [helperData,setHelperData]=useState({});
  const [loading,setLoading]=useState(true);
  const dispatch=useDispatch();
  const fetchParticularServiceInfo=useCallback(async()=>{
    try {
      const {data}=await axios.post(`${BASE_URL}/api/v1/service/title`,{title});
      setHelperData(data.service)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
  },[title])
  useEffect(()=>{
    fetchParticularServiceInfo();
  },[fetchParticularServiceInfo])
  
  if (loading) return <Loader/>
  const handleBooking=()=>{
    dispatch({type:"addTitleFromMenu",payload:{key:"Title",value:title}})
    navigate('/CitySelection')
  }
  return (
    <Container maxWidth="lg" style={{ marginTop: '1%', marginBottom: '1%' }}>
      <Grid container spacing={10}>
        <Grid item xs={12} md={6} height={'80vh'}>
          <Card sx={{ width: '100%', height: '100%', borderRadius: '15px' }}>
            <CardMedia
              component="img"
              alt="Service Image"
              height="100%"
              width="100%"
              border="10px solid black"
              image={`/ImagesFiles/AllServices/${helperData?.imgName}.jpg`}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" textAlign="center">
            <Typography variant="h4" style={{fontFamily:'Roboto', fontWeight: 'bold' }}>{helperData?.heading}</Typography>
            <Typography variant="h6" style={{fontFamily:'Roboto'}}>{helperData.description}</Typography>
            <Button
              variant="contained"
              sx={{ color: 'white', backgroundColor: 'black', width: '10rem', mt: '1rem' }}
              onClick={handleBooking}
            >
              Book Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ServicesDescription;