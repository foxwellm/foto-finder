document.querySelector('.add-to-album').addEventListener('click', createNewCard);
document.querySelector('.photo-title-input').addEventListener('keyup', disableSaveButton);
document.querySelector('.photo-caption-input').addEventListener('keyup', disableSaveButton);
document.querySelector('#files').addEventListener('change', disableSaveButton);
document.querySelector('.show-more-btn').addEventListener('click', showMoreLessCards);
document.querySelector('.show-less-btn').addEventListener('click', showMoreLessCards);
document.querySelector('.view-favorites').addEventListener('click', showAllFavorites);
document.querySelector('.search-bar-input').addEventListener('keyup', filterSearch);

function createNewCard() {
  event.preventDefault();
  const titleInput = document.querySelector('.photo-title-input');
  const captionInput = document.querySelector('.photo-caption-input');
  const chooseFile = document.querySelector('#files');
  const photoInput = URL.createObjectURL(chooseFile.files[0]);
  const photo = new Photo(titleInput.value, captionInput.value, photoInput);
  createCardTemplate(photo.id, photo.title, photo.caption, photo.image, photo.favorite);
  photo.saveToStorage();
  clearInputs();
  disableSaveButton();
}

function createCardTemplate(id, title, caption, image, favorite) {
  const cardsContainer = document.querySelector('.user-images-container');
  let favoriteClass;
  if (favorite) {
    favoriteClass = "favorite-true";
  } else { favoriteClass = "favorite-false"; }

  const newCard = 
  `<article id="${id}" class="images-card">
        <section class="output-container">
          <div class="title-output-container">
          <h1 onkeydown="checkEnterKey('title')" onfocusout="saveUserInput('title')" data-titleID="${id}" class="title-output" contenteditable="true">${title}</h1> 
          </div>
          <div class="photo-output-container"><label for="files"><img class="photo-output" src="${image}"</div></label>
          <div class="caption-output-container">
          <p onkeydown="checkEnterKey('body')" onfocusout="saveUserInput('body')" data-bodyID="${id}" class="caption-output" contenteditable="true">${caption}</p></div>
        </section>
        <section class="button-container">
          <div onclick="deletePhotoCard(${id})" data-cardID="${id}" class="card-delete-button"></div>
          <div onclick="updateFavorite(${id})" data-cardID="${id}" class="card-favorite-button ${favoriteClass}"></div>
        </section>
        </article>`;
  cardsContainer.innerHTML = newCard + cardsContainer.innerHTML;
}

function filterSearch() {
  var searchBarInput = document.querySelector('.search-bar-input');
  var filterInput = searchBarInput.value.toLowerCase();
  removeAll();
  allCards().forEach(function(cards) {
    cards.forEach(function(card) {
      const { id, title, caption, image, favorite } = card;
      if (card.title.indexOf(filterInput)!== -1 || card.caption.indexOf(filterInput)!== -1) {
      createCardTemplate(id, title, caption, image, favorite);
    }
    })
  })
}

function clearInputs() {
  const photoTitleInput = document.querySelector('.photo-title-input');
  const photoCaptionInput = document.querySelector('.photo-caption-input');
  const fileInput = document.querySelector('#files');
  fileInput.value = '';
  photoTitleInput.value = '';
  photoCaptionInput.value = '';
}

function disableSaveButton() {
  const saveButton = document.querySelector('.add-to-album');
  const titleInput = document.querySelector('.photo-title-input');
  const bodyInput = document.querySelector('.photo-caption-input');
  const fileInput = document.querySelector('#files');
  if (titleInput.value === '' || bodyInput.value === '' || fileInput.value === '') {
    saveButton.disabled = true;
  } else {
    saveButton.disabled = false;
  }
}

function updateFavorite(cardToUpdate) {
  if (event.target.classList[1] === "favorite-false") {
    event.target.classList.remove('favorite-false');
    event.target.classList.add('favorite-true');
  } else {
    event.target.classList.remove('favorite-true');
    event.target.classList.add('favorite-false');
  }
  Photo.prototype.updatePhoto(cardToUpdate);
  favoriteBtnText();
}

function showAllFavorites() {
  event.preventDefault();
  const viewFavorites = document.querySelector('.view-favorites');
  if (viewFavorites.classList[2]) {
    viewFavorites.classList.remove('favorites');
    viewFavorites.innerHTML = "Show All";
    removeAll();
    allCards().forEach(function(cards) {
      cards.forEach(function(card) {
        const { id, title, caption, image, favorite } = card;
        if (card.favorite === true) {
          createCardTemplate(id, title, caption, image, favorite);
        }
      })
    })
  } else {
    viewFavorites.classList.add('favorites');
    showAllCards('ten');
    favoriteBtnText();
  }
}

function favoriteBtnText() {
  let numOfFavorites = countFavorites();
    const viewFavorites = document.querySelector('.view-favorites');
  if (numOfFavorites > 1) {
    viewFavorites.innerHTML = "View " + numOfFavorites + " Favorites";
  } else if  (numOfFavorites === 1){
    viewFavorites.innerHTML = "View " + numOfFavorites + " Favorite";
  } else {
    viewFavorites.innerHTML = "No Favorites Yet";
  }
} 

 
function countFavorites() {
  var favoriteCount = 0;
  allCards().forEach(function(cards) {
    cards.forEach(function(card) {
      const { id, title, caption, image, favorite } = card;
      if (card.favorite === true) {
      favoriteCount++;
    }
    })  
  })
   return favoriteCount;
}

function deletePhotoCard(cardToDeleteId) {
   event.target.closest('article').remove();
   Photo.prototype.deleteFromStorage(cardToDeleteId);
}

function showMoreLessCards() {
  const showLess = document.querySelector('.show-less-btn');
  const showMore = document.querySelector('.show-more-btn');
  const cardsContainer = document.querySelector('.user-image-container');
  if (event.target === showMore) {
    showAllCards('all')
  } else {
    showAllCards('ten')
  }
  showMore.classList.toggle('more-less-toggle');
  showLess.classList.toggle('more-less-toggle');
}

function removeAll() {
  const cardsContainer = document.querySelector('.user-images-container');
  cardsContainer.innerHTML = '';
}

function allCards() {
  return Object.values(localStorage).map(cardString => JSON.parse(cardString));
}

function showAllCards(displayNumber) {
  removeAll();
  favoriteBtnText();
  allCards().forEach(function(cards) {
    if ((displayNumber === 'ten') && (cards.length > 10)) {
        let endArray = cards.length;
        let startArray = (cards.length - 10);
        cards = cards.slice(startArray, endArray);
      }
    cards.forEach(function(card) {
      const { id, title, caption, image, favorite } = card;
      createCardTemplate(id, title, caption, image, favorite);
    })
  })
}

showAllCards('ten');