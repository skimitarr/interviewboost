'use client' //TODO убрать, добавлено из-за  sx={({ custom }) => ({
import Box from '@mui/material/Box';
import { Search } from '../components/Search/Search';
import { PageFormLeftSide } from '../components/PageFormLeftSide/PageFormLeftSide';
import { PageFormRightSide } from '../components/PageFormRightSide/PageFormRightSide';
import { MixinGridContainer } from '@/css/variables';

export default async function Form() {

  return (
    <Box sx={{ ...MixinGridContainer }}>
      <Box // оставляем 'одеяло', бо серверный компонент
        sx={({ custom }) => ({
          height: 'calc(100vh - 160px)',
          paddingBottom: '20px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',          /* "auto" или "thin" */
          scrollbarColor: `${custom.colorAzureBlue} transparent`,   /* цвет бегунка и зоны отслеживания */

          '&::-webkit-scrollbar': {
            width: '4px',               /* ширина всей полосы прокрутки */
            '&-thumb': {
              backgroundColor: custom.colorAzureBlue,    /* цвет бегунка */
              borderRadius: '10px',       /* округлось бегунка */
              height: '300px',
            }
          }
        })}>
        <Search />
        <PageFormLeftSide />
      </Box>
      <PageFormRightSide />
    </Box>
  )
}
