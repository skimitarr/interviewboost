import { getDbProfessions } from '../services/DatabaseService'
import ProfessionCard from './components/ProfessionCard';
// setDocs()

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

// Вопросы Роме:
// ; 1. как работает переход по адресу? у нас должны быть созданы статические страницы для этого?
// ;    как их создать, проверить это? через npm run build?

// ; 2. У меня сейчас нигде нет полной загрузки всех вопросов, поэтому получается что не для всех ссылок будут страницы?
// ;    Может нужно скачать с базы данных все вопросы, чтобы создать для них статические страницы?

// ; 3. страница мои вопросы будет при каждом клике на вопрос перерендириваться? как этого можно избежать?


// 3. убрать any
// 8. Оптимизация
// 9. Проверить лицензии
// 10. сделать роботtxt и сайтмап
