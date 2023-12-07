'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { nanoid } from 'nanoid';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Search } from "../components/Search/Search";
import { DataReport } from "../components/Types";
import { StyledLink, StyledRightSide } from "../components/PageFormRightSide/style";
import { StyledLeftContainer as Report, StyledLeftContainer } from "../interview/style";
import { MixinBtn, MixinFlexCenter, MixinGridContainer } from "@/css/variables";
import {
  StyledNameBtn,
  StyledRow,
  StyledRowItem,
  StyledTextConclusion,
  StyledTitle,
  StyledBtnWrapper
} from "./style";

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
    allData.length && localStorage.setItem('allDatas', JSON.stringify(allData))
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
    session.status === 'unauthenticated' && router.push('/signin');
  }, [session]);

  const getCurrentReport = (item: DataReport, id: string) => {
    setCurrentReport(Object.entries(item));
    setCurrentName(item.name);
    setCurrentIdReport(id)
  }

  const downloadFile = async () => { //сохраняем отчет в pdf и скачиваем его
    const rightSideElement = document.querySelector('[data-report="report"]') as HTMLElement;
    const titles = document.querySelectorAll('[data-titles="titles"]') as NodeListOf<HTMLElement>;
    const textsColor = document.querySelectorAll('[data-text="text"]') as NodeListOf<HTMLElement>;
    const titlesColor = document.querySelectorAll('[data-tilescolor="titlescolor"]') as NodeListOf<HTMLElement>;
    const borders = document.querySelectorAll('[data-borders="borders"]') as NodeListOf<HTMLElement>;

    titles.forEach((title) => {
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
      border.classList.add('blackBorder1', 'blackBorder2');
    });

    const pdfContent: any[] = [];

    async function addScreenshotsToPDF(element: HTMLElement) {
      const canvas = await html2canvas(element);
      const pageImage = canvas.toDataURL('image/jpeg');

      // Установите размеры страницы PDF равными размерам скриншота
      pdfContent.push({ image: pageImage, width: canvas.width, height: canvas.height });
    }

    await addScreenshotsToPDF(rightSideElement);

    const pdfDoc = pdfMake.createPdf({
      content: pdfContent,
      pageSize: { width: pdfContent[0].width + 70, height: pdfContent[0].height + 70 }
    });

    pdfDoc.download(`${currentName}.pdf`);

    titles.forEach((title) => {
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
    <Box sx={{ ...MixinGridContainer }}>
      <StyledLeftContainer>
        <Search pageName='reports' getCurrentReport={getCurrentReport} />
        {allData && allData.map((item) => {
          const itemWithoutId = { ...item }; // Создаем копию объекта item без поля id, чтобы онo не отрисовывалась
          delete itemWithoutId.id;
          return (
            <Box sx={{ padding: '0 27px', marginBottom: '5px' }} key={item.id}>
              <StyledNameBtn
                onClick={() => getCurrentReport(itemWithoutId, item.id as string)}
                isActive={currentIdReport === item.id}
              >
                {item.name}
              </StyledNameBtn>
            </Box>
          );
        })}
      </StyledLeftContainer>

      {allData.length > 0
        ? <Report sx={({ custom }) => ({ backgroundColor: custom.colorTwilightSlate, paddingBottom: '0' })}>
          <Box sx={{ position: 'relative' }} data-report="report">
            <Box sx={{ padding: '25px' }}>
              {currentReport.length > 0 &&
                currentReport.map(([sectionName, sectionData]) => (
                  <Box
                    key={nanoid()}
                    sx={{
                      '&:not(:last-child)': {
                        marginBottom: '40px',
                      }
                    }}
                  >
                    {sectionName === 'name' &&
                      <StyledTitle data-tilescolor="titlescolor">
                        <Typography sx={{ fontSize: '16px' }} data-titles="titles" data-text="text">{sectionData}</Typography>
                      </StyledTitle>
                    }

                    {sectionName === 'conclusion' && Array.isArray(sectionData) &&
                      sectionData.map((el: string[]) => (
                        <Box key={nanoid()}>
                          {el.map(el => (
                            el === 'Общий вывод'
                              ? <Box key={nanoid()}>
                                <StyledTitle data-tilescolor="titlescolor">
                                  <Typography sx={{ fontSize: '16px' }} data-titles="titles" data-text="text">{el}</Typography>
                                </StyledTitle>
                                <Box
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '80% 20%',
                                    marginBottom: '20px'
                                  }}
                                >
                                  <Typography sx={{ textAlign: 'center' }} data-text="text">{t('comment')}</Typography>
                                  <Typography sx={{ textAlign: 'center' }} data-text="text">{t('rating')}</Typography>
                                </Box>
                              </Box>
                              : <StyledTextConclusion key={nanoid()} data-text="text">{el}</StyledTextConclusion>
                          ))}
                        </Box>
                      ))
                    }

                    {sectionName !== 'name' && sectionName !== 'conclusion' &&
                      <>
                        <StyledTitle data-tilescolor="titlescolor">
                          <Typography sx={{ fontSize: '16px' }} data-titles="titles" data-text="text">{sectionName}</Typography>
                        </StyledTitle>
                        <Box>
                          <StyledRow data-borders="borders">
                            <StyledRowItem data-text="text">{t('questions')}</StyledRowItem>
                            <StyledRowItem data-text="text">{t('rating')}</StyledRowItem>
                            <StyledRowItem data-text="text">{t('comment')}</StyledRowItem>
                          </StyledRow>
                          {Array.isArray(sectionData) &&
                            sectionData.map((elements: string[], index1) => (
                              <StyledRow data-borders="borders" key={nanoid()}>
                                {elements.map((el, index: number) => (
                                  index % 2 === 0
                                    ? <StyledRowItem
                                      key={nanoid()}
                                      data-text="text"
                                      sx={{ textAlign: 'left', marginLeft: '20px' }}
                                    >
                                      {el !== 'Итого' && index === 0 ? `${index1 + 1}. ${el}` : el}
                                    </StyledRowItem>
                                    : <StyledRowItem key={nanoid()} data-text="text">
                                      {el}
                                    </StyledRowItem>
                                ))}
                              </StyledRow>
                            ))
                          }
                        </Box>
                      </>
                    }
                  </Box>
                ))}
            </Box>
          </Box>

          <StyledBtnWrapper>
            <Button sx={{ ...MixinBtn }} onClick={downloadFile}>{t('downloadReport')}</Button>
          </StyledBtnWrapper>
        </Report>
        : <StyledRightSide>
          <Box
            sx={{
              marginTop: '140px',
              ...MixinFlexCenter,
              flexDirection: 'column',
            }}>
            <Typography sx={{ marginBottom: '45px', fontSize: '18px' }}>
              {t('selectSpecialization')}
            </Typography>
            <StyledLink href='/position'>{t('letsGetStarted')}</StyledLink>
          </Box>
        </StyledRightSide>}
    </Box>
  )
}
