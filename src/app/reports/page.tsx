'use client'
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import Search from "../components/Search";
import { DataReport } from "../components/Types";

export default function Reports() {
  const [allData, setAllData] = useState<DataReport[]>([]); // все отчеты в левой части экрана
  const [currentReport, setCurrentReport] = useState<any[]>([]); // отображение текущего отчета в правой части экрана
  const [currentName, setCurrentName] = useState(''); // для названия сохраняемого файла
  const [currentIdReport, setCurrentIdReport] = useState(''); // для выделения отчета цветом
  const { t } = useTranslation();
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

    const elementsToCapture = [rightSideElement]; // Создайте массив элементов для захвата скриншотов

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
                                  <span className='report__block-item report__comments report__text' style={{ marginLeft: '50px' }}>{t('comment')}</span>
                                  <span className='report__block-item report__marks report__text'>{t('rating')}</span>
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
                          <span className='report__block-item report__questions report__text'>{t('questions')}</span>
                          <span className='report__block-item report__marks report__text'>{t('rating')}</span>
                          <span className='report__block-item report__comments report__text'>{t('comment')}</span>
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
            <button className='questions__nextPage-btn btn' onClick={downloadFile}>{t('downloadReport')}</button>
          </div>
        </div>

        : <div className='questions__rightSide'>
          <div className='questions__noData'>
            <Link className='questions__noData-btn btn' href='/'><p>{t('letsGetStarted')}</p></Link>
          </div>
        </div>}

    </div>
  )
}
