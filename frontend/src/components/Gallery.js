import React, {useState} from 'react'
import trek_img_1 from '../assets/Gallery_Images/Trek/trek_1.jpg'
import trek_img_2 from '../assets/Gallery_Images/Trek/trek_2.jpg'
import trek_img_3 from '../assets/Gallery_Images/Trek/trek_3.jpg'
import trek_img_4 from '../assets/Gallery_Images/Trek/trek_4.jpg'
import trek_img_5 from '../assets/Gallery_Images/Trek/trek_5.jpg'
import trek_vid_1 from '../assets/Gallery_Images/Trek/trek_vid_1.mp4'
import trek_vid_2 from '../assets/Gallery_Images/Trek/trek_vid_2.mp4'
import '../components/Gallery.css'

//import { Scrollbar } from 'react-scrollbar';
import CloseIcon from '@mui/icons-material/Close';


function Gallery() {
    let data = [
        {
            id:1,
            imgSrc: trek_img_1,
        },
        {
            id:2,
            imgSrc: trek_img_2,
        },
        {
            id:3,
            imgSrc: trek_img_3,
        },
        {
            id:4,
            imgSrc: trek_img_4,
        },
        {
            id:5,
            imgSrc: trek_img_5,
        }
    ]

    const [model, setModel] = useState(false);
    const [tempImgSrc, setTempImgSrc] = useState('');

    const getImg = (imgSrc) => {
        setTempImgSrc(imgSrc);
        setModel(true);
    }

 return (

     <>
     <div className={model? "model open" : "model"}>
        <img src={tempImgSrc} />
        <CloseIcon onClick={() => setModel(false)} />
     </div>
        <div className="gallery">
            {
                data.map((item, index) => {
                    return(
                        <div className="pics" key={index} onClick= {() => getImg(item.imgSrc)}>
                            <img src={item.imgSrc} style={{width: '100%'}} />
                        </div>
                    )
                })
            }
        </div>
    </>
 )
}

export default Gallery