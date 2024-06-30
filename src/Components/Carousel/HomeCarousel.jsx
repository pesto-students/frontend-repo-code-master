import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import Loader from '../Loader';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const HomeCarousel = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCarouselData = async () => {
    try {
      const { data } = await axios.get('/HomeCoverPage/CarouselData.json');
      setCarouselData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const theme = useTheme();
  //const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme.breakpoints.between('xs','sm'));


  if (loading) return <Loader />;
  
  return (
    <Carousel
      autoPlay
      infiniteLoop={true}
      showStatus={false}
      showThumbs={false}
      interval={3000}
      transitionTime={500}
      stopOnLastSlide={true}
    >
      {carouselData.map((item, index) => (
        <div key={index} style={{ height: isExtraSmall ? '40vh' : (isSmall?'60vh':'80vh') }}>
          <img
            src={`/HomeCoverPage/CarouselImages/Image${index + 1}/${item.imgNo}.jpg`}
            alt={item.heading}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className='legend'>
            <h3>{item.heading}</h3>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;
