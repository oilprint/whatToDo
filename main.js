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
const allActivities = JSON.parse(localStorage.getItem('allActivity')) || [];



updateActivityCardList()

function createCard(item) {
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
    console.log((data));
    if (!data.error) {
      createCard(data);
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

function handlerGetActivity() {
  btnGetLoading.classList.remove('hidden');
  btnGetActivity.classList.add('hidden');
  errorCard.classList.add('hidden');
  activityCard.classList.remove('show'); 
  activityCardContent.classList.remove('hidden'); 
  btnAddToList.removeAttribute('disabled');
  btnAddToList.textContent = 'Add to my list';
 
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

async function showActivity() {
  const data = await getActivity();
  if (data !== undefined) {
    if (!data.error) {
      createCard(data);
      activityCard.classList.add('show');
    } else {
      errorCard.classList.remove('hidden');
      errorCard.firstElementChild.textContent = 'За вашим запитом нічого не знайдено';
    }  
  }
  btnGetLoading.classList.add('hidden');
  btnGetActivity.classList.remove('hidden');
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
  showTranslateText() 
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

function createActivityCard() {
  const activityObj = {
    id: Math.floor(Math.random() * 10000),
    type: getValueOfInput(activity),
    participants: getValueOfInput(participants),
    text: textField.textContent,
    translate: textTranslated.textContent
  }
  console.log(activityObj.translate.length);
  return activityObj;
};

function updateLocalStorage(items) {
  localStorage.setItem('allActivity', JSON.stringify(items));
};

function updateActivityCardList() {
  console.log(allActivities);
  rightSide.classList.remove('hidden');
  activityCardList.innerHTML = '';
  allActivities.forEach(el => {
    addActivityOnPage(el)
  })
}

function checkOfParametrs(item, key) {
  let result;
  if (item[key].length > 0) {
    result = '<button type="button" class="icon icon-translate activity-action action-translate" title="show/hide translation"></button>'
  } else {
    result = '';
  }
  return result;
}

function addActivityOnPage(item) {

  activityCardList.insertAdjacentHTML('beforeend', `
    <li class="activity-item ${item.type}">
        
      <div class="activity-data">
          <button type="button" class="js_filterByType icon icon-type" title="sort by activity type">
            ${item.type}
          </button>
          <button type="button" class="js_filterByParticipants icon icon-participants" title="sort by participants">
            ${item.participants}
          </button>
      </div>
      <div class="activity-actions">
        ${checkOfParametrs(item, 'translate')}
        <button button class="icon icon-remove activity-action action-remove" type="button" title="remove it">
          <span class="sr-only">Remove it</span>
        </button>
      </div>
      <div class="activity-name">
        ${item.text}
      </div>

    </li>
  `)
}

function handlerAddToList(targetBtn) {
  document.querySelector('.activity-card__content').classList.add('hidden');
    btnGetActivity.removeAttribute('disabled')
    targetBtn.setAttribute('disabled', true);
    targetBtn.textContent = 'Added';
    rightSide.classList.remove('hidden');
    const newActivity = createActivityCard();
    allActivities.push(newActivity);
    updateLocalStorage(allActivities);
    console.log(newActivity);
    addActivityOnPage(newActivity);
}

document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('js_getActivity')) {
     
    
    handlerGetActivity();
  }  else if (target.classList.contains('js_translate')) {
    handlerGetTranslate();
  }  else if (target.classList.contains('js_getImages')) {
    document.querySelector('.js_getImages').classList.add('hidden');
    document.querySelector('.js_loadingImages').classList.remove('hidden');
    document.querySelector('.js_addToList').setAttribute('disabled', true);
    getImagesFromAPI();

  } else if (target.classList.contains('js_addToList')) {
    
    handlerAddToList(target);

  }
});
