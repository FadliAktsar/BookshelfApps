const UNFINISHED_BOOK_LIST_ID = "unfinished-books";
const FINISHED_BOOK_LIST_ID = "finished-books";
const BOOK_ITEM_ID = "bookId";

function createButton(buttonTypeClass, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function(event) {
        eventListener(event);
    });
    return button;
}

function createCheckButton() {
  return createButton("checklist-button", function (event) {
    addBookToFinished(event.target.parentElement);
  });
}

function createDeleteButton() {
  return createButton("trash-button", function (event) {
    removeBookFromFinished(event.target.parentElement);
  });
}

function createUndoButton() {
  return createButton("unchecklist-button", function (event) {
    undoBookFromFinished(event.target.parentElement);
  });
}

function addBook() {
  const unfinishedBookList = document.getElementById(UNFINISHED_BOOK_LIST_ID);
  const finishedBookList = document.getElementById(FINISHED_BOOK_LIST_ID);
  const completeCheck = document.getElementById("inputBookIsComplete");

  const bookTitle = document.getElementById("title").value;
  const bookAuthor = document.getElementById("author").value;
  const bookYear = document.getElementById("year").value;

  const book = makeBook(bookTitle, bookAuthor, bookYear, completeCheck.checked);
  const bookObject = composeBookObject(
    bookTitle,
    bookAuthor,
    bookYear,
    completeCheck.checked
  );

  book[BOOK_ITEM_ID] = bookObject.id;
  books.push(bookObject);

  if (completeCheck.checked == true) {
    finishedBookList.append(book);
  } else {
    unfinishedBookList.append(book);
  }

  updateDataToStorage();
}

function makeBook(data, author, year, isCompleted) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = data;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const numberYear = document.createElement("p");
  numberYear.classList.add("tahun");
  numberYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, numberYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);

  if (isCompleted) {
    container.append(createUndoButton(), createDeleteButton());
  } else {
    container.append(createCheckButton(), createDeleteButton());
  }

  return container;
}

function addBookToFinished(bookElement) {
  const titleBook = bookElement.querySelector(".inner > h3").innerText;
  const authorBook = bookElement.querySelector(".inner > p").innerText;
  const yearBook = bookElement.querySelector(".inner > .tahun").innerText;

  const newBook = makeBook(titleBook, authorBook, yearBook, true);
  const book = findBook(bookElement[BOOK_ITEM_ID]);
  book.isCompleted = true;
  newBook[BOOK_ITEM_ID] = book.id;
  const bookFinished = document.getElementById(FINISHED_BOOK_LIST_ID);

  bookFinished.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function undoBookFromFinished(bookElement) {
  let pesan = confirm("Anda ingin memindahkan buku ke rak belum selesai di baca?");
  if (pesan == true) {
    const titleBook = bookElement.querySelector(".inner > h3").innerText;
    const authorBook = bookElement.querySelector(".inner > p").innerText;
    const yearBook = bookElement.querySelector(".inner > .tahun").innerText;

    const newBook = makeBook(titleBook, authorBook, yearBook, false);
    const book = findBook(bookElement[BOOK_ITEM_ID]);
    book.isCompleted = false;
    newBook[BOOK_ITEM_ID] = book.id;
    const bookUnfinished = document.getElementById(UNFINISHED_BOOK_LIST_ID);

    bookUnfinished.append(newBook);
    bookElement.remove();

    updateDataToStorage();
  } else {
    return 0;
  }
}

function removeBookFromFinished(taskElement) {
  let pesan = confirm("Anda ingin menghapus buku dari rak?");
  if (pesan == true) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEM_ID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
  } else {
   return 0; 
  } 
}

function refreshDataFromBooks() {
    const bookUnfinishedList = document.getElementById(UNFINISHED_BOOK_LIST_ID);
    let bookFinishedList = document.getElementById(FINISHED_BOOK_LIST_ID);

    for (book of books){
        newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEM_ID] = book.id;

        if (book.isCompleted) {
            bookFinishedList.append(newBook);
        } else {
            bookUnfinishedList.append(newBook);
        }
    }
}