const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })
});

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function generateId() {
    return +new Date();
};

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);
    const uncompletedBookShelf = document.getElementById('incompleteBookshelfList');
    uncompletedBookShelf.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        uncompletedBookShelf.append(bookElement);
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerHTML = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerHTML = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerHTML = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);
    
    return container;
};