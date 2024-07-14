import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material'; // Import MUI components if needed

import img1 from '../assets/Gallery_Images/Trek/trek_1.jpg';
import img2 from '../assets/Gallery_Images/Trek/trek_2.jpg';
import img3 from '../assets/Gallery_Images/Trek/trek_3.jpg';
import img4 from '../assets/Gallery_Images/Trek/trek_4.jpg';
import img5 from '../assets/Gallery_Images/Trek/trek_5.jpg';

const items = [
    { imgSrc: img1 },
    { imgSrc: img2 },
    { imgSrc: img3 },
    { imgSrc: img4 },
    { imgSrc: img5 }
];

function ImageCarousel() {
    return (
        <Carousel>
            {items.map((item, index) => (
                <Item key={index} item={item} />
            ))}
        </Carousel>
    );
}

function Item({ item }) {
    return (
        <Paper>
            <img 
                src={item.imgSrc} 
                alt="gallery" 
                style={{ 
                    width: '1200px', // Set a fixed width
                    height: '400px', // Set a fixed height
                    objectFit: 'cover' // Adjust how the image should be resized to fit the container
                }} 
            />
        </Paper>
    );
}

export default ImageCarousel;
