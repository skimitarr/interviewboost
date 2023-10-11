import Search from '../components/Search';
import PageForm__leftSide from '../components/PageForm__leftSide';
import PageForm__rightSide from '../components/PageForm__rightSide';

export default async function Form() {

  return (
    <div className='container container__form'>
      <div className='questions__leftSide'>
        <Search />
        <PageForm__leftSide />
      </div>
      <PageForm__rightSide />
    </div>
  )
}
