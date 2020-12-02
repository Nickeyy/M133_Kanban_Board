let apiURL = "http://localhost:8000"
let columns = [];

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
        </div>
        `;
        container.innerHTML += html;
    });
}

async function getTasks() {
    let url = `${apiURL}/cards`;
    let response = await fetch(url);
    cards = await response.json();
    cards.forEach(element => {
        let list = document.querySelector(`#${element.status + "list"}`);
        html = `
        <li class="card" id="${element.id}">
            <p>${element.value}</p>
        </li>
        `;
        list.innerHTML += html;
    });
}
