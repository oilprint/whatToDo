import PhotoSwipeLightbox from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.3/photoswipe-lightbox.esm.min.js';

const lightbox = new PhotoSwipeLightbox({
  showHideAnimationType: 'none',
  pswpModule: () => import('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.3/photoswipe.esm.min.js')
});


document.addEventListener('click', (e) => {
  const target = e.target;
  if(target.classList.contains('action-images')) {
    
    /* Ваш код тут */
    const id = +target.closest('.activity-item').id;
    
    const targetActivity = allActivities.find(item => item.id == id);
    console.log(targetActivity);
   

    lightbox.addFilter('numItems', () => {
      const result = targetActivity.images.length;
      console.log(result);
      return result;
    });

    lightbox.addFilter('itemData', (itemData, index) => {
      return {
        src: `${targetActivity.images[index]}`, 
        width: 500,
        height: 500
      };
    });
      
    lightbox.init();
    lightbox.loadAndOpen(0);

  }
})

