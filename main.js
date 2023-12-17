const participants = document.querySelector('.participants');
const activity = document.querySelector('.activity-type');
const btnGetActivity = document.querySelector('.js_getActivity');
const btnGetLoading = document.querySelector('.js_loading');
const textField = document.querySelector('.activity-text');
const activityCard = document.querySelector('.activity-card');
const errorCard = document.querySelector('.error-card');


function createCard(item) {
  textField.textContent = item.activity;
}

let activityAPI;

async function getActivity() {
  try {
    console.log(activityAPI);
    const response = await fetch(activityAPI);
    if (!response.ok) {
      throw new Error('Помилка данних');
    }
    const data = await response.json();
    console.dir(data);
    return data;
  } catch(error) {
    console.error(error.message);
  } 
}

async function showActivity() {
  const data = await getActivity();
  if (data !== undefined) {
    console.log((data));
    if (!data.error) {
      createCard(data);
      activityCard.classList.add('show');
    } else {
      errorCard.classList.remove('hidden');
      errorCard.firstElementChild.textContent = data.error;
    }  
  }
  btnGetLoading.classList.add('hidden');
  btnGetActivity.classList.remove('hidden');
}


btnGetActivity.addEventListener('click', () => {
  btnGetLoading.classList.remove('hidden');
  btnGetActivity.classList.add('hidden');
  errorCard.classList.add('hidden');
  activityCard.classList.remove('show'); 
  let numberOfPart, typeOfActivity;

  participants.querySelectorAll('.radio-input').forEach(radio => {
    if(radio.checked) {
     numberOfPart = radio.value;
    }
  });

  activity.querySelectorAll('.radio-input').forEach(radio => {
    if(radio.checked) {
     typeOfActivity = radio.value;
    }
  });

  if (typeOfActivity === 'all') {
    activityAPI = `http://www.boredapi.com/api/activity?participants=${numberOfPart}`;
  } else {
    activityAPI = `http://www.boredapi.com/api/activity?participants=${numberOfPart}&type=${typeOfActivity}`;
  };

  getActivity();
  showActivity();
});

