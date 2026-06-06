const myLibrary = [];

function Book(title, author, pages, read){
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(book){ 
 myLibrary.push(book);
}

const book1 = new Book('the rich man',"amin", 234, "read");
const book2 = new Book("i am me","osman", 234, "not read");

addBookToLibrary(book1);
addBookToLibrary(book2)

//display book;
function displayBook(){
  let list = document.querySelector("#list");

  for(let book of myLibrary){
    const li = document.createElement("li")

    li.textContent = `${book.title} by ${book.author}`;
    list.appendChild(li);
  }
}
displayBook();

//add button
// const newBookButton = document.querySelector("new-book-button");
// newBookButton.addEventListener('click',()=>{

// })