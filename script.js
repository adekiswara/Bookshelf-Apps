const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist) {
        loadDataFromStorage();
    };
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
    saveData();
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
    textAuthor.innerHTML = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerHTML = `Tahun: ${bookObject.year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('action');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const uncheckButton = document.createElement('button');
        uncheckButton.classList.add('green');
        uncheckButton.innerText = 'Belum selesai dibaca';

        uncheckButton.addEventListener('click', function () {
            moveBookFromCompleted(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function (event) {
            Confirm.open({
                title: 'Hapus Buku',
                message: 'Apakah Anda yakin akan menghapus buku tersebut?',
                onok: () => {
                    const bookId = parseInt(event.target.parentElement.parentElement.id.split("-")[1]);
                    removeBookFromCompleted(bookId);
                }
            })
        });

        textContainer.append(uncheckButton, deleteButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai dibaca';

        checkButton.addEventListener('click', function () {
            moveBookFromUncompleted(bookObject.id)
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function (event) {
            Confirm.open({
                title: 'Hapus Buku',
                message: 'Apakah Anda yakin akan menghapus buku tersebut?',
                onok: () => {                    
                    const bookId = parseInt(event.target.parentElement.parentElement.id.split("-")[1]);                    
                    removeBookFromUncompleted(bookId);
                }
            })
        });

        textContainer.append(checkButton, deleteButton);
    };
    
    return container;
};


// Memindahkan data buku dari rak belum selesai dibaca ke sudah selesai dibaca
function moveBookFromUncompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

// Menghapus data buku dari rak belum selesai dibaca
function removeBookFromUncompleted (bookId) {
    const bookTarget = findBook(bookId);
        
    if (bookTarget == null) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
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
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

// menghapus data buku dari rak sudah selesai dibaca
function removeBookFromCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBookIndex (bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
};

function saveData() {
    if(isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

function isStorageExist() /* boolean */ {
    if (typeof (storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
};

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function searchBook() {
    const bookTitle = document.getElementById("searchBookTitle").value;

    const filter = bookTitle.toUpperCase();
    const container = document.querySelectorAll(".book_list > .book_item");

    for(let i = 0; i < container.length; i++) {
        let title = container[i].querySelector("h2");
        let textTitle = title.innerText;

        if(textTitle.toUpperCase().indexOf(filter) > -1) {
            container[i].style.display = "";
        } else {
            container[i].style.display = "none";
        }
    }
};

const Confirm = {
    open (options) {
        options = Object.assign({}, {
            title: '',
            message: '',
            okText: 'Ya',
            cancelText: 'Tidak',
            onok: function () {},
            oncancel: function () {}
        }, options);
        
        const html = `
            <div class="confirm">
                <div class="confirm__window">
                    <div class="confirm__titlebar">
                        <span class="confirm__title">${options.title}</span>
                        <button class="confirm__close">&times;</button>
                    </div>
                    <div class="confirm__content">${options.message}</div>
                    <div class="confirm__buttons">
                        <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                        <button class="confirm__button confirm__button--cancel">${options.cancelText}</button>
                    </div>
                </div>
            </div>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const confirmEl = template.content.querySelector('.confirm');
        const btnClose = template.content.querySelector('.confirm__close');
        const btnOk = template.content.querySelector('.confirm__button--ok');
        const btnCancel = template.content.querySelector('.confirm__button--cancel');

        confirmEl.addEventListener('click', e => {
            if (e.target === confirmEl) {
                options.oncancel();
                this._close(confirmEl);
            }
        });

        btnOk.addEventListener('click', () => {
            options.onok();
            this._close(confirmEl);
        });

        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(confirmEl);
            });
        });

        document.body.appendChild(template.content);
    },

    _close (confirmEl) {
        confirmEl.classList.add('confirm--close');

        confirmEl.addEventListener('animationend', () => {
            document.body.removeChild(confirmEl);
        });
    }
};