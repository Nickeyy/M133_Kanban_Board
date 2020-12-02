let apiURL = "http://localhost:8000"
let columns = [];
let cards = [];

createColumns();
getTasks();


async function createColumns() {
    let container = document.querySelector('.container')

    let url = `${apiURL}/columns`;
    let response = await fetch(url);
    columns = await response.json();
    let html = ``;

    columns.forEach(element => {
        html = `
        <div class="column" id="${element.id}">
            <h1 class="title" style="background-color: ${element.color}">${element.name}</h1>
            <ul class="list" id="${element.id + "list"}"></ul>
            <form class="form hidden card" id="${element.id + "form"}">
                    <input type="text" name="cardValue" required/>
                    <input type="hidden" name="id" value="${element.id}"/>
                    <br>
                    <button class="submitButton" type="submit">save</button>
                    <button class="clearButton" type="reset">cancel</button>
            </form>
            <button class="createButton" id="${element.id + "createButton"}" "type="button">+</button>
        </div>
        `;
        container.innerHTML += html;
    });

    document.querySelectorAll(".createButton").forEach(element => {
        let id = element.parentElement.id;
        let form = document.querySelector(`#${id + "form"}`);
        element.addEventListener('click', (e) => {
            element.classList.toggle("hidden");
            form.classList.toggle("hidden");
        })
    })

    document.querySelectorAll(".clearButton").forEach(element => {
        let id = element.parentElement.parentElement.id;
        let form = document.querySelector(`#${id + "form"}`);
        let button = document.querySelector(`#${id + "createButton"}`);
        element.addEventListener('click', (e) => {
            button.classList.toggle("hidden");
            form.classList.toggle("hidden");
        })
    })

    document.querySelectorAll(".form").forEach(element => {
        let id = element.parentElement.id;
        let button = document.querySelector(`#${id + "createButton"}`);

        element.addEventListener("submit", (e) => {
            e.preventDefault();
            new FormData(element);
            element.reset();
        })
        element.addEventListener('formdata', (e) => {
            let data = e.formData;
            let card = {
                status: data.get("id"),
                value: data.get("cardValue")
            }
            createTask(card);
            getTasks();
            element.classList.toggle("hidden");
            button.classList.toggle("hidden");
        })
    })

}

async function clearList() {
    let lists = document.querySelectorAll('.list');
    lists.forEach(element => {
        element.innerHTML = "";
    });
}

async function getTasks() {
    let url = `${apiURL}/cards`;
    let response = await fetch(url);
    cards = await response.json();
    clearList();
    cards.forEach(element => {
        let list = document.querySelector(`#${element.status + "list"}`);
        html = `
        <li class="card" id="${element.id}">
            <p>${element.value}</p>
            <button class="moveLeft" type"button">&lt;</button>
            <button class="deleteButton" type"button">🗑</button>
            <button class="moveRight" type"button">&gt;</button>
        </li>
        `;
        list.innerHTML += html;
    });

    document.querySelectorAll(".deleteButton").forEach(element => {
        element.addEventListener("click", (e) => {
            let id = element.parentElement.id;
            deleteTask(id);
            getTasks();
        });
    });

    document.querySelectorAll(".moveLeft").forEach(element => {
        element.addEventListener("click", (e) => {
            let id = element.parentElement.id;
            let card = cards.find(card => card.id == id);
            let oldStatus = columns.find(column => column.id == card.status);
            let index = columns.indexOf(oldStatus) - 1;
            if (index >= 0) {
                let newStatus = columns[index];
                card.status = newStatus.id
                updateTask(card, id);
                getTasks();
            }
        });
    });

    document.querySelectorAll(".moveRight").forEach(element => {
        element.addEventListener("click", () => {
            let id = element.parentElement.id;
            let card = cards.find(card => card.id == id);
            let oldStatus = columns.find(column => column.id == card.status);
            let index = columns.indexOf(oldStatus) + 1;
            if (index <= columns.length - 1) {
                let newStatus = columns[index];
                card.status = newStatus.id
                updateTask(card);
                getTasks();
            }
        });
    });
}

async function createTask(card) {
    let url = `${apiURL}/cards`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(card),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    getTasks();
}

async function updateTask(card) {
    let url = `${apiURL}/cards/${card.id}`;
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify(card),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    getTasks();
}

async function deleteTask(id) {
    let url = `${apiURL}/cards/${id}`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    getTasks();
}
