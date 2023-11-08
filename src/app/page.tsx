import { getDbProfessions } from '../services/DatabaseService'
import { ProfessionCard } from './components/ProfessionCard';

export default async function Home() {
  const professions = await getDbProfessions()

  return (
    <div className='container container__home'>
      <div className='card__wrapper'>
        {professions && professions.map((profession) =>
          <ProfessionCard profession={profession} key={profession.id} />
        )}
      </div>
    </div>
  )
}
