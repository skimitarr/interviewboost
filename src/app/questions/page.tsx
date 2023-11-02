import { Search } from '../components/Search';
import { PageFormLeftSide } from '../components/PageFormLeftSide';
import { PageFormRightSide } from '../components/PageFormRightSide';

export default async function Form() {

  return (
    <div className='container container__form'>
      <div className='questions__leftSide'>
        <Search />
        <PageFormLeftSide />
      </div>
      <PageFormRightSide />
    </div>
  )
}
