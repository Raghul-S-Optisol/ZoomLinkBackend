const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ZOOM_API_KEY, ZOOM_API_SECRET } = process.env;


router.post('/create/meeting', async (req, res) => {
  const startDateTime = new Date('2023-05-31T14:00:00+05:30').toISOString();
    try {
      const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
        topic: 'My Meeting',
        type: 2, // Scheduled meeting
        start_time: startDateTime,
        duration: 60, // Meeting duration in minutes
      }, {
        headers: {
          'Authorization': `Bearer ${generateZoomAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });   
  
      const { join_url } = response.data;
      res.json({ join_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create meeting' });
    }
  }); 
  
  function generateZoomAccessToken() {
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // Expiration time set to 1 hour (60 minutes)
  
    const payload = {
      iss: ZOOM_API_KEY,
      exp: expirationTime,
    };
  
    const token = jwt.sign(payload, ZOOM_API_SECRET);//generate a JSON Web Token(JWT) by signing a payload object with a secret or private key
    return token;
  }


  // router.post('/create/meeting/host', async (req, res) => {
  //   const{hostEmail,coHostEmail} = req.body;
  //   const startDateTime = new Date('2023-05-31T14:00:00+05:30').toISOString();
  //   console.log(hostEmail, 'and', coHostEmail);

  //   try { 
  //     const response = await axios.post(`https://api.zoom.us/v2/users/${hostEmail}/meetings`,{
  //       topic: 'Host Meeting',
  //       type: 2, 
  //       start_time: startDateTime,
  //       duration: 60, // Meeting duration in minutes
  //       settings: {
  //         host_video: true,
  //         participant_video: true,
  //         // alternative_hosts: coHostEmail, 
  //         co_host:coHostEmail,
  //       },
  //     }, {
  //       headers: {
  //         'Authorization': `Bearer ${generateZoomAccessToken(hostEmail)}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     const { join_url } = response.data;
  //     res.json({ join_url });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Failed to create meeting' });
  //   }
   
  // });

  // function generateZoomAccessToken(email) {
  //   const payload = {
  //     iss: ZOOM_API_KEY,
  //     exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time set to 1 hour (60 minutes)
  //     user: {
  //       email
  //     },
  //   };
  //   const token = jwt.sign(payload, ZOOM_API_SECRET);
  //   return token;
  // }
 
  router.post('/create/meeting/host', async (req, res) => {
    const hostEmail =req.body.hostEmail;
    const coHostEmail = req.body.coHostEmail;
    console.log(hostEmail, 'and', coHostEmail);
    const startDateTime = new Date('2023-05-31T14:00:00+05:30').toISOString();
      try {
        const response = await axios.post(`https://api.zoom.us/v2/users/me/meetings`, {
          topic: 'My Meeting',
          type: 2, // Scheduled meeting
          start_time: startDateTime,
          duration: 60, // Meeting duration in minutes
          settings: {
                    host_video: true,
                    participant_video: true,
                    // alternative_hosts: coHostEmail, 
                    co_host:coHostEmail,
                  },
        }, {
          headers: {
            'Authorization': `Bearer ${generateZoomAccessToken(hostEmail)}`,
            'Content-Type': 'application/json',
          },
        });   
    
        const { join_url } = response.data;
        res.json({ join_url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create meeting' });
      }
    }); 

  function generateZoomAccessToken(email) {
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // Expiration time set to 1 hour (60 minutes)
  
    const payload = {
      iss: ZOOM_API_KEY,
      exp: expirationTime,
      user:{email},
    };
  
    const token = jwt.sign(payload, ZOOM_API_SECRET);//generate a JSON Web Token(JWT) by signing a payload object with a secret or private key
    return token;
  }

  
  

  module.exports = router;  
        