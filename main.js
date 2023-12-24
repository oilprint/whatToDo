const participants = document.querySelector('.participants');
const activity = document.querySelector('.activity-type');
const btnGetActivity = document.querySelector('.js_getActivity');
const btnGetLoading = document.querySelector('.js_loading');
const btnAddToList = document.querySelector('.js_addToList');
const textField = document.querySelector('.activity-text');
const textTranslated = document.querySelector('.translated-text');
const rightSide = document.querySelector('.right-side');
const activityList = document.querySelector('.activity-list');
const activityCard = document.querySelector('.activity-card');
const activityCardContent = document.querySelector('.activity-card__content');
const activityCardList = document.querySelector('.activity-list');
const errorCard = document.querySelector('.error-card');
const imageList = document.querySelector('.images');
let activityAPI, textToTranslate;
let allActivities = JSON.parse(localStorage.getItem('allActivity')) || [];

const filterSettings =  JSON.parse(localStorage.getItem('filters')) || {
  'participants': '',
  'type': ''
};

let newActivityObj;

updateActivityCardList(allActivities);
updateFiltersItems();
filterAllActivity();

function updateActivityCardList(arr) {
  activityCardList.innerHTML = '';
  arr.forEach(el => {
    addActivityOnPage(el)
  }) 
  if (arr.length === 0) {
    rightSide.classList.add('hidden');
    
  } else {
    rightSide.classList.remove('hidden');
  }
};

function clearRightSide(){
  rightSide.classList.add('hidden');
  activityCard.classList.remove('show');
};

function addFilterItem(key) {
  document.querySelector('.filters').insertAdjacentHTML('beforeend', `
  <li class="filters__item" data-filter=${key}>
  <div class="filters__text icon icon-${key}">${filterSettings[key]}</div>
  <button class="filters__btn icon icon-remove"></button>
</li>`)
};

function updateFiltersItems() {
  document.querySelector('.filters').innerHTML = '';
  for (let key in filterSettings) {
    if (filterSettings[key].length > 0) {
      addFilterItem(key);
    }
  };
};

function createNewActivity(item) {
  newActivityObj = {
    id: Math.floor(Math.random() * 10000),
    type: item.type,
    participants: item.participants,
    activity: item.activity,
    translate: textTranslated.textContent,
    images: ''
  }
  textField.textContent = item.activity; 
};

async function getActivity() {
  try {
    const response = await fetch(activityAPI);
    if (!response.ok) {
      throw new Error('Помилка данних');
    }
    const data = await response.json();
    return data;
  } catch(error) {
    console.error(error.message);
  } 
};

async function showActivity() {
  const data = await getActivity();
  if (data !== undefined) {
    if (!data.error) {
      createNewActivity(data);
      activityCard.classList.add('show');
    } else {
      errorCard.classList.remove('hidden');
      errorCard.firstElementChild.textContent = 'За вашим запитом нічого не знайдено';
    }  
  }
  btnGetLoading.classList.add('hidden');
  btnGetActivity.classList.remove('hidden');
};

function getValueOfInput(arr) {
  let value;
  arr.querySelectorAll('.radio-input').forEach(radio => {
    
    if(radio.checked) {
     value = radio.value;
    }
  });
  return value;
};

function updateLocalStorage(items) {
  localStorage.setItem('allActivity', JSON.stringify(items));
};

function checkOfTranslate(item) {
  let result;
  if (item.translate.length > 0) {
    result = '<button type="button" class="icon icon-translate activity-action action-translate" title="show/hide translation"></button>'
  } else {
    result = '';
  }
  return result;
};

function checkOfImages(item) {
  let result;
  if (item.images.length > 0) {
    result = '<button type="button" class="icon icon-images activity-action action-images" title="show images"></button>'
  } else {
    result = '';
  }
  return result;
};

function addTranslateToCard(item) {
  let result;
  if (item.translate.length > 0) {
    result = `<p class="translated-text hidden">${item.translate}</p>`
  } else {
    result = '';
  }
  return result;
}

function addActivityOnPage(item) {
  activityCardList.insertAdjacentHTML('beforeend', `
    <li class="activity-item ${item.type}"  id=${item.id}>
        
      <div class="activity-data">
          <button type="button" class="js_filterByType icon icon-type" title="sort by activity type" name = 'type' value = ${item.type}>
            ${item.type}
          </button>
          <button type="button" class="js_filterByParticipants icon icon-participants" title="sort by participants" name = 'participants' value = ${item.participants}>
            ${item.participants}
          </button>
      </div>
      <div class="activity-actions">
        ${checkOfTranslate(item)}
        ${checkOfImages(item)}
        
        <button button class="icon icon-remove activity-action action-remove" type="button" title="remove it">
          <span class="sr-only">Remove it</span>
        </button>
      </div>
      <div class="activity-name">
        ${item.activity}
      </div>
       ${addTranslateToCard(item)}
      

    </li>
  `)
}

function clearActivityCardContent(){
  textTranslated.textContent = '';
  imageList.innerHTML = '';
  document.querySelector('.js_getImages').classList.remove('hidden');
  textTranslated.classList.add('hidden');
  btnGetLoading.classList.remove('hidden');
  btnGetActivity.classList.add('hidden');
  errorCard.classList.add('hidden');
  activityCard.classList.remove('show'); 
  activityCardContent.classList.remove('hidden'); 
  btnAddToList.removeAttribute('disabled');
  btnAddToList.textContent = 'Add to my list';
};

function handlerGetActivity() {
  clearActivityCardContent();
  let numberOfPart = getValueOfInput(participants);
  let typeOfActivity = getValueOfInput(activity);
  
  if (typeOfActivity === 'all') {
    activityAPI = `http://www.boredapi.com/api/activity?participants=${numberOfPart}`;
  } else {
    activityAPI = `http://www.boredapi.com/api/activity?participants=${numberOfPart}&type=${typeOfActivity}`;
  };
  getActivity();
  showActivity(); 
};

function handlerGetTranslate() {
  const url = 'https://translate-plus.p.rapidapi.com/translate';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '1e81c5136bmshdf4cf14e295057cp17d4e3jsn705f20333367',
      'X-RapidAPI-Host': 'translate-plus.p.rapidapi.com'
    },
    body: JSON.stringify({
      text: `${textField.textContent}`,
      source: 'en',
      target: 'uk'
    })
  };

  function createTranslateText(text) {
    textTranslated.classList.remove('hidden');
    textTranslated.textContent = text;

  };

  async function getTransleate() {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  async function showTranslateText() {
    const data = await getTransleate();
    createTranslateText(data.translations.translation);
  };

  getTransleate();
  showTranslateText();
};

function handlerAddToList(targetBtn) {
  document.querySelector('.activity-card__content').classList.add('hidden');
  btnGetActivity.removeAttribute('disabled')
  targetBtn.setAttribute('disabled', true);
  targetBtn.textContent = 'Added';
  rightSide.classList.remove('hidden');
  newActivityObj.translate = textTranslated.textContent;
  const images = document.querySelector('.images');
  console.log(images);
  const imagesArr = images.querySelectorAll('.image-link');
  const linksArr = [...imagesArr].map(item => item.href);
  console.log(linksArr);
  newActivityObj.images = linksArr;
  console.log(newActivityObj);
  allActivities.push(newActivityObj);
  updateLocalStorage(allActivities);
  updateActivityCardList(allActivities);
};

function removeActivity(idAct) {
  allActivities = allActivities.filter(item => item.id !== idAct);
  updateLocalStorage(allActivities);
  updateActivityCardList(allActivities);
  console.log(allActivities.length);
  if (allActivities.length === 0) {
    activityCard.classList.remove('show');
    for (let key in filterSettings) {
      filterSettings[key] = '';
  }
  console.log(filterSettings);
    localStorage.setItem('filters', JSON.stringify(filterSettings));
  }
  
};

function updateFiltersLocalStorage(target) {
  filterSettings[target.name] = target.value;
  localStorage.setItem('filters', JSON.stringify(filterSettings));
};

function removeFilter(target) {
  let key = target.closest('.filters__item').getAttribute('data-filter');
  console.log(key);
  console.log('key');
  filterSettings[key] = '';
  console.log(filterSettings);
};

function filterAllActivity() {
  const typeArr = sortByType(allActivities);
  const participantsArr = sortByParticipants(typeArr);
  const searchArr = sortBySearchBlur(participantsArr);
  updateActivityCardList(searchArr);
};

function sortByType(arr) {
  let sorted = [];
  const sortType = filterSettings['type'];
  switch (sortType) {
    case 'education':
      sorted = arr.filter(activity => activity.type === 'education')
      break;
      case 'recreational':
        console.log('hhhhhhhhhh');
      sorted = arr.filter(activity => activity.type === 'recreational');
      break;
      case 'social':
      sorted = arr.filter(activity => activity.type === 'social')
      break;
      case 'diy':
      sorted = arr.filter(activity => activity.type === 'diy')
      break;
      case 'charity':
      sorted = arr.filter(activity => activity.type === 'education')
      break;
      case 'cooking':
      sorted = arr.filter(activity => activity.type === 'cooking')
      break;
      case 'relaxation':
      sorted = arr.filter(activity => activity.type === 'relaxation')
      break;
      case 'music':
      sorted = arr.filter(activity => activity.type === 'music')
      break;
      case 'busywork':
      sorted = arr.filter(activity => activity.type === 'busywork')
      break;

    default:
      sorted = arr;
      break;
  }
  return sorted;
};

function sortByParticipants(arr) {
  let sorted = [];
  const sortParticipants = filterSettings['participants'];
  switch (sortParticipants) {
    case '1':
      sorted = arr.filter(activity => activity.participants === 1)
      break;
      case '2':
        console.log('hhhhhhhhhh');
      sorted = arr.filter(activity => activity.participants === 2);
      break;
      case '3':
      sorted = arr.filter(activity => activity.participants === 3)
      break;
      case '4':
      sorted = arr.filter(activity => activity.participants === 4)
      break;
      case '5':
      sorted = arr.filter(activity => activity.participants === 5)
      break;

    default:
      sorted = arr;
      break;
  }
  return sorted;
};

function sortBySearch() {
  const searchInput = document.querySelector('.search__input');
  const typeArr = sortByType(allActivities);
  const participantsArr = sortByParticipants(typeArr);
  let sorted = [];
  sorted = typeArr.filter(item => item.activity.toLowerCase().startsWith(searchInput.value.toLowerCase()));
  updateActivityCardList(sorted);
};

function sortBySearchBlur(arr) {
  let sorted = [];
  
  const sortType = filterSettings['search'];
  if (sortType !== undefined) {
    sorted = arr.filter(item => item.activity.toLowerCase().startsWith(sortType.toLowerCase()));
  } else {
    sorted = arr;
  }
  
  return sorted;
};

function showTranslate(target) {
  const tranlateText = target.closest('.activity-item').querySelector('.translated-text');
  tranlateText.classList.toggle('hidden');
};

document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('js_getActivity')) { 
    handlerGetActivity();
  };

  if (target.classList.contains('js_translate')) {
    handlerGetTranslate();
  };

  if (target.classList.contains('js_getImages')) {
    target.classList.add('hidden');
    document.querySelector('.js_loadingImages').classList.remove('hidden');
    imageList.classList.add('loading');
    btnAddToList.setAttribute('disabled', true);
    getImagesFromAPI();
      
  };

  if (target.classList.contains('action-translate')) {
    showTranslate(target);
  };

  if (target.classList.contains('js_addToList')) { 
    handlerAddToList(target);
  };

  if (target.classList.contains('action-remove')) {
    const id = +target.closest('.activity-item').id;
    removeActivity(id);
  };

  if (target.classList.contains('js_filterByType')) {   
    updateFiltersLocalStorage(target);
    updateFiltersItems();
    filterAllActivity();
  };

  if (target.classList.contains('js_filterByParticipants')) {
    updateFiltersLocalStorage(target);
    updateFiltersItems();   
    filterAllActivity();
  };

  if (target.classList.contains('filters__btn')) {
    removeFilter(target);
    localStorage.setItem('filters', JSON.stringify(filterSettings));
    updateFiltersItems(); 
    filterAllActivity();
  };
});

document.querySelector('.search__input').addEventListener('input', (e) => {
  sortBySearch();
});

document.querySelector('.search__input').addEventListener('blur', (e) => {
  const searchInput = document.querySelector('.search__input');
  filterSettings.search = searchInput.value;
  localStorage.setItem('filters', JSON.stringify(filterSettings));
  updateFiltersItems();
  filterAllActivity();
  searchInput.value = '';
});

function creativeImage(item) {
  console.log(item);
  imageList.insertAdjacentHTML('beforeend', `
  <a class="image-link" href='${item}' target="_blank">
  <img src='${item}' class="image-result aspect-video object-cover rounded-md">
  </a>
`)
};

function getImagesFromAPI() {
  console.log(textField.textContent);
  const url = `https://corsproxy.io/?https://image-search19.p.rapidapi.com/v2/?q=${textField.textContent}=en`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '1e81c5136bmshdf4cf14e295057cp17d4e3jsn705f20333367',
      'X-RapidAPI-Host': 'image-search19.p.rapidapi.com'
    }
  };
  
  async function getImages() {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Помилка в пошуку зображень');
      } 
      const result = await response.json();
      return result.response.images;
    } catch(error) {
      console.error(error.message);
    } 
  }

  async function showImages() {
    let imagesArr = [];
    const data = await getImages();
    if (data !== undefined) {
      let newImagesList = [];
      newImagesList = data.map(item => item.image.url);
       document.querySelector('.images').classList.remove('loading');
       imagesArr = newImagesList.slice(0, 10);
     
       imagesArr.forEach(item => {
        creativeImage(item)
       })
      btnAddToList.removeAttribute('disabled'); 
      document.querySelector('.js_loadingImages').classList.add('hidden'); 
    }
    document.querySelector('.js_loadingImages').classList.add('hidden');
    document.querySelector('.images').classList.remove('loading');
    return imagesArr;
  }
  showImages(); 
};