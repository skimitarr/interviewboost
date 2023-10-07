import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '../../src/app/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// const RESEND_API_KEY = 're_GrzT9RGi_3RM6RM5iRR8BNGz9vUn6SFGx';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // @ts-ignore
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['interview.questions50@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    res.status(200).json(data);
    console.log(data)
  } catch (error) {
    res.status(400).json(error);
  }
};



// const axios = require('axios');
// async function sendEmail(name, email, subject, message) {
//   const data = JSON.stringify({
//     "Messages": [{
//       "From": {"Email": "<YOUR EMAIL>", "Name": "<YOUR NAME>"},
//       "To": [{"Email": email, "Name": name}],
//       "Subject": subject,
//       "TextPart": message
//     }]
//   });

//   const config = {
//     method: 'post',
//     url: 'https://api.mailjet.com/v3.1/send',
//     data: data,
//     headers: {'Content-Type': 'application/json'},
//     auth: {username: '<API Key>', password: '<Secret Key>'},
//   };

//   return axios(config)
//     .then(function (response) {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });

// }

// // define your own email api which points to your server.
// app.post('/api/sendemail/', function (req, res) {
//   const {name, email, subject, message} = req.body;
//   //implement your spam protection or checks.
//   sendEmail(name, email, subject, message);
// });
