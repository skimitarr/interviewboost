import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Подготовка аутентификации
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    const drive = google.drive({
      auth,
      version: 'v3'
    });

    // Идентификатор файла на Google Drive
    const fileId = process.env.GOOGLE_SHEET_ID; // Замените на фактический идентификатор вашего файла на Google Drive

    // Получение файла с Google Drive
    const response = await drive.files.get({
      fileId,
      alt: 'media', // Указываем 'media', чтобы получить контент файла
    }, { responseType: 'stream' }); // Используем responseType: 'stream' для обработки потока данных

    // Устанавливаем заголовок Content-Disposition для скачивания файла
    res.setHeader('Content-Disposition', `attachment; filename="downloaded_file.xlsx"`);

    // Устанавливаем правильный Content-Type для бинарного файла
    res.setHeader('Content-Type', 'application/octet-stream');

    // Отправляем файл в ответ
    response.data.pipe(res);
  } catch(e) {
    console.error(e);
    return res.status(500).send({ message: 'Something went wrong' })
  }
}
