const inputButton = document.querySelector('.input-button');
const list = document.querySelector('.list');
const inputValue = document.forms.group;

init();

function init() {
	getListItems();
	inputButtonEventListener();
	deleteIssueEventListener();
	changeStatusEventListener();
}

function getListItems() {
	const listRequest = sendGetListRequest();
	listRequest.then((issues) => renderList(issues))
}

function sendGetListRequest() {
	return fetch('https://jsonplaceholder.typicode.com/todos')
		.then((response) => response.json())
}

function renderList(issues) {
	const listItems = issues.map(issue => toDoItem(issue));
	list.innerHTML = listItems.join('');
}

function createIssue() {
	const issue = getFormData();
	sendPostListRequest(issue)
		.then(issue => {
			clearInput();
			renderIssue(issue);
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

function renderIssue(issue) {
	list.insertAdjacentHTML('afterbegin', toDoItem(issue));
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

function toDoItem(issue) {
	const doneClass = issue.completed ? 'done' : 'not-done';
	return `
		<li data-id="${issue.id + list.children.length}" class="list-issue">
			<p class="list-issue-text ${doneClass}">${issue.title}</p>
			<i class="button list-issue-delete-button far fa-trash-alt "></i>
		</li>
		`
}

function inputButtonEventListener() {
	inputButton.addEventListener('click', () => {
		createIssue();
	})
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

function changeStatusEventListener() {
	issueStatusToggle();
}

function issueStatusToggle() {
	list.addEventListener('click', (event) => {
		if (event.target.classList.contains('list-issue-text')) {
			const idIssue = event.target.closest('li').dataset.id;
			sendGetIssuetRequest(idIssue);
			event.target.classList.toggle('done');

		}
	})
}

function sendGetIssuetRequest(idIssue) {
	return fetch(`https://jsonplaceholder.typicode.com/todos/${idIssue}`)
		.then((response) => response.json())
		.then((issue) => {
			const newIssue = {
				...issue,
				completed: !issue.completed,
			};
			return fetch(`https://jsonplaceholder.typicode.com/todos/${idIssue}`, {
				method: 'PUT',
				body: JSON.stringify(newIssue),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})
		})
}
