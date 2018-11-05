class Photo {
  constructor(title, caption, image) {
    this.id = Math.floor(Date.now() / 1000); 
    this.title = title;
    this.caption = caption;
    this.image = image;
    this.favorite = false;
  }

  saveToStorage() {
    let currentCards = JSON.parse(localStorage.getItem('foto-cards') || "[]");
    currentCards.push(this);
    localStorage.setItem('foto-cards', JSON.stringify(currentCards));
  }

  deleteFromStorage(cardToDeleteId) {
    let currentCards = JSON.parse(localStorage.getItem('foto-cards'));
    currentCards.forEach(function(card, i) {
      if (card.id === cardToDeleteId) {
          currentCards.splice(i);
      }
    })
    localStorage.setItem('foto-cards', JSON.stringify(currentCards));
  }

  updatePhoto(cardToUpdate) {
    let currentCards = JSON.parse(localStorage.getItem('foto-cards'));
    currentCards.forEach(function(card) {
      if (card.id === cardToUpdate) {
        card.favorite = !card.favorite;
      }
    })
    localStorage.setItem('foto-cards', JSON.stringify(currentCards));
  }
} 

