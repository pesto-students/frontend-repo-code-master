
import { Button, Card, CardContent, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdditionalDetailsCard from './AdditionalDetailsCard';
import toast from 'react-hot-toast';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Loader from '../Components/Loader';
import { BASE_URL } from '../Constants';

const AdditionalInfo = () => {
  const [title, setTitle] = useState('');
  const [fetchTitles, setFetchTitles] = useState([]); 
  const [formData, setFormData] = useState({ heading: '', subHeading: '', data: [] });
  const [option, setOption] = useState('');
  const [optionsArr, setOptionsArr] = useState([]);
  const [titlesWithSubsections, setTitlesWithSubsections] = useState({});
  const [enteredTitle, setEnteredTitle] = useState('');
  const [loading,setLoading]=useState(true);
  const [getAllAdditionalDetails,setGetAllAdditionalDetails]=useState([]);
  
  const fetchTitlesFromDatabase = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/allServices`);
      setFetchTitles(data.allServices);
    } catch (error) {
      console.error('Error fetching titles:', error.message);
    }
  }

  const handleAddOption = () => {
    setOptionsArr([...optionsArr, option]);
    setOption('');
  }

  const handleAddFormData = () => {
    if (!title) {
      toast.error("Please select a title");
      return;
    }

    const newSubsection = {
      heading: formData.heading,
      subHeading: formData.subHeading,
      data: optionsArr.map(option => ({ label: option }))
    };

    if (Object.values(newSubsection).some(value => value === '')) {
      toast.error("Please fill up all details");
      return;
    }

    const updatedSubsections = [...(titlesWithSubsections[title] || [])];
    const isDuplicate = updatedSubsections.some(subsection =>
      subsection.heading === newSubsection.heading &&
      subsection.subHeading === newSubsection.subHeading &&
      JSON.stringify(subsection.data) === JSON.stringify(newSubsection.data)
    );

    if (!isDuplicate) {
      updatedSubsections.push(newSubsection);
      const updatedTitlesWithSubsections = {
        ...titlesWithSubsections,
        [title]: updatedSubsections
      };
      setTitlesWithSubsections(updatedTitlesWithSubsections);
      toast.success("Details added successfully...");
    } else {
      toast.error("Duplicate subsection, not added.");
    }

    setFormData({ heading: '', subHeading: '', data: [] });
    setOption('');
    setOptionsArr([]);
  }

  const addAdditionalDetails = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/v1/admin/additionalDetails`, {
        title,
        subsections: titlesWithSubsections[title] || []
      },
      { withCredentials: true });
      toast.success(data.message);
      fetchAllAdditionalDetails();
      setEnteredTitle(title); 
    } catch (error) {
      toast.error("Something went wrong! Try again");
      console.log(error.response);
    }
  }

  const fetchAllAdditionalDetails = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/additionalDetails`);
      setGetAllAdditionalDetails(data.allAdditionalInfo);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const handleResetOptions = () => {
    setOptionsArr([]);
  };

  useEffect(() => {
    fetchTitlesFromDatabase();
    fetchAllAdditionalDetails();
  }, [])
  
  if(loading) return <Loader/>;

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid item xs={12} mt={4} mb={2}>
                <Typography variant='h4' textAlign={'center'} mt={1}>Add service with additional details</Typography>
                <Divider/>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <Select
                    labelId="title-label"
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setEnteredTitle(e.target.value);
                    }}
                    label="Title"
                    fullWidth
                    margin="dense"
                    name="title"
                    sx={{mt:'7.5px'}}
                  >
                    {fetchTitles.map((item) => (
                      <MenuItem key={item._id} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Heading"
                    variant="outlined"
                    fullWidth
                    name="heading"
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Subheading"
                    variant="outlined"
                    fullWidth
                    name="subHeading"
                    value={formData.subHeading}
                    onChange={(e) => setFormData({ ...formData, subHeading: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  {optionsArr && optionsArr.length !==0 && 
                  optionsArr.map((opt, index) => (
                    <TextField
                      key={index}
                      label={`Option ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      name={`option-${index}`}
                      value={opt}
                      disabled
                      margin="dense"
                    />
                  ))}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Option"
                    variant="outlined"
                    fullWidth
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddOption}
                    startIcon={<AddCircleOutlineIcon />}
                    title="Add"
                    disabled={!option}
                    style={{ marginTop: '1rem', marginLeft: '1rem' }}
                  >
                    option
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetOptions}
                    style={{ marginTop: '1rem', marginLeft: '1rem' }}
                  >
                    Reset options
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={handleAddFormData}>
                    Add details
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addAdditionalDetails}
                  style={{ marginTop: '1rem' }}
                >
                  Save details
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={4} mb={2}>
        <Typography variant='h4' textAlign={'center'} mb={1}>All services additional details</Typography>
        <Divider/>
      </Grid>
      <Grid container spacing={10} sx={{ justifyContent: 'center', rowGap: '20px', height:'auto' }}>
        {
          getAllAdditionalDetails && getAllAdditionalDetails.length !==0 &&
          getAllAdditionalDetails.map((item)=>(
            <AdditionalDetailsCard key={item._id} details={item}
             fetchAllAdditionalDetails={fetchAllAdditionalDetails}
             enteredTitle={enteredTitle} />
          ))
        }
      </Grid>
    </Container>
  )
}

export default AdditionalInfo;
