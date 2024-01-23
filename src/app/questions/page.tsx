'use client' //TODO убрать, добавлено из-за  sx={({ custom }) => ({
import Box from '@mui/material/Box';
import { Search } from '../components/Search/Search';
import { PageFormLeftSide } from '../components/PageFormLeftSide/PageFormLeftSide';
import { PageFormRightSide } from '../components/PageFormRightSide/PageFormRightSide';
import { IProffesion } from '@/app/components/Types';
import applySpec from 'ramda/es/applySpec';
import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from '@/app/store/types';
import fastDeepEqual from 'fast-deep-equal';
import { useSelector } from 'react-redux';

type Selector = {
  profession: IProffesion,
};

const selector = applySpec<Selector>({
  profession: selectFromAppData('profession', null),
});

export default async function Form() {

  const {profession} = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  return (
    <Box
      sx={({custom}) => ({
        display: 'grid',
        gridTemplateColumns: `${profession ? '1fr' : '0fr'} 2fr`,
        height: 'calc(100vh - 80px)',
        backgroundColor: custom.colorMidnightCoal,
      })}>
      <Box // оставляем 'одеяло', бо серверный компонент
        sx={({custom}) => ({
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
        <Search/>
        <PageFormLeftSide/>
      </Box>
      <PageFormRightSide/>
    </Box>
  )
}
