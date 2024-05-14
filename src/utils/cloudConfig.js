import {v2 as cloudinary} from 'cloudinary';


cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_keyCloud, 
    api_secret: process.env.api_secretCloud 
  });


  export default cloudinary;
