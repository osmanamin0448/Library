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
    const bookTitle = document.createElement("h1");
    const bookAuthor = document.createElement("p");
    const bookPage = document.createElement("p");
    const bookRead = document.createElement("p");

    //assing each book a uniqes id
    shelve.dataset.id = book.id;

    //Assing create para to the book attribute to appear in column
    bookTitle.textContent = book.title;
    bookAuthor.textContent = book.author;
    bookPage.textContent = book.pages;
    bookRead.textContent = book.read ? "Read" : "Not read"

    //Adding a class name to stlye in CSS file
    shelve.classList.add("shelve");
    bookTitle.classList.add("book-title");
    bookAuthor.classList.add("book-author");
    bookPage.classList.add("book-pages");
    bookRead.classList.add("book-read");

    //Appending created book to the windo
    library.appendChild(shelve);
    shelve.appendChild(bookTitle);
    shelve.appendChild(bookAuthor);
    shelve.appendChild(bookPage);
    shelve.appendChild(bookRead);

    const deleteBook = document.createElement("button");
    deleteBook.textContent = "Delete Book";
    deleteBook.classList.add("delete")
    shelve.appendChild(deleteBook);


    //deleting form array. Always remember to user "spice" method.
    deleteBook.addEventListener("click", () => {
      const bookId = shelve.dataset.id;
      
      const index = myLibrary.findIndex(book => book.id === bookId);

      myLibrary.splice(index,1);

      displayBook()
    })


    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "read status";
    toggleBtn.classList.add("toggle")

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


