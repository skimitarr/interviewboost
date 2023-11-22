import Box from '@mui/material/Box';
import { getDbProfessions } from '../services/DatabaseService'
import { ProfessionCard } from './components/ProfessionCard/ProfessionCard';
import { MixinFlexCenter, colorBlack1 } from '@/css/variables';

export default async function Home() {
  const professions = await getDbProfessions()

  return (
    <Box
      sx={{
        ...MixinFlexCenter,
        minHeight: 'calc(100vh - 80px)',
        backgroundColor: colorBlack1,
      }}
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
