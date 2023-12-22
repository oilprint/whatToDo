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
  'type': '',
  'search': ''
};

let newActivityObj;

updateActivityCardList(allActivities);
updateFiltersItems();

function updateFilters(target) {
  for (let key in filterSettings) {
    filterSettings[key] 
  }
  filterSettings[target.name] = target.value;
  localStorage.setItem('filters', JSON.stringify(filterSettings));
};

function addFilterItem(key) {
  document.querySelector('.filters').insertAdjacentHTML('beforeend', `
  <li class="filters__item" data-filter=${key}>
  <div class="filters__text icon icon-${key}">${filterSettings[key]}</div>
  <button class="filters__btn icon icon-remove"></button>
</li>`)
};


function updateFiltersItems() {
  console.log(filterSettings)
 for (let key in filterSettings) {
  console.log(filterSettings[key]);
  if (filterSettings[key].length > 0) {
    console.log(filterSettings[key]);
    addFilterItem(key);
  }
 }
}


function createNewActivity(item) {
  console.log(item.type);
  newActivityObj = {
    id: Math.floor(Math.random() * 10000),
    type: item.type,
    participants: item.participants,
    activity: item.activity,
    translate: textTranslated.textContent
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

function creativeImage(item) {
  console.dir(item);
  imageList.insertAdjacentHTML('beforeend', `
  <a href=${item} target="_blank">
  <img src=${item} class="image-result aspect-video object-cover rounded-md">
  </a>
`)
};

function getImagesFromAPI() {
  console.log(textField.textContent);
  const url = `https://image-search19.p.rapidapi.com/v2/?q=${textField.textContent}=en`;
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
      console.log('result');
        console.log(result.response.images);
      return result.response.images;
    } catch(error) {
      console.error(error.message);
    } 
  }

  async function showImages() {
    const data = await getImages();
    if (data !== undefined) {
      console.log(data);
      const newImagesList = data.map(item => item.image.url);
      console.log(newImagesList);
      newImagesList.map(item => {
        creativeImage(item)
      });
    }
    document.querySelector('.js_loadingImages').classList.add('hidden');
    document.querySelector('.images').classList.add('loading');
  }

  showImages();
}

function updateLocalStorage(items) {
  localStorage.setItem('allActivity', JSON.stringify(items));
};

function updateActivityCardList(arr) {
  rightSide.classList.remove('hidden');
  activityCardList.innerHTML = '';
  console.log(arr);
  arr.forEach(el => {
    addActivityOnPage(el)
  })
}

function checkOfTranslate(item) {
  let result;
  if (item.translate.length > 0) {
    result = '<button type="button" class="icon icon-translate activity-action action-translate" title="show/hide translation"></button>'
  } else {
    result = '';
  }
  return result;
};

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
        
        <button button class="icon icon-remove activity-action action-remove" type="button" title="remove it">
          <span class="sr-only">Remove it</span>
        </button>
      </div>
      <div class="activity-name">
        ${item.activity}
      </div>

    </li>
  `)
}

function clearActivityCardContent(){
  textTranslated.textContent = '';
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
  allActivities.push(newActivityObj);
    
  updateLocalStorage(allActivities);
  updateActivityCardList();
};

function removeActivity(idAct) {
  allActivities = allActivities.filter(item => item.id !== idAct);
  updateLocalStorage(allActivities);
  updateActivityCardList();
};

function updateFilters(target) {
  console.log('click');
  filterSettings[target.name] = target.value;
  console.log(filterSettings);
  localStorage.setItem('filters', JSON.stringify(filterSettings));
}

document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('js_getActivity')) { 
    handlerGetActivity();
  };

  if (target.classList.contains('js_translate')) {
    handlerGetTranslate();
  };

  if (target.classList.contains('js_getImages')) {
    
  };

  if (target.classList.contains('js_addToList')) { 
    handlerAddToList(target);
    console.log(allActivities);
    
  };

  if (target.classList.contains('action-remove')) {
    const id = +target.closest('.activity-item').id;
    console.log(id);
    removeActivity(id);
  };

  if (target.classList.contains('js_filterByType')) {
     document.querySelector('.filters').innerHTML = '';
    updateFilters(target);
    updateFiltersItems();
    console.log(allActivities);
    const type = sortByType(allActivities);
    console.log(type);
    updateActivityCardList(type)
  };

  if (target.classList.contains('js_filterByParticipants')) {
     document.querySelector('.filters').innerHTML = '';
    updateFilters(target);
    updateFiltersItems();   
  };
});

function sortByType(arr) {
  let sorted = [];
  console.log(filterSettings['type']);
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
}
