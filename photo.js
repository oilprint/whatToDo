import PhotoSwipeLightbox from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.3/photoswipe-lightbox.esm.min.js';

const lightbox = new PhotoSwipeLightbox({
  showHideAnimationType: 'none',
  pswpModule: () => import('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.3/photoswipe.esm.min.js')
});


document.addEventListener('click', (e) => {
  const target = e.target;
  if(target.classList.contains('action-images')) {
    
    /* Ваш код тут */
   

    lightbox.addFilter('numItems', () => {
      return 5;
    });

    lightbox.addFilter('itemData', (itemData, index) => {
      return {
        src: `https://image-search19.p.rapidapi.com/v2/?q=${textField.textContent}=en`, 
        width: 500,
        height: 500
      };
    });
      
    lightbox.init();
    lightbox.loadAndOpen(0);

  }
})


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
