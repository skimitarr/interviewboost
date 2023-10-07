import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

// type SheetForm = {
//   name: string,
//   question: string,
//   mark: string,
//   comment: string,
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send({message: 'Only POST requests are allowed'})
  }

  // const body = req.body as SheetForm
  const dataToGoogleSheets = req.body

  try {
    // prepare auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // Создаем экземпляр Google Sheets API
    // const sheets = google.sheets('v4');
    const sheets = google.sheets({
      auth,
      version: 'v4'
    });

    // Очищаем таблицу прежде чем добавить данные
    const clearResponse = await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Feedback1!1:5000', // Укажите диапазон, который вы хотите очистить
    });
    console.log('Cleared data:', clearResponse.data);

    // Вызываем метод spreadsheets.values.append для добавления данных
    const response = await sheets.spreadsheets.values.append({
      // auth,
      // ID таблицы Google Sheets, в которую вы хотите добавить данные
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      // Диапазон, в который вы хотите добавить данные (например, "Sheet1!A1:B2")
      // range: 'Feedback1!A1:D6',
      range: 'A1:D6',
      // valueInputOption - это параметр, который определяет, как данные будут интерпретироваться
      // и обрабатываться при добавлении или обновлении в Google Sheets
      valueInputOption: 'USER_ENTERED', // 'RAW' или 'USER_ENTERED'в зависимости от ваших требований
      requestBody: {
        // values: [
        //   [body.name, body.question, body.mark, body.comment]
        // ],
        values: dataToGoogleSheets
      },
    });

    // // получение данных гугл страницы
    // const response = await sheets.spreadsheets.values.get({
    //   // auth,
    //   // ID таблицы Google Sheets, в которую вы хотите добавить данные
    //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //   range: 'Feedback1!2:200',
    // });

    return res.status(200).json({
      data: response.data
    })

  } catch(e) {
    console.error(e);
    return res.status(500).send({message: 'Something went wrong'})
  }
}
