// import { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from 'nodemailer';

// export default async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//     if (req.method === 'POST') {
//         const { message } = req.body;

//         // Настройте отправку сообщений на электронную почту (используя Nodemailer)
//         // const transporter = nodemailer.createTransport({
//         //     service: 'Gmail',
//         //     auth: {
//         //         user: "interview.questions50@gmail.com",
//         //         pass: "Ghgx879CV3",
//         //     },
//         // });

//         // const mailOptions = {
//         //     from: 'Grisha.Lakoza@gmail.com',
//         //     to: "interview.questions50@gmail.com",
//         //     subject: 'Обратная связь',
//         //     text: message,
//         // };

//         // try {
//         //     await transporter.sendMail(mailOptions);
//         //     res.status(200).json({ message: 'Сообщение успешно отправлено' });
//         // } catch (error) {
//         //     console.error(error);
//         //     res.status(500).json({ message: 'Ошибка при отправке сообщения' });
//         // }

//         let transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           port: 465,
//           secure: true,
//           auth: {
//             type: "OAuth2",
//             clientId: '1013820621503-9homr11kostin1stcfshsld0ouh20dbl.apps.googleusercontent.com',
//             clientSecret: "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",
//           },
//         });

//         transporter.sendMail({
//           from: "Grisha.Lakoza@gmail.com",
//           to: "interview.questions50@gmail.com",
//           subject: "Message",
//           text: "I hope this message gets through!",
//           auth: {
//             user: "interview.questions50@gmail.com",
//             refreshToken: "1//04zA2-gQ__D7LCgYIARAAGAQSNgF-L9IrFBFH7FFpeuZP3qjZmOb5HUeAuBlK1nlC0O5kSEyuxZQBcjBhrOcBU4_qw5CYXpAg8w",
//             accessToken: "ya29.a0AfB_byDxZ_AQCysdnLXABCuWa6Buip92oKPyfcBZMEKkHdi73LtdIdT2fPaNCdsxQu-MQN2Bavm0sFkmfNfUtxLWY4YVj-sWHSA1DboMQ-lw5lSXMejVKMeejR9wi2_UEWky4N0A1XonzJFGGacOIKTPNqPlHBVMpQsiaCgYKAWgSARASFQGOcNnCPatgsOMTv14PIJdNduUyng0171",
//             expires: 1484314697598,
//           },
//         });
//     } else {
//         res.status(405).end();
//     }
// };


// // const transporter = nodemailer.createTransport({
// //   host: "smtp.forwardemail.net",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
// //     user: "interview.questions50@gmail.com",
// //     pass: "Ghgx879CV3",
// //   }
// // });

// // // async..await is not allowed in global scope, must use a wrapper
// // export default async function main() {
// //   // send mail with defined transport object
// //   const info = await transporter.sendMail({
// //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
// //     to: "bar@example.com, baz@example.com", // list of receivers
// //     subject: "Hello ✔", // Subject line
// //     text: "Hello world?", // plain text body
// //     html: "<b>Hello world?</b>", // html body
// //   });

// //   console.log("Message sent: %s", info.messageId);
// //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// //   //
// //   // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
// //   //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
// //   //       <https://github.com/forwardemail/preview-email>
// //   //
// // }

// // main().catch(console.error);



// import { google } from "googleapis";
// import nodemailer from 'nodemailer';
// const CLIENT_ID = '1013820621503-9homr11kostin1stcfshsld0ouh20dbl.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REFRESH_TOKEN = '1//04zA2-gQ__D7LCgYIARAAGAQSNgF-L9IrFBFH7FFpeuZP3qjZmOb5HUeAuBlK1nlC0O5kSEyuxZQBcjBhrOcBU4_qw5CYXpAg8w';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const MY_EMAIL = 'interview.questions50@gmail.com';

// const oAuth2Client = new google.auth.OAuth2 (
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const sendTestEmail = async (to) => {
//   const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
//   const transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: "OAuth2",
//       user: MY_EMAIL,
//       clientId: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//       refreshToken: REFRESH_TOKEN,
//       accessToken: ACCESS_TOKEN,
//     },
//     tls: {
//       rejectUnauthorized: true,
//     },
//   });

//   const from = MY_EMAIL;
//   const subject = 'This is sent by nodemailer';
//   const html = `<p>Hey ${to}</p>`;

//   return new Promise((resolve, reject) => {
//     transport.sendMail({ from, subject, to, html }, (err, info) => {
//       if (err) reject(err);
//       resolve(info)
//     })
//   })
// }
// export default sendTestEmail















// import { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from 'nodemailer';
// export default async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   if (req.method === 'POST') {
//     const { message } = req.body;

//     let transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         type: "OAuth2",
//         user: "interview.questions50@gmail.com",
//         clientId: '1013820621503-9homr11kostin1stcfshsld0ouh20dbl.apps.googleusercontent.com',
//         clientSecret: "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",
//         refreshToken: "1//04zA2-gQ__D7LCgYIARAAGAQSNgF-L9IrFBFH7FFpeuZP3qjZmOb5HUeAuBlK1nlC0O5kSEyuxZQBcjBhrOcBU4_qw5CYXpAg8w",
//         accessToken: "ya29.a0AfB_byDxZ_AQCysdnLXABCuWa6Buip92oKPyfcBZMEKkHdi73LtdIdT2fPaNCdsxQu-MQN2Bavm0sFkmfNfUtxLWY4YVj-sWHSA1DboMQ-lw5lSXMejVKMeejR9wi2_UEWky4N0A1XonzJFGGacOIKTPNqPlHBVMpQsiaCgYKAWgSARASFQGOcNnCPatgsOMTv14PIJdNduUyng0171",
//         expires: 1484314697598,
//       },
//     });
//     try {
//       await transporter.sendMail({
//         from: "Grisha.Lakoza@gmail.com",
//         to: "interview.questions50@gmail.com",
//         subject: "Message",
//         text: message,
//       });
//       res.status(200).json({ message: 'Сообщение успешно отправлено' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Ошибка при отправке сообщения' });
//     }
//   } else {
//     res.status(405).end();
//   }
// };
