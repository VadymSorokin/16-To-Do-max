const deleteButton = document.querySelector('.list-issue-delete-button');
const inputButton = document.querySelector('.input-button');
const inputIssue = document.querySelector('.input-issue'); //удалить
const list = document.querySelector('.list');
const listIssue = document.querySelector('.list-issue');
const issueText = document.querySelector('.list-issue-text');
const inputValue = document.forms.group;

init();

function init() {
	getListItems();
	inputButtonEventListener();
	deleteIssueEventListener();
	changeStatusEventListener()
}

function getListItems() {
	const listRequest = sendGetListRequest();
	listRequest.then((issues) => {
		renderList(issues)
	})
}

function sendGetListRequest() {
	return fetch('https://jsonplaceholder.typicode.com/todos')
		.then((response) => response.json())
}

function sendPostListRequest(issue) {
	return fetch('https://jsonplaceholder.typicode.com/todos', {
			method: 'POST',
			body: JSON.stringify(issue),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
		.then((response) => response.json())
}

function sendDeleteListRequest(id) {
	return fetch(`https://jsonplaceholder.typicode.com/todos/'${id}'`, {
		method: 'DELETE'
	})
}

function renderList(issues) {
	const listItems = issues.map(issue => `
	<li data-id="${issue.id}" class="list-issue">
		<p class="list-issue-text">${issue.title}</p>
		<input class="button list-issue-delete-button" type="button" value="delete">
	</li>
	`);
	list.innerHTML = listItems.join('');
}

function renderIssue(issue) {
	list.insertAdjacentHTML('afterbegin', `
	<li data-id="${list.children.length + 1}" class="list-issue">
		<p class="list-issue-text">${issue.title}</p>
		<input class="button list-issue-delete-button" type="button" value="delete">
	</li>
	`);
}

function inputButtonEventListener() {
	inputButton.addEventListener('click', () => {
		createIssue();
	})
}

function createIssue() {
	const issue = getFormData();
	sendPostListRequest(issue)
		.then(issue => {
			clearInput();
			renderIssue(issue);
		});
}

function deleteIssueEventListener() {
	list.addEventListener('click', (event) => {

		if (event.target.classList.contains('list-issue-delete-button')) {
			deleteIssue(event);
		}
	})
}

function deleteIssue(event) {
	const parentList = event.target.closest('li');
	const id = parentList.dataset.id;
	sendDeleteListRequest(id)
		.then(() => {
			const issueDelete = list.querySelector(`li[data-id ='${id}']`);
			issueDelete.remove();
		});
}

function getFormData() {
	const formData = new FormData(inputValue);

	return {
		title: formData.get('input-item'),
		completed: false,
		userId: list.children.length + 1,
	}
}

function clearInput() {
	inputValue.reset();
}

function changeStatusEventListener() {
	list.addEventListener('click', (event) => {
		if (event.target.classList.contains('list-issue-text')) {
			const targetId = getTargetId(event);
			const targetStatus = sendGetTargetStatus(targetId);
		}
	})
}

function getTargetId(event) {
	return event.target.closest('li').dataset.id;
}

function sendGetTargetStatus(targetId) {
	return fetch(`https://jsonplaceholder.typicode.com/todos/${targetId}`)
		.then((response) => response.json())
		.then(status => status.completed;)
}
