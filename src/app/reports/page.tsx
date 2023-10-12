'use client'
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid'
import { useRouter } from "next/navigation";
import Link from "next/link"
import { useSession } from "next-auth/react"
import { DataReport } from "../components/Types";

import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import Search from "../components/Search";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Reports() {
  const [allData, setAllData] = useState<DataReport[]>([]); // все отчеты в левой части экрана
  const [currentReport, setCurrentReport] = useState<any[]>([]); // отображение текущего отчета в правой части экрана
  const [currentName, setCurrentName] = useState(''); // для названия сохраняемого файла
  const [currentIdReport, setCurrentIdReport] = useState(''); // для выделения отчета цветом

  const session = useSession();
  const router = useRouter();

  useEffect(() => { // получаем allData
    const tempAllData = localStorage.getItem('allDatas') || '[]';
    const tempCurrentData = localStorage.getItem('dataReport') ?? '[]';
    setAllData([...JSON.parse(tempAllData)])
    if (tempAllData.includes(tempCurrentData)) { // чтобы не добавлялся отчет при переходе между вкладками
      return
    }
    if (tempCurrentData) { //добавляем текущий отчет
      setAllData([JSON.parse(tempCurrentData), ...JSON.parse(tempAllData)])
    }
  }, [])

  useEffect(() => { //обновляем все отчеты в localStorage
    localStorage.setItem('allDatas', JSON.stringify(allData))
  }, [allData])

  useEffect(() => { // открываем первый отчет
    if (allData.length > 0) {
      const itemWithoutId = { ...allData[0] }; // Создаем копию объекта item без поля id, чтобы онo не отрисовывалась
      delete itemWithoutId.id;
      setCurrentReport(Object.entries(itemWithoutId));
      setCurrentName(itemWithoutId.name)
      setCurrentIdReport(allData[0].id as string)
    }
  }, [allData])

  useEffect(() => { //если не зареган, переходим на окно регистрации
    if (session.status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session]);

  const getCurrentReport = (item: DataReport, id: string) => {
    setCurrentReport(Object.entries(item));
    setCurrentName(item.name)
    setCurrentIdReport(id)
  }

  // const downloadFile = async () => { // скачиваем данные из гугл таблицы, превращаем в файл и загружаем его
  //   try {
  //     // Отправить запрос к api/submit, чтобы получить данные из Google Таблиц
  //     const responseFromGoogleSheets = await fetch('/api/getData', {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //     });

  //     if (responseFromGoogleSheets.ok) {
  //       // Если запрос к Google Таблицам успешен, получите данные
  //       const dataFromGoogleSheets = await responseFromGoogleSheets.json();

  //       // Теперь у вас есть данные из Google Таблицам
  //       console.log(dataFromGoogleSheets.data[2][1]);
  //       let data = dataFromGoogleSheets.data[2][1]

  //       // Создайте новый массив для данных CSV
  //       const csvData = [];
  //       // Идем по каждому элементу в исходных данных
  //       for (let i = 0; i < data.length; i++) {
  //         // Если текущий элемент и следующий существуют, объедините их в одну строку CSV
  //         if (data[i].length > 0) {
  //           const csvRow = data[i].map((cell: any) => cell.replace(/ /g, '_')).join(' ');
  //           // Замените запятые на пробелы
  //           const csvRowWithSpaces = csvRow.replace(/,/g, ' ');
  //           csvData.push(csvRowWithSpaces);
  //         } else if (i > 0 && data[i - 1].length > 0) {
  //           // Если текущий элемент пустой, но предыдущий элемент был заполнен, добавьте пустую строку в CSV
  //           csvData.push('');
  //         }
  //       }
  //       // Преобразуйте данные в формат CSV
  //       const csvContent = csvData.join('\n');

  //       // Затем выполните логику для скачивания файла и прочие действия
  //       // Создайте Blob из данных (csvContent), Создайте ссылку для скачивания
  //       // const blob = new Blob([data]);
  //       // обычно хватает предыдущей строчки, но на следующей учтена поддержка русского языка
  //       const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv; charset=UTF-8" });
  //       const link = document.createElement('a');
  //       link.href = window.URL.createObjectURL(blob);
  //       link.setAttribute('download', `${currentName}.csv`);

  //       // Добавьте ссылку на страницу и симулируйте клик для скачивания
  //       document.body.appendChild(link);
  //       link.click();

  //       // Удалите ссылку после скачивания
  //       link.remove();
  //     } else {
  //       // Если запрос к Google Таблицам не удался, обработайте ошибку
  //       console.error('Ошибка при получении данных из Google Таблиц');
  //     }
  //   } catch (error) {
  //     console.error('Ошибка:', error);
  //   }
  // };


  // const downloadFile = async () => { // скачиваем сам файл из гугл таблицы и загружаем его (пока что данные вунтри таблицы почемуто отсутствуют)
  //   try {
  //     // Отправить запрос к роуту /api/downloadFile, чтобы получить файл "downloaded_file.xlsx" с сервера
  //     const responseFromServer = await fetch('/api/downloadFile', {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/octet-stream', // Указываем тип данных, что это бинарный файл
  //       },
  //     });

  //     console.log(responseFromServer)

  //     if (responseFromServer) {
  //       // Если запрос к серверу успешен, получите файл
  //       const fileBlob = await responseFromServer.blob();

  //       console.log(fileBlob)

  //       // Создайте ссылку для скачивания и симулируйте клик для скачивания файла
  //       const link = document.createElement('a');
  //       link.href = window.URL.createObjectURL(fileBlob);
  //       link.setAttribute('download', 'downloaded_file.csv'); // Установите имя файла
  //       document.body.appendChild(link);
  //       link.click();

  //       // Удалите ссылку после скачивания
  //       link.remove();
  //     } else {
  //       // Если запрос не удался, обработайте ошибку
  //       console.error('Ошибка при получении файла с сервера.');
  //     }
  //   } catch (error) {
  //     console.error('Ошибка:', error);
  //   }
  // };

  const downloadFile = async () => { //сохраняем отчет в pdf и скачиваем его
    const rightSideElement = document.querySelector('.report__container') as HTMLElement;
    const titles = document.querySelectorAll('.report__block-text') as NodeListOf<HTMLElement>; //из-за ошибки меняем выравнивание текста
    const textsColor = document.querySelectorAll('.report__text') as NodeListOf<HTMLElement>;
    const titlesColor = document.querySelectorAll('.report__block-title') as NodeListOf<HTMLElement>;
    const borders = document.querySelectorAll('.report__block-row') as NodeListOf<HTMLElement>;

    titles.forEach((title) => {
      // title.style.alignItems = 'flex-start';
      title.style.marginTop = '-10px';
    });
    rightSideElement.style.backgroundColor = 'white';
    textsColor.forEach((text) => {
      text.style.color = 'black';
    });
    titlesColor.forEach((title) => {
      title.style.backgroundColor = '#b8b5b5';
    });
    borders.forEach((border) => {
      border.classList.add('blackBorder1', 'blackBorder2'); // Добавляем класс для изменения стилей
    });

    // const canvas = await html2canvas(rightSideElement); // Создаем скриншот элемента
    // const pdfDoc = pdfMake.createPdf({ // Создаем PDF-документ
    //   content: [ // Добавляем изображение скриншота в PDF
    //     { image: canvas.toDataURL('image/jpeg'), width: 500 }, // Вы можете настроить размер изображения по своему усмотрению
    //   ],
    // });
    // pdfDoc.download(`${currentName}.pdf`); // Скачиваем PDF-файл
    // // pdfDoc.open({}, window); // открываем тут же PDF-файл (для тестирования)

    const elementsToCapture = [rightSideElement]; // Создайте массив элементов для захвата скриншотов
    // const pageWidth = 810; // Ширина страницы в пикселях
    // const pageHeight = 1200; // Высота страницы в пикселях
    // const pageWidth = window.innerWidth * 2 / 3; // Ширина страницы в пикселях
    // const pageHeight = window.innerHeight; // Высота страницы в пикселях, равная высоте окна браузера
    // const pageWidth = rightSideElement.offsetWidth; // Добавьте небольшой запас
    // const pageHeight = rightSideElement.offsetHeight; // Добавьте небольшой запас

    // Получите плотность пикселей устройства
    const devicePixelRatio = window.devicePixelRatio || 1;
    // Определите размеры страницы динамически на основе размеров rightSideElement и плотности пикселей
    const pageWidth = (rightSideElement.offsetWidth) * devicePixelRatio;
    const pageHeight = (rightSideElement.offsetHeight) * devicePixelRatio;
    const pdfContent: any[] = [];

    // Функция для создания и добавления скриншотов в PDF
    async function addScreenshotsToPDF(element: HTMLElement) {
      const canvas = await html2canvas(element); // Создаем скриншот элемента
      const totalHeight = canvas.height;
      let yOffset = 0;

      while (yOffset < totalHeight) {
        // Создаем скриншот, обрезанный до размеров страницы A4
        const pageCanvas = document.createElement('canvas');
        const pageContext = pageCanvas.getContext('2d');
        pageCanvas.width = pageWidth;

        // Вычисляем высоту отрисовываемой области для этой страницы
        const pageContentHeight = Math.min(pageHeight, totalHeight - yOffset);
        pageCanvas.height = pageContentHeight;

        // Рисуем скриншот с учетом смещения
        pageContext?.drawImage(
          canvas,
          0,
          yOffset,
          pageWidth,
          pageContentHeight,
          0,
          0,
          pageWidth,
          pageContentHeight
        );

        // Преобразуем скриншот в изображение и добавляем в массив для PDF
        const pageImage = pageCanvas.toDataURL('image/jpeg');
        pdfContent.push({ image: pageImage, width: 500 });

        // Увеличиваем yOffset для следующего скриншота
        yOffset += pageHeight;
      }
    }

    // Обходим все элементы и создаем скриншоты
    for (const element of elementsToCapture) {
      await addScreenshotsToPDF(element);
    }
    // Создаем PDF-документ с содержимым
    const pdfDoc = pdfMake.createPdf({
      content: pdfContent,
    });
    pdfDoc.download(`${currentName}.pdf`);

    titles.forEach((title) => { //возвращаем выравнивание текста
      // title.style.alignItems = 'center'
      title.style.marginTop = '0';
    });
    rightSideElement.style.backgroundColor = '#3C3E49';
    textsColor.forEach((text) => {
      text.style.color = 'white';
    });
    titlesColor.forEach((title) => {
      title.style.backgroundColor = '#202123';
    });
    borders.forEach((border) => {
      border.classList.remove('blackBorder1', 'blackBorder2');
    });
  };

  return (
    <div className='container container__form'>
      <div className='questions__leftSide'>
        <Search pageName='reports' getCurrentReport={getCurrentReport} />
        {allData && allData.map((item) => {
          const itemWithoutId = { ...item }; // Создаем копию объекта item без поля id, чтобы онo не отрисовывалась
          delete itemWithoutId.id;
          return (
            <div className='questions__leftSide-div' key={item.id}>
              <button className={`questions__choosenQuestions-reports ${currentIdReport === item.id ? 'active' : ''}`}
                onClick={() => getCurrentReport(itemWithoutId, item.id as string)}>{item.name}</button>
            </div>
          );
        })}
      </div>

      {allData.length > 0
        ? <div className='report'>
          <div className='report__container'>
            <div className='report__wrapper'>
              {currentReport.length > 0 && currentReport.map(([sectionName, sectionData]) => {
                return <div className='report__block' key={nanoid()}>
                  {sectionName === 'name'
                    ? <div className='report__block-title'>
                      <p className='report__block-text report__text'>{sectionData}</p>
                    </div>
                    : ''}

                  {sectionName === 'conclusion'
                    ? Array.isArray(sectionData) && sectionData.map((el: string[]) => {
                      return (
                        <div key={nanoid()} className="test">
                          {el.map(el => {
                            return el === 'Общий вывод'
                              ? <div key={nanoid()}>
                                <div className='report__block-title'>
                                  <p className='report__block-text report__text'>
                                    {el}
                                  </p>
                                </div>
                                <div className='report__conclusion'>
                                  <span className='report__block-item report__comments report__text' style={{ marginLeft: '50px' }}>Комментарий</span>
                                  <span className='report__block-item report__marks report__text'>Оценка</span>
                                </div>
                              </div>
                              : <span key={nanoid()} className='report__conclusion-item report__text'>
                                {el}
                              </span>
                          })}
                        </div>
                      )
                    })
                    : ''}

                  {sectionName !== 'name' && sectionName !== 'conclusion'
                    ? <>
                      <div className='report__block-title'>
                        <p className='report__block-text report__text'>{sectionName}</p>
                      </div>
                      <div className='report__block-wrapper'>
                        <div className='report__block-row'>
                          <span className='report__block-item report__questions report__text'>Вопросы</span>
                          <span className='report__block-item report__marks report__text'>Оценка</span>
                          <span className='report__block-item report__comments report__text'>Комментарий</span>
                        </div>
                        {Array.isArray(sectionData) && sectionData.map((elements: string[], index1) => {
                          return <div className='report__block-row' key={nanoid()}>
                            {elements.map((el, index: number) => {
                              return (
                                index % 2 === 0
                                  ? el !== 'Итого' && index === 0
                                    ? <p key={nanoid()} className='report__block-item report__text' style={{ textAlign: 'left', marginLeft: '20px' }}>{index1 + 1}. {el}</p>
                                    : <p key={nanoid()} className='report__block-item report__text' style={{ textAlign: 'left', marginLeft: '20px' }}>{el}</p>
                                  : <p key={nanoid()} className='report__block-item report__text'>{el}</p>
                              )
                            })}
                          </div>
                        })}</div>
                    </>
                    : ''}

                </div>
              })}
            </div>
          </div>

          <div className='questions__nextPage-wrapper'>
            <button className='questions__nextPage-btn btn' onClick={downloadFile}>Скачать отчет</button>
          </div>
        </div>

        : <div className='questions__rightSide'>
          <div className='questions__noData'>
            <Link className='questions__noData-btn btn' href='/'><p>Начнем</p></Link>
          </div>
        </div>}

    </div>
  )
}
