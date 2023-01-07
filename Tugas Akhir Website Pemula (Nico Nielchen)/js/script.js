let books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOK_APPS";
const ITEM_ID = "itemId";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
    submitForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
    console.log(books);
  }
});

function addBooks() {
  const textBook = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();

  const bookObject = generateBookObject(
    generatedID,
    textBook,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompletedBooks");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completedBooks");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    bookElement[ITEM_ID] = bookItem.id;

    if (bookItem.isComplete) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});

function makeBook(book) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = book.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = book.year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const bookContainer = document.createElement("article");
  bookContainer.setAttribute("id", book.id);
  bookContainer.classList.add("book_item");
  bookContainer.append(bookTitle, bookAuthor, bookYear);
  if (book.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("done-button");
    undoButton.innerText = "Belum Selesai dibaca";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(book.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("clear-button");
    removeButton.innerText = "Hapus Buku";

    removeButton.addEventListener("click", function () {
      removeBookFromCompleted(book.id, book);
    });

    buttonContainer.append(undoButton, removeButton);
    bookContainer.append(buttonContainer);
  } else {
    const doneButton = document.createElement("button");
    doneButton.classList.add("done-button");
    doneButton.innerText = "Selesai dibaca";

    doneButton.addEventListener("click", function () {
      addBookToCompleted(book.id);
    });
    const removeButton = document.createElement("button");
    removeButton.classList.add("clear-button");
    removeButton.innerText = "Hapus Buku";

    removeButton.addEventListener("click", function () {
      removeBookFromCompleted(book.id, book);
    });

    buttonContainer.append(doneButton, removeButton);
    bookContainer.append(buttonContainer);
  }
  return bookContainer;
}

function addBookToCompleted(bookElement) {
  const book = findBook(bookElement);

  if (book == null) return;

  book.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookElement) {
  const book = findBook(bookElement);

  if (book == null) return;

  book.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement);

  if (bookPosition === -1) return;

  books.splice(bookPosition, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const book in books) {
    if (books[book].id === bookId) {
      return book;
    }
  }
  return -1;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
