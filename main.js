const participants = document.querySelector('.participants');
const activity = document.querySelector('.activity-type');
const btnGetActivity = document.querySelector('.js_getActivity');
const btnGetLoading = document.querySelector('.js_loading');
const textField = document.querySelector('.activity-text');
const textTranslated = document.querySelector('.translated-text');
const activityCard = document.querySelector('.activity-card');
const errorCard = document.querySelector('.error-card');
let activityAPI, textToTranslate;


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


document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('js_getActivity')) {
    handlerGetActivity();
  }  else if (target.classList.contains('js_translate')) {
    handlerGetTranslate();
  }  else if (target.classList.contains('js_getImages')) {
    console.log('load');
  } else if (target.classList.contains('js_addToList')) {
    console.log('js_addToList');
  }
});
