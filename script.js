function Book(title, author, pages, haveRead) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.haveRead = haveRead;
}

const myLibrary = {};

function reportUnknownUUID(uuid) {
  console.error(`No book associated with uuid = ${uuid}`);
}

function reportNoUUID() {
  console.error('Failed to find uuid!');
}

function buildHaveReadText(haveRead) {
  return `I have ${haveRead ? '' : 'not'} read this`;
}

function checkboxChanged(event) {
  const container = event.target.closest('.have-read-container');

  if (!container) {
    console.error("Expect checkbox to be inside container!");
    return;
  }

  const haveReadText = container.querySelector('.have-read-text');

  if (!haveReadText) {
    console.error('Expected "have-read-text" element in container!');
    return
  }

  const haveRead = event.target.checked;

  haveReadText.textContent = buildHaveReadText(haveRead);

  const uuid = event.target.dataset.uuid;
  if (!uuid) {
    reportNoUUID();
    return;
  }

  const book = myLibrary[uuid];
  if (!book) {
    reportUnknownUUID(uuid);
    return
  }

  book.haveRead = haveRead;
}

function updateEmptyLibraryMessage() {
  const emptyLibraryMessage = document.getElementById('library_container_empty-library-message');
  if (!emptyLibraryMessage) {
    console.error(`Expected element with id = "library_container_empty-library-message"!`);
    return;
  }

  const libraryContainer = document.querySelector('.library_container');
  if (!libraryContainer) {
    console.error(`Expected element with class = "library_container"`);
    return;
  }

  if (Object.keys(myLibrary).length) {
    emptyLibraryMessage.classList.add('hide');
    libraryContainer.classList.remove('library_container_flex');
    libraryContainer.classList.add('library_container_grid');
  } else {
    libraryContainer.classList.add('library_container_flex');
    libraryContainer.classList.remove('library_container_grid');
    emptyLibraryMessage.classList.remove('hide');
  }
}

function addBookToLibrary(book) {
  const uuid = crypto.randomUUID();
  myLibrary[uuid] = book;
  return uuid;
}

function deleteBook(event) {
  const card = event.target.closest('.card');

  if (!card) {
    console.error("Expect delete button to be inside card!");
    return;
  }

  const uuid = event.currentTarget.dataset.uuid;

  if (!uuid) {
    reportNoUUID();
  }

  card.remove();
  delete myLibrary[uuid];
  updateEmptyLibraryMessage();
}

function createCardTitle(book) {
  const title = document.createElement('div');
  title.classList.add("card-title");
  title.textContent = book.title;

  return title;
}

function createCardAuthor(book) {
  const author = document.createElement('div');
  author.classList.add('card-author');
  author.textContent = book.author;

  return author;
}

function createCardNumberOfPages(book) {
  const numOfPages = document.createElement('div');
  numOfPages.classList.add('card-number-of-pages');
  numOfPages.textContent = book.pages;

  return numOfPages;
}

function createHaveReadSwitch(uuid, book) {
  const haveReadContainer = document.createElement('div');
  haveReadContainer.classList.add('have-read-container');

  const haveReadSwitch = document.createElement('label');
  haveReadSwitch.classList.add('switch');
  haveReadContainer.appendChild(haveReadSwitch);
  
  const haveReadCheckBox = document.createElement('input');
  haveReadCheckBox.type = 'checkbox';
  haveReadCheckBox.checked = book.haveRead;
  haveReadCheckBox.classList.add('switch-input');
  haveReadCheckBox.dataset.uuid = uuid;
  haveReadCheckBox.addEventListener('change', checkboxChanged);
  haveReadSwitch.appendChild(haveReadCheckBox);

  const slider = document.createElement('span');
  slider.classList.add('slider', 'round');
  haveReadSwitch.appendChild(slider);

  const haveReadText = document.createElement('span');
  haveReadText.textContent = buildHaveReadText(book.haveRead);
  haveReadText.classList.add('have-read-text');
  haveReadContainer.appendChild(haveReadText);

  return haveReadContainer;
}

function createCardDeleteButton(uuid) {
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.dataset.uuid = uuid;
  deleteButton.addEventListener('click', deleteBook);

  return deleteButton;
}

function createCardLastRow(haveReadSwitch, deleteButton) {
  const lastCardRowContent = document.createElement('div');
  lastCardRowContent.classList.add('last-row-container_content');
  lastCardRowContent.appendChild(haveReadSwitch);
  lastCardRowContent.appendChild(deleteButton);

  const lastCardRowContainer = document.createElement('div');
  lastCardRowContainer.classList.add('last-row-container');
  lastCardRowContainer.appendChild(lastCardRowContent);

  return lastCardRowContainer;
}

function createCard(uuid) {
  const book = myLibrary[uuid];

  if (!book) {
    reportUnknownUUID(uuid);
    return;
  }

  const title = createCardTitle(book);
  const hr = document.createElement('hr');
  const author = createCardAuthor(book);
  const numOfPages = createCardNumberOfPages(book);
  const haveReadSwitch = createHaveReadSwitch(uuid, book);
  const deleteButton = createCardDeleteButton(uuid);
  const lastCardRow = createCardLastRow(haveReadSwitch, deleteButton);

  const card = document.createElement('div');
  card.classList.add('card');
  card.appendChild(title);
  card.appendChild(hr)
  card.appendChild(author);
  card.appendChild(numOfPages);
  card.appendChild(lastCardRow);

  const libraryContainer = document.querySelector('.library_container');

  if (!libraryContainer) {
    console.error('Expected element with class = ".library_container"');
    return;
  }

  libraryContainer.appendChild(card);
}

function saveSubmittedBookToLibrary(event) {
  event.preventDefault();

  // Get the form
  const addBookForm = event.currentTarget.closest('.add-book_modal_form');
  if (!addBookForm) {
    console.error('Expected add-book_modal_form element!');
    return;
  }

  // Bail if the form fails validation and const the browser tell the user
  if (!addBookForm.checkValidity()) {
    addBookForm.reportValidity();
    return;
  }

  // Get the form data
  const submitter = event.currentTarget;
  const formData = new FormData(addBookForm, submitter);

  // Create book, add it to library, and create a card for it
  const book = new Book(
    formData.get('book-title'),
    formData.get('book-author'),
    formData.get('book-num-of-pages'),
    formData.has('book-have-read')
  );
  const uuid = addBookToLibrary(book);
  createCard(uuid);
  updateEmptyLibraryMessage();

  // reset the form
  addBookForm.reset();

  // Hide the modal
  const modal = addBookForm.closest('.add-book_modal');
  if (!modal) {
    console.error('Expected add-book_dialog element!');
    return;
  }

  modal.style.display = "none";
}

function setupAddBookModal() {
  const modal = document.getElementById("add-book_dialog");

  if (!modal) {
    console.error('Expected add-book_dialog element!');
    return;
  }

  const addBookBtn = document.getElementById("add-book_btn");

  if (!addBookBtn) {
    console.error('Expected add-book_btn element!');
    return;
  }

  const close = modal.querySelector(".add-book_modal_close");

  if (!close) {
    console.error('Expected add-book_modal_close element!');
    return;
  }

  const saveBtn = modal.querySelector('#add-book_save');

  if (!saveBtn) {
    console.error('Expected add-book_modal_close element!');
    return;
  }

  saveBtn.addEventListener('click', saveSubmittedBookToLibrary);

  addBookBtn.addEventListener('click', () => {
    modal.style.display = "block";
  });

  close.addEventListener('click', () => {
    modal.style.display = "none";
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

setupAddBookModal();

Object.keys(myLibrary).forEach(uuid => { createCard(uuid); });
updateEmptyLibraryMessage();
