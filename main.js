const participants = document.querySelector('.participants');
const activity = document.querySelector('.activity-type');
const btnGetActivity = document.querySelector('.btn');
const textField = document.querySelector('.activity-text');


function createCard(item) {
  textField.textContent = item.activity;
}

let activityAPI;
async function getActivity() {
  try {
    const response = await fetch(activityAPI);
    if (!response.ok) {
      throw new Error('Помилка данних');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch(error) {
    console.error(error.message);
  } 
}

async function showActivity() {
  const data = await getActivity();
  if (data !== undefined) {
    console.log((data));
    createCard(data);
  }
}

btnGetActivity.addEventListener('click', () => {
  let numberOfPart, typeOfActivity;
  participants.querySelectorAll('.radio-input').forEach(radio => {
    if(radio.checked) {
     numberOfPart = radio.value;
      console.log(numberOfPart);
    }
  });

  activity.querySelectorAll('.radio-input').forEach(radio => {
    if(radio.checked) {
     typeOfActivity = radio.value;
      console.log(typeOfActivity);
    }
  });
  
  activityAPI = `http://www.boredapi.com/api/activity?participants=${numberOfPart}&type=${typeOfActivity}`;

  getActivity();

  console.log('click');
  
  showActivity();
});
