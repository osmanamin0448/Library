const myLibrary = [];

function Book(title, author, pages,read){
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}
Book.prototype.toggleRead = function(){
  this.read = !this.read;
}


function addBookToLibrary(title, author, pages, read){
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}
//addBookToLibrary("The Hobbit","Amin", 500, "read");
//addBookToLibrary("Rich dad poor dad", "Robert", 200 , " not read")


function displayBook(){
  const library = document.querySelector("#library");

  library.innerHTML = "";

  myLibrary.forEach(book =>{
    const shelve = document.createElement("div");

    //assing each book a uniqes id
    shelve.dataset.id = book.id;

    shelve.innerHTML = `${book.title} by ${book.author}, ${book.pages}, ${book.read? "Read" : "Not Read"}`;

    library.appendChild(shelve);

    const deleteBook = document.createElement("button");
    deleteBook.textContent = "Delete Book";
    shelve.appendChild(deleteBook);


    //deleting form array. Always remember to user "spice" method.
    deleteBook.addEventListener("click", () => {
      const bookId = shelve.dataset.id;
      
      const index = myLibrary.findIndex(book => bookId.id === bookId);

      myLibrary.splice(index,1);

      displayBook()
    })


    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Toggle Read";

    toggleBtn.addEventListener("click", () => {
      book.toggleRead();
      displayBook();
    });

    shelve.append(toggleBtn)
  })
  
}


//Adding book using dialog;
const addBook = document.querySelector(".add-book");
const dialog = document.querySelector("#dialog");
const bookForm = dialog.querySelector("#book-form");

addBook.addEventListener("click", ()=>{
  dialog.showModal();
})

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookForm);

  const title = formData.get('title');
  const author = formData.get("author");
  const pages = formData.get("pages");
  const read = formData.has('read');

  addBookToLibrary(title, author, pages, read);
  displayBook()
  
  dialog.close();
  bookForm.reset();
})

const cancelBtn = document.querySelector("#cancel-button");
cancelBtn.addEventListener("click", () => {
  dialog.close();
})


