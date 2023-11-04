import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { SearchService } from './SearchService';

const elements = {
  form: document.querySelector('.search-form'),
  cardList: document.querySelector('.gallery'),
  message: document.querySelector('.message'),
};

const gallery = new SimpleLightbox('.gallery a');
let quantityImg = 0;
let currentPage = 1;
let loading = false;

elements.form.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);

async function handleSubmit(evt) {
  evt.preventDefault();
  elements.cardList.innerHTML = '';
  currentPage = 1;
  quantityImg = 0;
  loading = false;

  const searchQuery = evt.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return Notify.failure('Enter your search details.');
  }

  localStorage.setItem('input-value', searchQuery);

  loadImages(searchQuery);
}

async function loadImages(searchQuery) {
  try {
    const data = await SearchService(currentPage, searchQuery);

    if (data.data.totalHits === 0) {
      elements.message.style.display = 'block';
      return;
    }

    quantityImg += data.data.hits.length;

    elements.cardList.insertAdjacentHTML(
      'beforeend',
      cardListMarkup(data.data.hits)
    );

    if (data.data.totalHits !== 0) {
      Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
    }

    if (data.data.totalHits > quantityImg) {
      loading = false;
    } else {
      Notify.info("Sorry, but you've reached the end of search results.");
    }

    if (elements.cardList.firstElementChild) {
      const { height: cardHeight } =
        elements.cardList.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    gallery.refresh();
  }
}

function cardListMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class ="photo-card"> 
        <a class="gallery-link" href="${largeImageURL}"> 
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-likes">
              <b>Likes: <span class= "item-text">${likes}</span></b>
            </p>
            <p class="info-views">
              <b>Views: <span class= "item-text">${views}</span></b>
            </p>
            <p class="info-comments">
              <b>Comments: <span class= "item-text">${comments}</span></b>
            </p>
            <p class="info-downloads">
              <b>Downloads: <span class= "item-text">${downloads}</span></b>
            </p>
          </div>
        </a>
      </div>`;
      }
    )
    .join('');
}

function handleScroll() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loading
  ) {
    loading = true;
    currentPage++;
    const inputValue = localStorage.getItem('input-value');
    loadImages(inputValue);
  }
}

const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
