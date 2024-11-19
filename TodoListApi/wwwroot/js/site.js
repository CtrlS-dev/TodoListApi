const uri = 'api/todoitems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => {
            todos = data;
            _displayItems(data);
        })
        .catch(error => console.error('Unable get items', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    }
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = "";
        })
        .catch(error => console.error('Unable to add item', error));
}
function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item', error))
}
    

function updateItem(id) {
    const item = todos.find(item => item.id === id);
    const itemRow = document.getElementById(`row-${id}`);
    const nameInput = itemRow.querySelector('.edit-name');
    const isCompleteCheckbox = itemRow.querySelector('.edit-isComplete');

    item.name = nameInput.value.trim();
    item.isComplete = isCompleteCheckbox.checked;

    fetch(`${uri}/${id}`, {
        method: 'PUT',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item', error))
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-dos' : 'todo-do';
    document.getElementById('counter').innerText = `${itemCount} ${name}`
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let tr = tBody.insertRow();
        tr.setAttribute('id', `row-${item.id}`);

        let tdl = tr.insertCell(0);
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.className = 'edit-isComplete';
        isCompleteCheckbox.checked = item.isComplete
        tdl.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'edit-name';
        nameInput.value = item.name;
        td2.appendChild(nameInput);

        let td3 = tr.insertCell(2);
        let saveButton = button.cloneNode(false);
        saveButton.innerHTML = 'Update';
        saveButton.setAttribute ('onclick', `updateItem(${item.id})`);
        td3.appendChild(saveButton);

        let td4 = tr.insertCell(3);
        let deleteButton = button.cloneNode(false);
        deleteButton.innerHTML = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        td4.appendChild(deleteButton);
    })
}