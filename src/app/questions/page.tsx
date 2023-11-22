import Box from '@mui/material/Box';
import { Search } from '../components/Search/Search';
import { PageFormLeftSide } from '../components/PageFormLeftSide/PageFormLeftSide';
import { PageFormRightSide } from '../components/PageFormRightSide/PageFormRightSide';
import { MixinGridContainer, сolorBtn } from '@/css/variables';

export default async function Form() {

  return (
    <Box sx={{ ...MixinGridContainer }}>
      <Box // оставляем 'одеяло', бо серверный компонент
        sx={{
          height: 'calc(100vh - 160px)',
          paddingBottom: '20px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',          /* "auto" или "thin" */
          scrollbarColor: `${сolorBtn} transparent`,   /* цвет бегунка и зоны отслеживания */

          '&::-webkit-scrollbar': {
            width: '4px',               /* ширина всей полосы прокрутки */
            '&-thumb': {
              backgroundColor: сolorBtn,    /* цвет бегунка */
              borderRadius: '10px',       /* округлось бегунка */
              height: '300px',
            }
          }
        }}>
        <Search />
        <PageFormLeftSide />
      </Box>
      <PageFormRightSide />
    </Box>
  )
}
