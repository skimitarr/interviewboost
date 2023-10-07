import { db } from '../firebase'
import {
  collection,
  query,
  getDocs,
  where,
  setDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { IProffesion, IGrade, ICategory, IQuestion, IAnswer } from '../app/components/Types'

const getDbProfessions = async () => { //берем всё
  console.log('getDbProfessions')
  try {
    const querySnapshot = await getDocs(collection(db, "professions"));
    const professions: IProffesion[] = [];
    querySnapshot.forEach((item) => {
      professions.push({
        title: item.data().title,
        id: item.data().id,
        desc: item.data().desc,
        grades: item.data().grades,
      });
    });

    return professions;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};

// const getDbGrades = async (selectedIds: string[]) => {//берем только что есть в selectedIds
//   try {
//     const q = query(collection(db, 'grades'), where('id', 'in', selectedIds));
//     const querySnapshot = await getDocs(q);
//     const grades: IGrade[] = [];

//     querySnapshot.forEach((item) => {
//       grades.push({
//         title: item.data().title,
//         id: item.data().id,
//         categories: item.data().categories,
//       });
//     });

//     return grades;
//   } catch (error) {
//     console.error('Error getting selected documents:', error);
//     return [];
//   }
// };

const getDbAllGrades = async () => { //берем всё
  try {
    const querySnapshot = await getDocs(collection(db, "grades"));
    const grades: IGrade[] = [];
    querySnapshot.forEach((item) => {
      grades.push({
        title: item.data().title,
        id: item.data().id,
        categories: item.data().categories,
      });
    });

    return grades;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

// const getDbCategories = async (selectedIds: string[]) => { //берем только что есть в selectedIds
//   try {
//     const q = query(collection(db, 'categories'), where('id', 'in', selectedIds));
//     const querySnapshot = await getDocs(q);
//     const categories: ICategory[] = [];

//     querySnapshot.forEach((item) => {
//       categories.push({
//         title: item.data().title,
//         id: item.data().id,
//         questions: item.data().questions,
//       });
//     });

//     return categories;
//   } catch (error) {
//     console.error('Error getting selected documents:', error);
//     return [];
//   }
// };

const getDbAllCategories = async () => { //берем всё
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories: ICategory[] = [];
    querySnapshot.forEach((item) => {
      categories.push({
        title: item.data().title,
        id: item.data().id,
        questions: item.data().questions,
      });
    });
    return categories;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

// const getDbQuestions = async (selectedIds: string[]) => { //код получения до 30 штук в selectedIds
//   try {
//     const q = query(collection(db, 'questions'), where('id', 'in', selectedIds));
//     const querySnapshot = await getDocs(q);
//     const questions: IQuestion[] = [];

//     querySnapshot.forEach((item) => {
//       questions.push({
//         text: item.data().text,
//         id: item.data().id,
//         answers: item.data().answers,
//       });
//     });

//     return questions;
//   } catch (error) {
//     console.error('Error getting selected documents:', error);
//     return [];
//   }
// };

// const getDbQuestions = async (selectedIds: string[]) => { //код получения более 30 штук в selectedIds
//   try {
//     const batchSize = 30; // Максимальное количество значений для оператора 'in'
//     const questions: IQuestion[] = [];

//     // Разбиваем выбранные идентификаторы на пакеты по 30 идентификаторов
//     for (let i = 0; i < selectedIds.length; i += batchSize) {
//       const batch = selectedIds.slice(i, i + batchSize);
//       const q = query(collection(db, 'questions'), where('id', 'in', batch));
//       const querySnapshot = await getDocs(q);

//       querySnapshot.forEach((item) => {
//         questions.push({
//           text: item.data().text,
//           id: item.data().id,
//           answers: item.data().answers,
//         });
//       });
//     }

//     return questions;
//   } catch (error) {
//     console.error('Error getting selected documents:', error);
//     return [];
//   }
// };

const getDbAllQuestions = async () => { //берем всё
  try {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const questions: IQuestion[] = [];
      querySnapshot.forEach((item) => {
        questions.push({
          text: item.data().text,
          id: item.data().id,
          answers: item.data().answers,
        });
      });

    return questions;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

// const getDbAnswers = async (selectedIds: string[]) => { //код получения до 30 штук в selectedIds
//   try {
//     const q = query(collection(db, 'answers'), where('id', 'in', selectedIds));
//     const querySnapshot = await getDocs(q);
//     const answers: IAnswer[] = [];

//     querySnapshot.forEach((item) => {
//       answers.push({
//         text: item.data().text,
//         id: item.data().id,
//       });
//     });

//     return answers;
//   } catch (error) {
//     console.error('Error getting selected documents:', error);
//     return [];
//   }
// };

const getDbAnswers = async (selectedIds: string[]) => { //код получения более 30 штук в selectedIds, если в сторе нет ответов
  try {
    const batchSize = 30; // Максимальное количество значений для оператора 'in'
    const answers: IAnswer[] = [];

    // Разбиваем выбранные идентификаторы на пакеты по 30 идентификаторов
    for (let i = 0; i < selectedIds.length; i += batchSize) {
      const batch = selectedIds.slice(i, i + batchSize);
      const q = query(collection(db, 'answers'), where('id', 'in', batch));
      const querySnapshot = await getDocs(q);

    querySnapshot.forEach((item) => {
      answers.push({
        text: item.data().text,
        id: item.data().id,
      });
    });
    }

    return answers;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

const getDbAllAnswers = async () => { //берем всё на странице хоум
  try {
    const querySnapshot = await getDocs(collection(db, 'answers'));
    const answers: IAnswer[] = [];
      querySnapshot.forEach((item) => {
        answers.push({
          text: item.data().text,
          id: item.data().id,
        });
      });

    return answers;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

//------------------------------код для внесения данных в базу данных
let a: {id: string, text: string}[] = []
for (let index = 1; index <= 629; index++) {
  a.push({id: index.toString(), text: `ответ ${index}`})
}
// console.log(a)
// let arr: string[] = []
// for (let index = 615; index <= 629; index++) {
//   arr.push(index.toString());
// }

const setDocs = () => { // добавляем подколлекцию
  for (const category of a) {
    setDoc(doc(db, "answers", category.id), category);
  }
  // setDoc(doc(db, "categories", '16'), {
  //   id: '16',
  //   questions: arr,
  //   title: 'Redux Toolkit'
  // });
};

const updateDocs = () => { // заменем поле документа
  updateDoc(doc(db, "categories", "4"), {
    id: '4',
    questions: categories,
    title: 'JS in Browser'
  });
};

// export { getDbProfessions, getDbGrades, getDbCategories, getDbQuestions, getDbAnswers, setDocs, updateDocs }
export { getDbProfessions, getDbAllGrades, getDbAllCategories, getDbAllQuestions, getDbAnswers, getDbAllAnswers, setDocs, updateDocs }

const categories = [
  { id: "1", answers: ['1'], text: "Что такое HTML и для чего он используется?" },
  { id: "2", answers: ['2'], text: "Что такое HTML-элемент? Какова его структура?" },
  { id: "3", answers: ['3'], text: "Что такое атрибуты в HTML? Как они используются в элементах?" },
  { id: "4", answers: ['4'], text: "Какие глобальные атрибуты есть в HTML?" },
  { id: "5", answers: ['5'], text: "Что такое категории контента в HTML5?" },
  { id: "6", answers: ['6'], text: "Какие категории считаются основными категориями контента?" },
  { id: "7", answers: ['7'], text: "Что такое doctype? И для чего он используется?" },
  { id: "8", answers: ['8'], text: "Опишите базовую структуру HTML-страницы?" },
  { id: "9", answers: ['9'], text: "Что такое валидация? И какие типы проверок HTML документа вы знаете?" },
  { id: "10", answers: ['10'], text: "Основные этапы проверок валидности HTML-документа?" },
  { id: "11", answers: ['11'], text: "Если представить HTML5 как открытую веб-платформу, из каких блоков он состоит?" },
  { id: "12", answers: ['12'], text: "Какой тэг использовать для того, что бы сверстать кнопку?" },
  { id: "13", answers: ['13'], text: "Что такое инлайновый стиль? Можно ли его переопределить?" },
  { id: "14", answers: ['14'], text: "Есть ли у HTML элементов свои дефолтные специфичные стили?" },
  { id: "15", answers: ['15'], text: "Что такое семантика? Какие семантичные тэги вы знаете?" },
  { id: "16", answers: ['16'], text: "Как семантически правильно сверстать картинку с подписью?" },
  { id: "17", answers: ['17'], text: "Типы списков в HTML?" },
  { id: "18", answers: ['18'], text: "Для какого тэга используется атрибут alt и зачем он нужен?" },
  { id: "19", answers: ['19'], text: "Какая разница между тэгами <strong><em> и <b><i>?" },
  { id: "20", answers: ['20'], text: "Типы <input> элементов в HTML?" },
  { id: "21", answers: ['21'], text: "Для чего используют data-атрибуты?" },
  { id: "22", answers: ['22'], text: "Разница между <script>, <script async> и <script defer>?" },
  { id: "23", answers: ['23'], text: "Для чего используется элемент <datalist>?" },
  { id: "24", answers: ['24'], text: "Почему хорошей практикой считается располагать <link> для подключения CSS стилей внутри тэга <head>, а <script> для подключения JS ставить перед закрывающимся тэгом </body>?" },
  { id: "25", answers: ['25'], text: "Что такое мета-тэги?" },
  { id: "26", answers: ['26'], text: "Что описывается в тэге <head>?" },
  { id: "27", answers: ['27'], text: "Для чего используются тэги <tr>, <th>, <td>?" },
  { id: "28", answers: ['28'], text: "Расскажите о meta-теге с name=\"viewport\"?" },
  { id: "29", answers: ['29'], text: "Что такое элемент <canvas>? И для чего он используется?" },
  { id: "30", answers: ['30'], text: "Что такое <svg> и <canvas>?" },
  { id: "31", answers: ['31'], text: "Разница между <canvas> и <svg>?" },
  { id: "32", answers: ['32'], text: "В каких случаях лучше использовать <canvas>s, а в каких <svg>?" },
  { id: "33", answers: ['33'], text: "Плюсы и минусы <canvas> и <svg>?" },
  { id: "34", answers: ['34'], text: "Для чего нужен атрибут autocomplete?" },
  { id: "35", answers: ['35'], text: "Что такое элемент <output> в HTML5?" },
  { id: "36", answers: ['36'], text: "Что такое свойство valueAsNumber?" },
  { id: "37", answers: ['37'], text: "Что такое атрибут target? Какие значения он принимает?" },
  { id: "38", answers: ['38'], text: "Что такое ApplicationCache в HTML5?" },
  { id: "39", answers: ['39'], text: "Для чего используется элемент <picture>?" },
  { id: "40", answers: ['40'], text: "Что такое srcset? Как работает srcset?" },
  { id: "41", answers: ['41'], text: "Как семантически верно сверстать навигационное меню?" },
  { id: "42", answers: ['42'], text: "Что такое <iframe>?" },
  { id: "43", answers: ['43'], text: "Для чего используются тэги <sub> и <sup>?" },
  { id: "44", answers: ['44'], text: "Как можно скрыть элемент разметки не используя CSS и JS?" },
  { id: "45", answers: ['45'], text: "Разница между <meter> и <progress>?" },
  { id: "46", answers: ['46'], text: "Как можно сгруппировать опции внутри тэга <select>?" },
  { id: "47", answers: ['47'], text: "Как можно изменить форму картинки или HTML элемента?" },
  { id: "48", answers: ['48'], text: "Чем отличается <article> от <section>?" },
  { id: "49", answers: ['49'], text: "Расскажите об особенностях стилизации <svg>?" },
  { id: "50", answers: ['50'], text: "Разница между кнопкой и ссылкой в HTML?" },
  { id: "51", answers: ['51'], text: "Для чего используется атрибут decoding?" },
  { id: "52", answers: ['52'], text: "Для чего используется атрибут enterkeyhint?" },
  { id: "53", answers: ['53'], text: "Для чего используют атрибут novalidate?" },
  { id: "54", answers: ['54'], text: "Для чего используют атрибут inputmode?" },
  { id: "55", answers: ['55'], text: "Для чего используется атрибут pattern?" },
  { id: "56", answers: ['56'], text: "Почему стоит использовать семантические теги в верстке?" },
  { id: "57", answers: ['57'], text: "Для чего используется тэг <label>?" },
  { id: "58", answers: ['58'], text: "Способы улучшения производительности веб-страницы при использовании HTML?" },
  { id: "59", answers: ['59'], text: "Основные атрибуты HTML-форм? Как они влияют на отправку данных с веб-страницы?" },
  { id: "60", answers: ['60'], text: "Какие HTML-элементы используются для создания и форматирования таблиц? Какие атрибуты у них есть?" },

  { id: "61", answers: ['61'], text: "Что такое CSS? И для чего он используется?" },
  { id: "62", answers: ['62'], text: "Что такое CSS-правило?" },
  { id: "63", answers: ['63'], text: "Варианты добавления CSS стилей на страницу?" },
  { id: "64", answers: ['64'], text: "Типы позиционирования в CSS?" },
  { id: "65", answers: ['65'], text: "Блочная модель CSS?" },
  { id: "66", answers: ['66'], text: "Что такое селектор? И какие селекторы существуют?" },
  { id: "67", answers: ['67'], text: "Что такое специфичность селектора? Как считать вес селектора?" },
  { id: "68", answers: ['68'], text: "Разница между Reset.css и Normalize.css?" },
  { id: "69", answers: ['69'], text: "Разница между margin и padding?" },
  { id: "70", answers: ['70'], text: "Разница между display: none и visibility: hidden?" },
  { id: "71", answers: ['71'], text: "Разница между блочным и строчным (инлайновым) элементами?" },
  { id: "72", answers: ['72'], text: "Разница между классом и идентификатором в CSS?" },
  { id: "73", answers: ['73'], text: "Что такое CSS спрайт? И для чего он используется?" },
  { id: "74", answers: ['74'], text: "Что такое вендорные префиксы? И для чего они используются?" },
  { id: "75", answers: ['75'], text: "Что такое псевдоэлементы? И для чего они используются?" },
  { id: "76", answers: ['76'], text: "Что такое схлопывание границ (margin collapsing)?" },
  { id: "77", answers: ['77'], text: "Что такое CSS препроцессор?" },
  { id: "78", answers: ['78'], text: "Что такое z-index? Как формируется контекст наложения?" },
  { id: "79", answers: ['79'], text: "Порядок наложения элементов в CSS (Stacking Order)?" },
  { id: "80", answers: ['80'], text: "Как с помощью CSS определить, поддерживается ли свойство в браузере?" },
  { id: "81", answers: ['81'], text: "Как поддерживать страницы в браузерах с ограниченными функциями?" },
  { id: "82", answers: ['82'], text: "Как исправлять специфичные проблемы со стилями для разных браузеров?" },
  { id: "83", answers: ['83'], text: "Глобальные ключевые слова в CSS?" },
  { id: "84", answers: ['84'], text: "Что такое CSS-атрибут (attr)?" },
  { id: "85", answers: ['85'], text: "Что такое перечисление селекторов?" },
  { id: "86", answers: ['86'], text: "Для чего используется ключевое слово currentColor в CSS?" },
  { id: "87", answers: ['87'], text: "Какие псевдоклассы были добавлены в CSS3?" },
  { id: "88", answers: ['88'], text: "Какие фильтры есть в CSS?" },
  { id: "89", answers: ['89'], text: "Для чего используется псевдокласс :invalid?" },
  { id: "90", answers: ['90'], text: "Расскажите про свойство display в CSS?" },
  { id: "91", answers: ['91'], text: "В каком случае лучше использовать translate() вместо абсолютного позиционирования?" },
  { id: "92", answers: ['92'], text: "Что такое плавающие элементы (floats)? Как они работают?" },
  { id: "93", answers: ['93'], text: "Расскажите о свойстве text-rendering?" },
  { id: "94", answers: ['94'], text: "Расскажите о свойстве text-decoration-skip-ink?" },
  { id: "95", answers: ['95'], text: "Расскажите о свойстве pointer-events?" },
  { id: "96", answers: ['96'], text: "Расскажите о свойстве outline?" },
  { id: "97", answers: ['97'], text: "Расскажите о свойстве scrollbar-gutter?" },
  { id: "98", answers: ['98'], text: "Почему не стоит использовать краткую запись свойств CSS?" },
  { id: "99", answers: ['99'], text: "Назовите псевдоэлементы для подсветки текста?" },
  { id: "100", answers: ['100'], text: "Способы задания цвета в CSS?" },
  { id: "101", answers: ['101'], text: "Какие CSS-свойства используются для создания анимаций и плавных переходов?" },
  { id: "102", answers: ['102'], text: "Принципы и подходы для обеспечения масштабиельности и поддерживаемости CSS-кода?" },
  { id: "103", answers: ['103'], text: "Плюсы и минусы методологии БЭМ?" },
  { id: "104", answers: ['104'], text: "Какие CSS-препроцессоры вы знаете? Преимущества их использования?" },
  { id: "105", answers: ['105'], text: "Какое CSS-свойство используется для изменения порядка отображения элементов на веб-странице без изменения их физического расположения в HTML-коде?" },
  { id: "106", answers: ['106'], text: "Разница между псевдоклассами и псевдоэлементами?" },
  { id: "107", answers: ['107'], text: "Как создавать и поддерживать единый стиль CSS на больших проектах?" },
  { id: "108", answers: ['108'], text: "Что такое 'контейнерные запросы' (container queries)? Как они отличаются от медиазапросов (media queries)?" },

  { id: "109", answers: ['109'], text: "Типы данных в JavaScript?" },
  { id: "110", answers: ['110'], text: "Разница между == и === (нестрогое/строгое равенство)?" },
  { id: "111", answers: ['111'], text: "Что такое Strict mode в JavaScript?" },
  { id: "112", answers: ['112'], text: "Разница между function declaration и function expression?" },
  { id: "113", answers: ['113'], text: "Разница между null и undefined?" },
  { id: "114", answers: ['114'], text: "Типы таймеров в JavaScript?" },
  { id: "115", answers: ['115'], text: "Что такое поднятие (Hoisting)?" },
  { id: "116", answers: ['116'], text: "Что такое область видимости (Scope)?" },
  { id: "117", answers: ['117'], text: "Разница между var, let и const?" },
  { id: "118", answers: ['118'], text: "Что такое замыкание (Closure)?" },
  { id: "119", answers: ['119'], text: "Что обозначает this в JavaScript?" },
  { id: "120", answers: ['120'], text: "Что такое функции высшего порядка (Higher Order Functions)?" },
  { id: "121", answers: ['121'], text: "Как превратить любой тип данных в булевый? Перечислите ложные значения в JS?" },
  { id: "122", answers: ['122'], text: "Методы строк в JavaScript?" },
  { id: "123", answers: ['123'], text: "Методы массивов в JavaScript?" },
  { id: "124", answers: ['124'], text: "Что такое чистая функция?" },
  { id: "125", answers: ['125'], text: "Разница между .forEach() и .map()?" },
  { id: "126", answers: ['126'], text: "Разница между .call(), .apply() и bind()?" },
  { id: "127", answers: ['127'], text: "Почему в JS функции называют объектами первого класса?" },
  { id: "128", answers: ['128'], text: "Как определить наличие свойства в объекте?" },
  { id: "129", answers: ['129'], text: "Что такое IIFE?" },
  { id: "130", answers: ['130'], text: "Что такое псевдомассив arguments?" },
  { id: "131", answers: ['131'], text: "Разница между host-объектами и нативными объектами?" },
  { id: "132", answers: ['132'], text: "Почему результат сравнения 2х объектов это false?" },
  { id: "133", answers: ['133'], text: "Что такое прототипное наследование? Как создать объект без прототипа?" },
  { id: "134", answers: ['134'], text: "Почему расширение нативных JavaScript-объектов это плохая практика?" },
  { id: "135", answers: ['135'], text: "Что такое NaN? Как определить, что значение равно NaN?" },
  { id: "136", answers: ['136'], text: "Что такое объектная обертка (Wrapper Objects)?" },
  { id: "137", answers: ['137'], text: "Как в JavaScript создать объект?" },
  { id: "138", answers: ['138'], text: "Для чего используется ключевое слово new?" },
  { id: "139", answers: ['139'], text: "Операторы «И» и «ИЛИ» (&& и ||)?" },
  { id: "140", answers: ['140'], text: "Для чего используется оператор двойного отрицания (!!)?" },
  { id: "141", answers: ['141'], text: "Для чего используется оператор остатка (%)?" },
  { id: "142", answers: ['142'], text: "Как проверить, является ли значение массивом?" },
  { id: "143", answers: ['143'], text: "Как работает boxing/unboxing в JavaScript?" },
  { id: "144", answers: ['144'], text: "Что такое мемоизация? Реализуйте базовую логику функции для мемоизации?" },
  { id: "145", answers: ['145'], text: "Разница между оператором in и методом .hasOwnProperty()?" },
  { id: "146", answers: ['146'], text: "Разница между глубокой (deep) и поверхностной (shallow) копиями объекта? Как сделать каждую из них?" },
  { id: "147", answers: ['147'], text: "Что такое цепочка вызовов функций (chaining)? Как реализовать такой подход?" },
  { id: "148", answers: ['148'], text: "Что такое необъявленная переменная?" },
  { id: "149", answers: ['149'], text: "Как передаются параметры в функцию: по ссылке или по значению?" },
  { id: "150", answers: ['150'], text: "Что такое прототип объекта в JavaScript?" },
  { id: "151", answers: ['151'], text: "Как работает метод Object.create()?" },
  { id: "152", answers: ['152'], text: "Разниц между Object.freeze() и Object.seal()?" },
  { id: "153", answers: ['153'], text: "Разница между методами .slice() и .splice()?" },
  { id: "154", answers: ['154'], text: "Как работают методы .find(), .findIndex() и .indexOf()?" },
  { id: "155", answers: ['155'], text: "Плюсы и минусы использования use strict?" },
  { id: "156", answers: ['156'], text: "Разница между методами .push(), .pop(), .shift() и .unshift()?" },
  { id: "157", answers: ['157'], text: "Плюсы и минусы иммутабельности? Как достичь иммутабельности в JS?" },
  { id: "158", answers: ['158'], text: "Типы всплывающих окон в JavaScript?" },
  { id: "159", answers: ['159'], text: "Типы объектов JavaScript?" },
  { id: "160", answers: ['160'], text: "Парадигмы программирования в JavaScript?" },
  { id: "161", answers: ['161'], text: "Типы ошибок в JavaScript?" },
  { id: "162", answers: ['162'], text: "Разница между typeof и instanceof?" },
  { id: "163", answers: ['163'], text: "JavaScript статически, или динамически типизированный язык?" },
  { id: "164", answers: ['164'], text: "Что такое регулярное выражение (Regular Expression)?" },
  { id: "165", answers: ['165'], text: "Что такое рекурсия?" },
  { id: "166", answers: ['166'], text: "Что такое прототип (Prototype) объекта?" },
  { id: "167", answers: ['167'], text: "Какие методы используются в регулярных выражениях?" },
  { id: "168", answers: ['168'], text: "Что такое полифил (polyfill)?" },
  { id: "169", answers: ['169'], text: "Что такое switch/case? Правила использования switch/case?" },
  { id: "170", answers: ['170'], text: "Типы функций по способности принимать другие функции?" },
  { id: "171", answers: ['171'], text: "Что такое выражения (expression) и инструкции (statement) в JavaScript?" },
  { id: "172", answers: ['172'], text: "Разница между .some() и .every()?" },
  { id: "173", answers: ['173'], text: "Как сгенерировать случайное число в JavaScript?" },
  { id: "174", answers: ['174'], text: "Типы операторов в JavaScript?" },
  { id: "175", answers: ['175'], text: "Разница между параметром и аргументом функции?" },
  { id: "176", answers: ['176'], text: "Правила задания имён для переменных и функций в JavaScript?" },
  { id: "177", answers: ['177'], text: "Разница между явным и неявным преобразованием (Implicit and Explicit Coercion)?" },
  { id: "178", answers: ['178'], text: "Для чего применяется метод Array.from()?" },
  { id: "179", answers: ['179'], text: "Назовите способы преобразования массива в объект?" },
  { id: "180", answers: ['180'], text: "Разница между Object и Map?" },
  { id: "181", answers: ['181'], text: "Что такое каррирование?" },
  { id: "182", answers: ['182'], text: "Для чего используются метод Object.seal()?" },
  { id: "183", answers: ['183'], text: "Для чего используется свойство .dataset?" },
  { id: "184", answers: ['184'], text: "Каким образом можно обмениваться кодом между файлами?" },
  { id: "185", answers: ['185'], text: "Как работает «сборщик мусора» в JavaScript?" },
  { id: "186", answers: ['186'], text: "Что такое утечки памяти?" },
  { id: "187", answers: ['187'], text: "Назовите основные типы утечек памяти в JavaScript?" },
  { id: "188", answers: ['188'], text: "Как работает контекст выполнения (execution context) в JavaScript?" },
  { id: "189", answers: ['189'], text: "Разница между примитивом и объектом?" },
  { id: "190", answers: ['190'], text: "Что значит текст max call stack size exceeded в консоли?" },

  {
    id: "191",
    answers: ["191"],
    text: "Что такое DOM?",
  },
  {
    id: "192",
    answers: ["192"],
    text: "Типы узлов DOM-дерева?",
  },
  {
    id: "193",
    answers: ["193"],
    text: "Методы поиска элементов в DOM?",
  },
  {
    id: "194",
    answers: ["194"],
    text: "Свойства для перемещения по DOM-дереву?",
  },
  {
    id: "195",
    answers: ["195"],
    text: "Разница между attribute и property у DOM-элементов?",
  },
  {
    id: "196",
    answers: ["196"],
    text: "Что такое BOM?",
  },
  {
    id: "197",
    answers: ["197"],
    text: "Виды событий в JavaScript?",
  },
  {
    id: "198",
    answers: ["198"],
    text: "Как добавить обработчик события на DOM-элемент?",
  },
  {
    id: "199",
    answers: ["199"],
    text: "Как удалить обработчик события с DOM-элемента?",
  },
  {
    id: "200",
    answers: ["200"],
    text: "Что такое распространение события (Event Propagation)?",
  },
  {
    id: "201",
    answers: ["201"],
    text: "Что такое делегирование событий (Event Delegation)?",
  },
  {
    id: "202",
    answers: ["202"],
    text: "Как использовать media выражения в JavaScript?",
  },
  {
    id: "203",
    answers: ["203"],
    text: "Расскажите про координаты в браузере?",
  },
  {
    id: "204",
    answers: ["204"],
    text: "Разница между HTMLCollection и NodeList?",
  },
  {
    id: "205",
    answers: ["205"],
    text: "Как динамически добавить элемент на HTML-страницу?",
  },
  {
    id: "206",
    answers: ["206"],
    text:
      "Разница между feature detection, feature inference и анализом строки user-agent?",
  },
  {
    id: "207",
    answers: ["207"],
    text: "Разница между e.preventDefault() и e.stopPropagation()?",
  },
  {
    id: "208",
    answers: ["208"],
    text: "Разница между event.target и event.currentTarget?",
  },
  {
    id: "209",
    answers: ["209"],
    text: "Разница между .stopPropagation() и .stopImmediatePropagation()?",
  },
  {
    id: "210",
    answers: ["210"],
    text: "Разница между событиями load и DOMContentLoaded?",
  },
  {
    id: "211",
    answers: ["211"],
    text: "Сколько аргументов принимает addEventListener?",
  },
  {
    id: "212",
    answers: ["212"],
    text: "Разница между innerHTML и outerHTML?",
  },
  {
    id: "213",
    answers: ["213"],
    text: "Разница между JSON и XML?",
  },
  {
    id: "214",
    answers: ["214"],
    text: "Как узнать об использовании метода event.preventDefault()?",
  },
  {
    id: "215",
    answers: ["215"],
    text: "Для чего используется свойство window.navigator?",
  },
  {
    id: "216",
    answers: ["216"],
    text: "Для чего используется метод .focus()?",
  },
  {
    id: "217",
    answers: ["217"],
    text: "Для чего используется свойство .forms?",
  },
  {
    id: "218",
    answers: ["218"],
    text: "Для чего используется метод .scrollIntoView()?",
  },
  {
    id: "219",
    answers: ["219"],
    text: "Разница между методами .submit() и .requestSubmit()?",
  },
  {
    id: "220",
    answers: ["220"],
    text: "Расскажите о IntersectionObserver?",
  },
  {
    id: "221",
    answers: ["221"],
    text: "Расскажите о URLSearchParams?",
  },
  {
    id: "222",
    answers: ["222"],
    text: "Какие есть ограничения у window.close()?",
  },





  {
    id: "223",
    answers: ["223"],
    text: "Разница между синхронными и асинхронными функциями?",
  },
  {
    id: "224",
    answers: ["224"],
    text: "Что такое AJAX?",
  },
  {
    id: "225",
    answers: ["225"],
    text: "Что такое same-origin policy в контексте JavaScript?",
  },
  {
    id: "226",
    answers: ["226"],
    text: "Что такое цикл событий (event loop) и как он работает?",
  },
  {
    id: "227",
    answers: ["227"],
    text: "Разница между микро и макрозадачами в event loop?",
  },
  {
    id: "228",
    answers: ["228"],
    text: "Расскажите о queueMicrotask?",
  },
  {
    id: "229",
    answers: ["229"],
    text: "Что такое промисы (Promises)?",
  },
  {
    id: "230",
    answers: ["230"],
    text: "Плюсы и минусы использования Ajax?",
  },
  {
    id: "231",
    answers: ["231"],
    text: "Подходы при работе с асинхронным кодом?",
  },
  {
    id: "232",
    answers: ["232"],
    text: "Преимущества использовании промисов вместо колбэков?",
  },
  {
    id: "233",
    answers: ["233"],
    text: "Что такое callback-функция? Что такое Callback Hell?",
  },
  {
    id: "234",
    answers: ["234"],
    text: "Что такое async/await?",
  },
  {
    id: "235",
    answers: ["235"],
    text: "Разница между Promise.all(), Promise.any() и Promise.race()?",
  },
  {
    id: "236",
    answers: ["236"],
    text: "Расскажите про статический метод .allSettled()?",
  },
  {
    id: "237",
    answers: ["237"],
    text: "Плюсы и минусы асинхронного программирования в JavaScript?",
  },
  {
    id: "238",
    answers: ["238"],
    text: "Проблемы при использовании callback-функций?",
  },
  {
    id: "239",
    answers: ["239"],
    text: "Как выполнить несколько асинхронных операций последовательно?",
  },
  {
    id: "240",
    answers: ["240"],
    text: "Какие проблемы может вызвать неправильное использование асинхронности в JavaScript?",
  },







  {
    id: "261",
    answers: ["261"],
    text: "Что такое ECMAScript? В чём отличие от JavaScript?",
  },
  {
    id: "262",
    answers: ["262"],
    text: "Разница между let, const и var?",
  },
  {
    id: "263",
    answers: ["263"],
    text: "Можно ли изменить значение определённое через const?",
  },
  {
    id: "264",
    answers: ["264"],
    text: "Что такое временная мёртвая зона (temporal dead zone)?",
  },
  {
    id: "265",
    answers: ["265"],
    text: "Разница между Rest и Spread операторами?",
  },
  {
    id: "266",
    answers: ["266"],
    text: "Что такое деструктуризация?",
  },
  {
    id: "267",
    answers: ["267"],
    text: "Для чего используется цикл for…of?",
  },
  {
    id: "268",
    answers: ["268"],
    text: "Что такое шаблонные литералы (Template Literals)?",
  },
  {
    id: "269",
    answers: ["269"],
    text: "Что такое Set, Map, WeakMap и WeakSet?",
  },
  {
    id: "270",
    answers: ["270"],
    text: "Разница между обычными функциями и стрелочными?",
  },
  {
    id: "271",
    answers: ["271"],
    text: "Разница между методом Object.freeze() и const?",
  },
  {
    id: "272",
    answers: ["272"],
    text: "Что такое итераторы?",
  },
  {
    id: "273",
    answers: ["273"],
    text: "Что такое генераторы? Когда стоит использовать генераторы?",
  },
  {
    id: "274",
    answers: ["274"],
    text: "Что такое ES6 модули?",
  },
  {
    id: "275",
    answers: ["275"],
    text: "Что такое символ (Symbol) в ES6?",
  },
  {
    id: "276",
    answers: ["276"],
    text: "Для чего используется метод .includes()?",
  },
  {
    id: "277",
    answers: ["277"],
    text: "Для чего используется метод .getOwnPropertyDescriptors()?",
  },
  {
    id: "278",
    answers: ["278"],
    text: "Расскажите о методах .keys(), .values(), .entries()?",
  },
  {
    id: "279",
    answers: ["279"],
    text: "Для чего используется метод .fromEntries()?",
  },
  {
    id: "280",
    answers: ["280"],
    text: "Для чего используются методы .flat() и .flatMap()?",
  },
  {
    id: "281",
    answers: ["281"],
    text: "Для чего используются методы .padStart() и .padEnd()?",
  },
  {
    id: "282",
    answers: ["282"],
    text: "Для чего используются методы .startsWith() и .endsWith()?",
  },
  {
    id: "283",
    answers: ["283"],
    text: "Как в JavaScript удалять пробельные символы в начале и в конце строки?",
  },
  {
    id: "284",
    answers: ["284"],
    text: "Расскажите об операторе Optional Chaining (?.)?",
  },
  {
    id: "285",
    answers: ["285"],
    text: "Для чего используется метод .replaceAll()?",
  },
  {
    id: "286",
    answers: ["286"],
    text: "Что такое оператор логического присваивания?",
  },
  {
    id: "287",
    answers: ["287"],
    text: "Как увеличить читаемость больших чисел?",
  },
  {
    id: "288",
    answers: ["288"],
    text: "Что такое приватные аксессоры?",
  },
  {
    id: "289",
    answers: ["289"],
    text: "Разница между ES6-классами и конструкторами функций?",
  },
  {
    id: "290",
    answers: ["290"],
    text: "Что такое оператор нулевого слияния (??)?",
  },
  {
    id: "291",
    answers: ["291"],
    text: "В чём отличие оператора нулевого слияния (??) и оператора “ИЛИ” (||)?",
  },
  {
    id: "292",
    answers: ["292"],
    text: "Назовите основные методы и свойства работы с коллекцией Map?",
  },
  {
    id: "293",
    answers: ["293"],
    text: "Назовите основные методы и свойства работы с коллекцией Set?",
  },
  {
    id: "294",
    answers: ["294"],
    text: "Как осуществить перебор элементов в коллекциях Map и Set?",
  },








  {
    id: "295",
    answers: ["295"],
    text: "Что такое TypeScript?",
  },
  {
    id: "296",
    answers: ["296"],
    text: "Основные компоненты TypeScript?",
  },
  {
    id: "297",
    answers: ["297"],
    text: "Назовите особенности TypeScript?",
  },
  {
    id: "298",
    answers: ["298"],
    text: "Плюсы использования TypeScript?",
  },
  {
    id: "299",
    answers: ["299"],
    text: "Минусы использования TypeScript?",
  },
  {
    id: "300",
    answers: ["300"],
    text: "Типы в TypeScript?",
  },
  {
    id: "301",
    answers: ["301"],
    text: "Что такое декораторы?",
  },
  {
    id: "302",
    answers: ["302"],
    text: "Поддерживает ли TypeScript перегрузку функций?",
  },
  {
    id: "303",
    answers: ["303"],
    text: "Разница между типом (type) и интерфейсом (interface)?",
  },
  {
    id: "304",
    answers: ["304"],
    text: "Что такое JSX в TypeScript? Какие режимы JSX поддерживает TypeScript?",
  },
  {
    id: "305",
    answers: ["305"],
    text: "Что такое директивы с тремя наклонными чертами (Triple-Slash Directives), их типы?",
  },
  {
    id: "306",
    answers: ["306"],
    text: "Что такое внешние объявления переменных (ambient declaration) в TypeScript?",
  },
  {
    id: "307",
    answers: ["307"],
    text: "Разница между абстрактным классом (abstract class) и интерфейсом (interface)?",
  },
  {
    id: "308",
    answers: ["308"],
    text: "Какие элементы ООП поддерживаются в TypeScript?",
  },
  {
    id: "309",
    answers: ["309"],
    text: "Модификаторы доступа в TypeScript?",
  },
  {
    id: "310",
    answers: ["310"],
    text: "Разница между внутренним (Internal Module) и внешним модулями (External Module)?",
  },
  {
    id: "311",
    answers: ["311"],
    text: "Что такое декораторы в TypeScript?",
  },
  {
    id: "312",
    answers: ["312"],
    text: "Как TypeScript поддерживает необязательные и дефолтные параметры в функции?",
  },
  {
    id: "313",
    answers: ["313"],
    text: "Что такое перечисление (enum)?",
  },
  {
    id: "314",
    answers: ["314"],
    text: "Для чего в TypeScript используется NoImplicitAny?",
  },
  {
    id: "315",
    answers: ["315"],
    text: "Разница между типами “Объединение” (|) и “Пересечение” (&)?",
  },
  {
    id: "316",
    answers: ["316"],
    text: "Что такое общие типы (generic) в TypeScript?",
  },
  {
    id: "317",
    answers: ["317"],
    text: "Какие области видимости доступны в TypeScript?",
  },
  {
    id: "318",
    answers: ["318"],
    text: "Что такое .map файл, как и зачем его использовать?",
  },
  {
    id: "319",
    answers: ["319"],
    text: "Можно ли использовать TypeScript в серверной разработке?",
  },
  {
    id: "320",
    answers: ["320"],
    text: "Для чего в TypeScript используют ключевое слово declare?",
  },
  {
    id: "321",
    answers: ["321"],
    text: "Разница между типами void, never и unknown?",
  },
  {
    id: "322",
    answers: ["322"],
    text: "Как вы отлавливаете ошибки в TypeScript коде?",
  },











  {
    id: "323",
    answers: ["323"],
    text: "Что такое прогрессивный рендеринг?",
  },
  {
    id: "324",
    answers: ["324"],
    text: "Что такое прогрессивный SSR?",
  },
  {
    id: "325",
    answers: ["325"],
    text: "Что такое Progressive Web Application (PWA)?",
  },
  {
    id: "326",
    answers: ["326"],
    text: "Что такое кроссбраузерность?",
  },
  {
    id: "327",
    answers: ["327"],
    text: "Что такое OSI модель?",
  },
  {
    id: "328",
    answers: ["328"],
    text: "Что такое поток документа?",
  },
  {
    id: "329",
    answers: ["329"],
    text: "Разница между адаптивным (adaptive) и отзывчивым (responsive) дизайнами?",
  },
  {
    id: "330",
    answers: ["330"],
    text: "Разница между Progressive Enhancement и Graceful Degradation?",
  },
  {
    id: "331",
    answers: ["331"],
    text: "Что такое Веб-компоненты и какие технологии в них используются?",
  },
  {
    id: "332",
    answers: ["332"],
    text: "Особенности разработки мультиязычных сайтов?",
  },
  {
    id: "333",
    answers: ["333"],
    text: "Что такое REST?",
  },
  {
    id: "334",
    answers: ["334"],
    text: "Что такое REST и RESTful api?",
  },
  {
    id: "335",
    answers: ["335"],
    text: "Принципы REST-архитектуры?",
  },
  {
    id: "336",
    answers: ["336"],
    text: "Что такое модель зрелости Ричардсона?",
  },
  {
    id: "337",
    answers: ["337"],
    text: "Основные уровни модели зрелости Ричардсона?",
  },
  {
    id: "338",
    answers: ["338"],
    text: "Назовите критические этапы рендеринга?",
  },
  {
    id: "339",
    answers: ["339"],
    text: "Разница между layout, painting и compositing?",
  },
  {
    id: "340",
    answers: ["340"],
    text: "Что такое Flash Of Unstyled Content (FOUC)? Как его избежать?",
  },
  {
    id: "341",
    answers: ["341"],
    text: "Что такое History API в браузере?",
  },
  {
    id: "342",
    answers: ["342"],
    text: "Что такое веб-хранилище (web storage)?",
  },
  {
    id: "343",
    answers: ["343"],
    text: "Разница между cookie, sessionStorage и localStorage?",
  },
  {
    id: "344",
    answers: ["344"],
    text: "Способы уменьшения времени загрузки веб-страницы?",
  },
  {
    id: "345",
    answers: ["345"],
    text: "Что такое Core Web Vitals? Какие основные метрики туда входят?",
  },
  {
    id: "346",
    answers: ["346"],
    text: "Расскажите о метриках Core Web Vitals?",
  },
  {
    id: "347",
    answers: ["347"],
    text: "Разница между preload, prefetch, preconnect и prerender?",
  },
  {
    id: "348",
    answers: ["348"],
    text: "Для чего нужен паттерн PRPL?",
  },













  {
    id: "349",
    answers: ["349"],
    text: "Что такое HTTP?",
  },
  {
    id: "350",
    answers: ["350"],
    text: "Из чего состоит HTTP-запрос?",
  },
  {
    id: "351",
    answers: ["351"],
    text: "Какие методы может иметь HTTP-запрос?",
  },
  {
    id: "352",
    answers: ["352"],
    text: "Что такое HTTP cookie? Для чего они используются?",
  },
  {
    id: "353",
    answers: ["353"],
    text: "Разница между HTTP и HTTPS?",
  },
  {
    id: "354",
    answers: ["354"],
    text: "Разница между HTTP/1 и HTTP/2?",
  },
  {
    id: "355",
    answers: ["355"],
    text: "Как работает мультиплексирование в HTTP/2?",
  },
  {
    id: "356",
    answers: ["356"],
    text: "Что такое 'трехстороннее рукопожатие' (Triple handshake)?",
  },
  {
    id: "357",
    answers: ["357"],
    text: "Разница между PUT- и POST-запросами?",
  },
  {
    id: "358",
    answers: ["358"],
    text: "Разница между протоколами TCP и UDP?",
  },
  {
    id: "359",
    answers: ["359"],
    text: "Что такое WebSocket? В чем принцип его работы?",
  },
  {
    id: "360",
    answers: ["360"],
    text: "Разница между Long-Polling, Websockets и Server-Sent Events?",
  },
  {
    id: "361",
    answers: ["361"],
    text: "Как работает JSONP?",
  },
  {
    id: "362",
    answers: ["362"],
    text: "Что такое IndexedDB в браузере? Преимущества IndexedDB?",
  },
  {
    id: "363",
    answers: ["363"],
    text: "Что такое Service Workers?",
  },
  {
    id: "364",
    answers: ["364"],
    text: "Что такое Web Workers?",
  },
  {
    id: "365",
    answers: ["365"],
    text: "Что такое Web Worklet?",
  },
  {
    id: "366",
    answers: ["366"],
    text: "Что такое SSL/TLS? Зачем они используются в веб-разработке?",
  },
  {
    id: "367",
    answers: ["367"],
    text: "Механизм устанавки сеанса между клиентом и сервером?",
  },
  {
    id: "368",
    answers: ["368"],
    text: "Что такое API?",
  },
  {
    id: "369",
    answers: ["369"],
    text: "Что такое CDN?",
  },
  {
    id: "370",
    answers: ["370"],
    text: "Что такое IP-адрес?",
  },
  {
    id: "371",
    answers: ["371"],
    text: "Разница между host и domain?",
  },
  {
    id: "372",
    answers: ["372"],
    text: "Разница между URI и URL?",
  },
  {
    id: "373",
    answers: ["373"],
    text: "Почему очищать кэш важно? Как это можно сделать?",
  },
  {
    id: "374",
    answers: ["374"],
    text: "Разница между идентификацией, аутентификацией, авторизацией?",
  },
  {
    id: "375",
    answers: ["375"],
    text: "Виды аутентификации?",
  },
  {
    id: "376",
    answers: ["376"],
    text: "Что такое безопасные (Secure) и HttpOnly cookies?",
  },
  {
    id: "377",
    answers: ["377"],
    text: "Что такое Content Security Policy (CSP)?",
  },
  {
    id: "378",
    answers: ["378"],
    text: "Что такое CORS?",
  },
  {
    id: "379",
    answers: ["379"],
    text: "Что такое межсайтовый скриптинг (XSS)?",
  },
  {
    id: "380",
    answers: ["380"],
    text: "Методы повышения безопасности веб-приложений?",
  },
  {
    id: "381",
    answers: ["381"],
    text: "Что такое OWASP Top 10?",
  },











  {
    id: "382",
    answers: ["382"],
    text: "Основные принципы ООП?",
  },
  {
    id: "383",
    answers: ["383"],
    text: "Что такое SOLID?",
  },
  {
    id: "384",
    answers: ["384"],
    text: "Разница между классовым и прототипным наследованием?",
  },
  {
    id: "385",
    answers: ["385"],
    text: "Однонаправленный поток данных и двусторонняя связь данных? В чем между ними разница?",
  },
  {
    id: "386",
    answers: ["386"],
    text: "Что такое функциональное программирование?",
  },
  {
    id: "387",
    answers: ["387"],
    text: "Что такое MVC?",
  },
  {
    id: "388",
    answers: ["388"],
    text: "Что такое MVVM?",
  },
  {
    id: "389",
    answers: ["389"],
    text: "Что такое MVP?",
  },
  {
    id: "390",
    answers: ["390"],
    text: "Недостатки паттерна MVW?",
  },
  {
    id: "391",
    answers: ["391"],
    text: "Разница между функцией и методом?",
  },
  {
    id: "392",
    answers: ["392"],
    text: "Что такое каррирование (Currying)?",
  },
  {
    id: "393",
    answers: ["393"],
    text: "Разница между ООП и ФП в JavaScript?",
  },
  {
    id: "394",
    answers: ["394"],
    text: "Плюсы и минусы ФП и ООП?",
  },
  {
    id: "395",
    answers: ["395"],
    text: "Разница между монолитной и микросервисной архитектурами?",
  },
  {
    id: "396",
    answers: ["396"],
    text: "Плюсы и минусы монолитной и микросервисной архитектур?",
  },
  {
    id: "397",
    answers: ["397"],
    text: "Какие принципы можно использовать вместе с наследованием?",
  },
  {
    id: "398",
    answers: ["398"],
    text: "Какие ещё принципы кроме SOLID вы знаете?",
  },
  {
    id: "399",
    answers: ["399"],
    text: "Что такое дескрипторы свойств объектов?",
  },
  {
    id: "400",
    answers: ["400"],
    text: "В чем заключаются особенности геттеров и сеттеров?",
  },
  {
    id: "401",
    answers: ["401"],
    text: "Что такое статический метод класса (static)? Как осуществляется его вызов?",
  },
  {
    id: "402",
    answers: ["402"],
    text: "Разница между композицией и наследованием?",
  },
  {
    id: "403",
    answers: ["403"],
    text: "Что такое композиция в контексте JavaScript?",
  },
  {
    id: "404",
    answers: ["404"],
    text: "Что такое паттерн, или шаблон проектирования?",
  },
  {
    id: "405",
    answers: ["405"],
    text: "Типы паттернов?",
  },
  {
    id: "406",
    answers: ["406"],
    text: "Что такое GOF паттерны?",
  },
  {
    id: "407",
    answers: ["407"],
    text: "Что такое GRASP паттерны?",
  },
  {
    id: "408",
    answers: ["408"],
    text: "Типы полиморфизма?",
  },
  {
    id: "409",
    answers: ["409"],
    text: "Можно ли в JavaScript реализовать абстрактный класс и как это сделать?",
  },
  {
    id: "410",
    answers: ["410"],
    text: "Как работает механизм прототипов в JavaScript?",
  },
  {
    id: "411",
    answers: ["411"],
    text: "Основные принципы функционального программирования?",
  },
  {
    id: "412",
    answers: ["412"],
    text: "Плюсы функционального программирования?",
  },
  {
    id: "413",
    answers: ["413"],
    text: "Разница между императивным и декларативным подходами программирования?",
  },
  {
    id: "414",
    answers: ["414"],
    text: "Что такое реактивное программирование?",
  },
  {
    id: "415",
    answers: ["415"],
    text: "Плюсы и минусы реактивного программирования?",
  },
  {
    id: "416",
    answers: ["416"],
    text: "Что такое Inversion of control?",
  },
  {
    id: "417",
    answers: ["417"],
    text: "Что такое Dependency injection?",
  },
  {
    id: "418",
    answers: ["418"],
    text: "Разница между агрегацией и композицией?",
  },
  {
    id: "419",
    answers: ["419"],
    text: "Разница между процедурным и функциональным программированием?",
  },








  {
    id: "420",
    answers: ["420"],
    text: "Accessibility: Что такое WCAG?",
  },
  {
    id: "421",
    answers: ["421"],
    text: "Основные принципы доступности?",
  },
  {
    id: "422",
    answers: ["422"],
    text: "Что такое скринридер?",
  },
  {
    id: "423",
    answers: ["423"],
    text: "Уровни доступности?",
  },
  {
    id: "424",
    answers: ["424"],
    text: "Как скрыть содержимое тэга от скринридеров?",
  },
  {
    id: "425",
    answers: ["425"],
    text: "Как удалить семантику у элемента?",
  },
  {
    id: "426",
    answers: ["426"],
    text: "Что такое ARIA роли в веб приложении?",
  },
  {
    id: "427",
    answers: ["427"],
    text: "Для чего используется атрибут aria-roledescription?",
  },
  {
    id: "428",
    answers: ["428"],
    text: "Какие HTML атрибуты можно использовать для улучшения доступности?",
  },
  {
    id: "429",
    answers: ["429"],
    text: "Назовите средства и методы тестирования доступности?",
  },
  {
    id: "430",
    answers: ["430"],
    text: "Какие стандарты доступности следует учитывать при разработке?",
  },
  {
    id: "431",
    answers: ["431"],
    text: "Разница между usability и accessibility?",
  },
  {
    id: "432",
    answers: ["432"],
    text: "Что нужно учитывать при разработке доступного сайта?",
  },










  { id: "433", answers: ["433"], text: "Что такое React?" },
  { id: "434", answers: ["434"], text: "Какие основные преимущества его использования в веб-разработке?" },
  { id: "435", answers: ["435"], text: "Перечислите особенности React?" },
  { id: "436", answers: ["436"], text: "Что такое компоненты в React? Как создать функциональный и классовый компонент?" },
  { id: "437", answers: ["437"], text: "Что такое Virtual DOM в React? Какие преимущества он предоставляет при обновлении интерфейса?" },
  { id: "438", answers: ["438"], text: "Для чего нужен атрибут key при рендере списков?" },
  { id: "439", answers: ["439"], text: "Что такое PureComponent?" },
  { id: "440", answers: ["440"], text: "Что такое Компонент высшего порядка (Higher-Order Component/HOC)? Какие задачи они решают?" },
  { id: "441", answers: ["441"], text: "Разница между управляемыми (controlled) и не управляемыми (uncontrolled) компонентами?" },
  { id: "442", answers: ["442"], text: "Что такое жизненный цикл компонента (component lifecycle) в React?" },
  { id: "443", answers: ["443"], text: "Методы жизненного цикла компонента в React" },
  { id: "444", answers: ["444"], text: "Стадии жизненного цикла компонента в React?" },
  { id: "445", answers: ["445"], text: "Какие методы можно использовать для обработки событий в React?" },
  { id: "446", answers: ["446"], text: "Что такое React Reconciliation?" },
  { id: "447", answers: ["447"], text: "Что такое портал (Portal)?" },
  { id: "448", answers: ["448"], text: "Что такое контекст (Context) в React и для чего он используется?" },
  { id: "449", answers: ["449"], text: "Что такое React хуки (Hooks), какие хуки вы знаете и для чего они используются?" },
  { id: "450", answers: ["450"], text: "Что Такое JSX?" },
  { id: "451", answers: ["451"], text: "Разница между состоянием(state) и пропсами(props)? Как они используются?" },
  { id: "452", answers: ["452"], text: "Как передать данные от родительского компонента к дочернему компоненту в React?" },
  { id: "453", answers: ["453"], text: "Какие методы можно использовать для обработки с в React?" },
  { id: "454", answers: ["454"], text: "Как работает управление состоянием (state management) в больших React-приложениях? Назовите библиотеки или подходы, которые вы использовали." },
  { id: "455", answers: ["455"], text: "Что такое React Fiber?" },
  { id: "456", answers: ["456"], text: "Что такое фрагмент (Fragment)? Почему фрагмент лучше, чем div?" },
  { id: "457", answers: ["457"], text: "Что такое React-ссылка (ref)? Как создать ссылку?" },
  { id: "458", answers: ["458"], text: "Разница между теневым (Shadow) и виртуальным (Virtual) DOM?" },
  { id: "459", answers: ["459"], text: "Назовите преимущества использования React?" },
  { id: "460", answers: ["460"], text: "Что такое условный рендеринг (Conditional Rendering)? Как его выполнить?" },
  { id: "461", answers: ["461"], text: "Что такое компонент-переключатель (Switching Component)?" },
  { id: "462", answers: ["462"], text: "Разница между React и ReactDOM?" },
  { id: "463", answers: ["463"], text: "Разница между компонентом и контейнером?" },
  { id: "464", answers: ["464"], text: "Как React обрабатывает, или ограничивает использование пропсов определенного типа?" },
  { id: "465", answers: ["465"], text: "Что такое строгий режим в React? Его преимущества?" },
  { id: "466", answers: ["466"], text: "Что такое «бурение пропсов» (Prop Drilling)? Как его избежать?" },
  { id: "467", answers: ["467"], text: "Что такое «опрос» (Polling)? Как его реализовать в React?" },
  { id: "468", answers: ["468"], text: "Разница между элементом и компонентом?" },
  { id: "469", answers: ["469"], text: "Что такое ReactDOMServer?" },
  { id: "470", answers: ["470"], text: "Что такое предохранители (Error Boundaries)?" },
  { id: "471", answers: ["471"], text: "Что такое «ленивая» (Lazy) функция?" },
  { id: "472", answers: ["472"], text: "Разница между рендерингом и монтированием?" },
  { id: "473", answers: ["473"], text: "Что такое сhildren?" },
  { id: "474", answers: ["474"], text: "Что такое события указателя (Pointer Events)?" },
  { id: "475", answers: ["475"], text: "Что такое инверсия наследования (Inheritance Inversion)?" },
  { id: "476", answers: ["476"], text: "Как в React реализовать двустороннее связывание данных?" },
  { id: "477", answers: ["477"], text: "Разница между классовым и функциональным компонентами?" },
  { id: "478", answers: ["478"], text: "Разница между useEffect() и componentDidMount()?" },
  { id: "479", answers: ["479"], text: "Преимущества хуков?" },
  { id: "480", answers: ["480"], text: "Недостатки хуков?" },
  { id: "481", answers: ["481"], text: "Правила (ограничения) использования хуков?" },
  { id: "482", answers: ["482"], text: "Что такое поднятие состояния вверх (Lifting State Up)?" },
  { id: "483", answers: ["483"], text: "Что делает метод shouldComponentUpdate?" },
  { id: "484", answers: ["484"], text: "Разница между createElement() и cloneElement()?" },
  { id: "485", answers: ["485"], text: "Что такое useReducer()?" },
  { id: "486", answers: ["486"], text: "Как реализовать однократное выполнение операции при начальном рендеринге?" },
  { id: "487", answers: ["487"], text: "Что такое распределенный компонент?" },
  { id: "488", answers: ["488"], text: "Расскажите о хуках useCallback(), useMemo(), useImperativeHandle(), useLayoutEffect()?" },
  { id: "489", answers: ["489"], text: "Как отрендерить HTML код в React-компоненте?" },
  { id: "490", answers: ["490"], text: "Зачем в setState() нужно передавать функцию?" },
  { id: "491", answers: ["491"], text: "Для чего предназначен метод registerServiceWorker() в React?" },
  { id: "492", answers: ["492"], text: "Как организовать маршрутизацию (routing) в React-приложении?" },
  { id: "493", answers: ["493"], text: "Какие библиотеки или инструменты для маршрутизации вы использовали?" },
  { id: "494", answers: ["494"], text: "Чем React Router отличается от обычной маршрутизации?" },
  { id: "495", answers: ["495"], text: "Какие хуки были добавлены в React Router версии 5?" },
  { id: "496", answers: ["496"], text: "Как передавать пропсы в React Router?" },
  { id: "497", answers: ["497"], text: "Что такое Reselect и как он работает?" },
  { id: "498", answers: ["498"], text: "Назовите основную цель React Fiber?" },
  { id: "499", answers: ["499"], text: "Какие типы данных может возвращать render?" },
  { id: "500", answers: ["500"], text: "Разница между memo и useMemo?" },
  { id: "501", answers: ["501"], text: "Что такое синтетические события (SyntheticEvent) в React?" },
  { id: "502", answers: ["502"], text: "Является ли React реактивным?" },
  { id: "503", answers: ["503"], text: "Техники оптимизации перфоманса React?" },
  { id: "504", answers: ["504"], text: "Лучшие практики безопасности в React?" },
  { id: "505", answers: ["505"], text: "Какие инструменты и библиотеки для тестирования React-компонентов вы использовали?" },
  { id: "506", answers: ["506"], text: "Какие принципы тестирования React-приложений вы соблюдаете?" },


  { id: "507", answers: ["507"], text: "Что такое Vue.js?" },
  { id: "508", answers: ["508"], text: "Перечислите особенности Vue.js?" },
  { id: "509", answers: ["509"], text: "Перечислите преимущества Vue.js?" },
  { id: "510", answers: ["510"], text: "Назовите хуки жизненного цикла компонента во Vue.js?" },
  { id: "511", answers: ["511"], text: "Опишите жизненный цикл компонента во Vue.js?" },
  { id: "512", answers: ["512"], text: "Что такое условные директивы (conditional directives)?" },
  { id: "513", answers: ["513"], text: "Разница между директивами v-show и v-if?" },
  { id: "514", answers: ["514"], text: "Что такое вычисляемые свойства?" },
  { id: "515", answers: ["515"], text: "Какие модификаторы событий предоставляет Vue.js?" },
  { id: "516", answers: ["516"], text: "Какие модификаторы кнопок предоставляет Vue.js?" },
  { id: "517", answers: ["517"], text: "Какие модификаторы кнопок мыши предоставляет Vue.js?" },
  { id: "518", answers: ["518"], text: "Что такое компонент?" },
  { id: "519", answers: ["519"], text: "Что такое пропсы? Типы пропсов?" },
  { id: "520", answers: ["520"], text: "Разница между локальной и глобальной регистрацией компонента?" },
  { id: "521", answers: ["521"], text: "Что такое миксины Vue.js?" },
  { id: "522", answers: ["522"], text: "Что такое Vue CLI?" },
  { id: "523", answers: ["523"], text: "Что такое Vuex?" },
  { id: "524", answers: ["524"], text: "Что общего у React и Vue.js?" },
  { id: "525", answers: ["525"], text: "Разница между React и Vue.js?" },
  { id: "526", answers: ["526"], text: "Разница между Angular и Vue.js?" },
  { id: "527", answers: ["527"], text: "Что такое SFC? Какие проблемы он решает?" },
  { id: "528", answers: ["528"], text: "Как реализована реактивность во Vue2 и Vue3?" },
  { id: "529", answers: ["529"], text: "Что такое Vue Router? Назовите его особенности?" },
  { id: "530", answers: ["530"], text: "Что такое вложенные роуты (Routes)?" },
  { id: "531", answers: ["531"], text: "Что такое фильтры? Как создать цепочку фильтров?" },
  { id: "532", answers: ["532"], text: "Перечислите варианты коммуникации компонентов во Vue.js?" },
  { id: "533", answers: ["533"], text: "Какие модификаторы поддерживаются в модели (v-model)?" },
  { id: "534", answers: ["534"], text: "Что такое плагины? Какие возможности дают плагины для Vue.js?" },
  { id: "535", answers: ["535"], text: "Что такое слот (<slot>) во Vue.js?" },
  { id: "536", answers: ["536"], text: "Какие хуки предоставляют директивы?" },
  { id: "537", answers: ["537"], text: "Что такое аргументы директивных хуков?" },
  { id: "538", answers: ["538"], text: "Что такое vue-loader?" },
  { id: "539", answers: ["539"], text: "Что такое рендер-функция (render function)? Преимущества рендер-функции?" },
  { id: "540", answers: ["540"], text: "Что такое динамические (<keep-alive>) компоненты?" },
  { id: "541", answers: ["541"], text: "Что такое асинхронные компоненты?" },


  { id: "542", answers: ["542"], text: "Что такое Angular?" },
{ id: "543", answers: ["543"], text: "Разница между AngularJS и Angular?" },
{ id: "544", answers: ["544"], text: "Методы жизненного цикла Angular компонента?" },
{ id: "545", answers: ["545"], text: "Разница между constructor и ngOnInit?" },
{ id: "546", answers: ["546"], text: "Что такое Data Binding в Angular?" },
{ id: "547", answers: ["547"], text: "Разница между AOT и JIT?" },
{ id: "548", answers: ["548"], text: "Что такое Change Detection, как работает механизм Change Detection?" },
{ id: "549", answers: ["549"], text: "Что такое ngZone?" },
{ id: "550", answers: ["550"], text: "Cтратегии обнаружения изменений в Angular?" },
{ id: "551", answers: ["551"], text: "Что такое декораторы в TypeScript?" },
{ id: "552", answers: ["552"], text: "Назовите плюсы использования Angular?" },
{ id: "553", answers: ["553"], text: "Назовите минусы использования Angular?" },
{ id: "554", answers: ["554"], text: "Что такое внедрение зависимостей в Angular?" },
{ id: "555", answers: ["555"], text: "Что такое директивы в Angular?" },
{ id: "556", answers: ["556"], text: "Для чего нужны директивы <ng-template>, <ng-container>, <ng-content>?" },
{ id: "557", answers: ["557"], text: "Что такое динамические компоненты в Angular?" },
{ id: "558", answers: ["558"], text: "Назовите последовательность действий для отображения динамического компонента?" },
{ id: "559", answers: ["559"], text: "Основные формы привязки данных в Angular?" },
{ id: "560", answers: ["560"], text: "Типы стратегий загрузки в Angular?" },
{ id: "561", answers: ["561"], text: "Что такое роутинг и как его создать в Angular?" },
{ id: "562", answers: ["562"], text: "Что такое интерполяция в Angular?" },
{ id: "563", answers: ["563"], text: "Жизненный цикл в Angular Router?" },
{ id: "564", answers: ["564"], text: "Разница между RouterModule.forRoot() и RouterModule.forChild()?" },
{ id: "565", answers: ["565"], text: "Когда нужно использовать ngrx/store?" },
{ id: "566", answers: ["566"], text: "Разница между умным и презентационным компонентами?" },
{ id: "567", answers: ["567"], text: "Разница между @ViewChild() и @ContentChild()?" },
{ id: "568", answers: ["568"], text: "Что такое template variable? Как ее использовать?" },
{ id: "569", answers: ["569"], text: "Что такое View Encapsulation?" },
{ id: "570", answers: ["570"], text: "Как можно хранить данные в Angular?" },
{ id: "571", answers: ["571"], text: "Когда нужно использовать стандартные (template driven), а когда реактивные (reactive) формы?" },
{ id: "572", answers: ["572"], text: "Как внедрить сервис в Angular приложение?" },
{ id: "573", answers: ["573"], text: "Как улучшить производительность Angular приложения?" },
{ id: "574", answers: ["574"], text: "Разница между компонентом и модулем в Angular?" },
{ id: "575", answers: ["575"], text: "Как защитит компонент активируемый через роутер?" },
{ id: "576", answers: ["576"], text: "Разницу между Promise и Observable в Angular?" },
{ id: "577", answers: ["577"], text: "Разница между declarations, providers и import в NgModule?" },
{ id: "578", answers: ["578"], text: "Что такое реактивное программирование? Как оно используется в Angular?" },
{ id: "579", answers: ["579"], text: "Лучшие практики безопасности в Angular?" },
{ id: "580", answers: ["580"], text: "Разница между BehaviorSubject и Observable?" },
{ id: "581", answers: ["581"], text: "Приведите хороший пример использования NgZone сервиса?" },
{ id: "582", answers: ["582"], text: "Как сделать компонент для показа сообщений об ошибках?" },
{ id: "583", answers: ["583"], text: "Как передать данные из дочернего компонента в родительский?" },
{ id: "584", answers: ["584"], text: "Разница между NgForm, FormGroup, и FormControl?" },
{ id: "585", answers: ["585"], text: "Что такое Shared модуль?" },
{ id: "586", answers: ["586"], text: "Почему импортировать сервис из SharedModule в lazy loaded модуль считается плохой практикой?" },
{ id: "587", answers: ["587"], text: "Разница между switchMap, concatMap и mergeMap?" },
{ id: "588", answers: ["588"], text: "Разница между BehaviorSubject, ReplaySubject и AsyncSubject?" },
{ id: "589", answers: ["589"], text: "Принцип работы ChangeDetectionStrategy.onPush?" },
{ id: "590", answers: ["590"], text: "Что такое пайп (pipe) в Angular? Разница между чистыми и нечистыми пайпами?" },
{ id: "591", answers: ["591"], text: "Назовите ключевые компоненты Angular?" },
{ id: "592", answers: ["592"], text: "Разница между компонентом и директивой?" },
{ id: "593", answers: ["593"], text: "Что такое HttpClient, перечислите его преимущества?" },
{ id: "594", answers: ["594"], text: "Что такое пользовательский элемент (Custom Element)? Как он работает?" },
{ id: "595", answers: ["595"], text: "Как трансформировать Angular-компоненты в пользовательские элементы?" },
{ id: "596", answers: ["596"], text: "Назовите преимущества AOT компиляции?" },
{ id: "597", answers: ["597"], text: "Преимущества использования сервис-воркеров в Angular приложении?" },
{ id: "598", answers: ["598"], text: "Что такое платформа в Angular?" },
{ id: "599", answers: ["599"], text: "Для чего используется связка ngFor и trackBy?" },


{ id: "600", answers: ["600"], text: "Что такое Redux и какие основные преимущества его использования в управлении состоянием в React-приложениях?" },
{ id: "601", answers: ["601"], text: "Какие основные концепции существуют в Redux, и как они связаны между собой (Store, Actions, Reducers)?" },
{ id: "602", answers: ["602"], text: "Что представляет собой хранилище (Store) в Redux? Какие методы и свойства хранилища вы знаете?" },
{ id: "603", answers: ["603"], text: "Как создать действие (Action) в Redux? Какие типы действий могут существовать?" },
{ id: "604", answers: ["604"], text: "Какие методы для обновления состояния существуют в Redux? Как работает диспетчер (Dispatcher)?" },
{ id: "605", answers: ["605"], text: "В чем разница между синхронными и асинхронными действиями в Redux?" },
{ id: "606", answers: ["606"], text: "Что такое редюсер (Reducer) в Redux и какой его основной принцип работы?" },
{ id: "607", answers: ["607"], text: "Как организовать комбинирование нескольких редюсеров в один корневой редюсер?" },
{ id: "608", answers: ["608"], text: "Какие библиотеки или инструменты для работы с Redux вы использовали (например, Redux Thunk, Redux Saga, Reselect)?" },
{ id: "609", answers: ["609"], text: "Что такое селекторы (Selectors) в Redux и для чего они используются?" },
{ id: "610", answers: ["610"], text: "Какие методы для подключения Redux к React-приложению вы знаете (например, connect из react-redux)?" },
{ id: "611", answers: ["611"], text: "Что такое middleware в Redux и для чего они могут быть использованы? Упомяните некоторые сторонние middleware для Redux." },
{ id: "612", answers: ["612"], text: "Как обрабатывать асинхронные операции в Redux-приложении? Какие подходы к асинхронности вы предпочитаете?" },
{ id: "613", answers: ["613"], text: "Как организовать хранение и обработку глобальных настроек или данных в Redux?" },
{ id: "614", answers: ["614"], text: "Какие методы для отладки Redux-приложений вы используете? Упомяните инструменты или расширения для браузеров." },


{ id: "615", answers: ["615"], text: "Что такое Redux Toolkit и какие основные преимущества его использования по сравнению с чистым Redux?" },
{ id: "616", answers: ["616"], text: "Какие ключевые функции и инструменты предоставляет Redux Toolkit для упрощения работы с Redux?" },
{ id: "617", answers: ["617"], text: "Как создать хранилище (Store) с использованием Redux Toolkit? Какие функции и методы для этого предоставляются?" },
{ id: "618", answers: ["618"], text: "Что такое срезы (Slices) в Redux Toolkit и для чего они используются? Как создать срез?" },
{ id: "619", answers: ["619"], text: "Какие методы в Redux Toolkit позволяют создавать действия (Actions) и редюсеры (Reducers) с более компактным синтаксисом?" },
{ id: "620", answers: ["620"], text: "Как организовать асинхронные операции с использованием Redux Toolkit? Какой middleware часто используется с ним?" },
{ id: "621", answers: ["621"], text: "Каким образом Redux Toolkit управляет созданием уникальных идентификаторов для действий и редюсеров?" },
{ id: "622", answers: ["622"], text: "Какие методы в Redux Toolkit позволяют обновлять состояние (state) с минимальной боли?" },
{ id: "623", answers: ["623"], text: "Какие преимущества приносит автоматическое создание селекторов (Selectors) с использованием Redux Toolkit?" },
{ id: "624", answers: ["624"], text: "Как организовать код с использованием 'данных на стороне сервера' (Server-Driven Data) с Redux Toolkit?" },
{ id: "625", answers: ["625"], text: "Как можно управлять и мониторить производительность при использовании Redux Toolkit? Какие инструменты или подходы вы знаете?" },
{ id: "626", answers: ["626"], text: "В чем состоит разница между Redux Toolkit и Redux Toolkit Query? Какой подход предпочтительнее в каких ситуациях?" },
{ id: "627", answers: ["627"], text: "Какие структуры и шаблоны проекта вы используете с Redux Toolkit для организации кода?" },
{ id: "628", answers: ["628"], text: "Как обеспечивается совместимость Redux Toolkit с другими библиотеками или инструментами в экосистеме React и Redux?" },
{ id: "629", answers: ["629"], text: "Какие есть лучшие практики и советы по использованию Redux Toolkit в больших и сложных приложениях?" },

];
