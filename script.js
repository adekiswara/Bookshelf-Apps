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

    const completedBookShelf = document.getElementById('completeBookshelfList');
    completedBookShelf.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);        
        if (!bookItem.isCompleted) {
            uncompletedBookShelf.append(bookElement);
        } else {
            completedBookShelf.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerHTML = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerHTML = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerHTML = bookObject.year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('action');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const uncheckButton = document.createElement('button');
        uncheckButton.classList.add('green');
        uncheckButton.innerText = 'Selesai dibaca';

        uncheckButton.addEventListener('click', function () {
            moveBookFromCompleted(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(uncheckButton, deleteButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Belum selesai dibaca';

        checkButton.addEventListener('click', function () {
            moveBookFromUncompleted(bookObject.id)
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function () {
            removeBookFromUncompleted(bookObject.id);
        });

        container.append(checkButton, deleteButton);
    };
    
    return container;
};


// Memindahkan data buku dari rak belum selesai dibaca ke sudah selesai dibaca
function moveBookFromUncompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// Menghapus data buku dari rak belum selesai dibaca
function removeBookFromUncompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function findBook (bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        };
    };

    return null;
};

// Memindahkan data buku dari rak sudah selesai dibaca ke belum selesai dibaca
function moveBookFromCompleted (bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// menghapus data buku dari rak sudah selesai dibaca
function removeBookFromCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function findBookIndex (bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}