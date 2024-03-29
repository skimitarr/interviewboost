'use client'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFromAppData } from '@/app/store/selectors/data';
import { useAppDispatch } from '../hooks'
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from '@mui/material/Box';

import { ProfessionCard } from '../components/ProfessionCard/ProfessionCard';
import { StoreState } from '@/app/store/types';
import { IProffesion } from '../components/Types';
import { MixinFlexCenter } from '@/styles/mixins';

type Selector = {
  allProfessions: IProffesion[],
};

const selector = applySpec<Selector>({
  allProfessions: selectFromAppData('allProfessions', []),
});

export default function Position() {
  const { allProfessions } = useSelector<StoreState, Selector>(selector, fastDeepEqual);
  const [professions, setProfessions] = useState<IProffesion[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ type: 'actionType/getAllProfessions' });
  }, []);

  useEffect(() => {
    setProfessions(allProfessions)
  }, [allProfessions]);

  return (
    <Box
      sx={({ custom }) => ({
        ...MixinFlexCenter,
        minHeight: 'calc(100vh - 80px)',
        backgroundColor: custom.colorMidnightCoal,
      })}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '10px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        {professions && professions.map((profession) =>
          <ProfessionCard profession={profession} key={profession.id} />
        )}
      </Box>
    </Box>
  )
}
