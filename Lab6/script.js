"use strict";
(() => {

	function addItem(text, done) {
		const item = document.createElement('li');
		const label = document.createElement('label');
		const input = document.createElement('input');
		const button = document.createElement('button');
		label.textContent = text;
		input.type = "checkbox";
		input.checked = done;
		input.id = `todo${todo.querySelectorAll('li').length + 1}`;
		input.addEventListener('input', ev => {
			saveToStorage();
		});
		label.htmlFor = input.id;
		button.textContent = "×";
		button.addEventListener('click', ev => {
			item.remove();
			saveToStorage();
		});
		item.appendChild(input);
		item.appendChild(label);
		item.appendChild(button);
		todo.appendChild(item);
	}

	function clearList() {
		while(todo.firstChild) {
			todo.removeChild(todo.firstChild);
		}
	}

	function saveToStorage() {
		const elements = Array.from(todo.querySelectorAll('li'));
		const data = elements.map(el => {
			return {
				text: el.querySelector('label').textContent,
				done: el.querySelector('input').checked
			}
		});
		localStorage.setItem(todo.id, JSON.stringify(data));
	}

	function loadFromStorage() {
		const data = JSON.parse(localStorage.getItem(todo.id));
		if(data) {
			clearList();
			for (const item of data) {
				addItem(item.text, item.done);
			}
		}
	}

	add.addEventListener('click', ev => {
		if(text.value) {
			addItem(text.value);
			text.value = null;
			text.focus();
			saveToStorage();
		}
	});

	clear.addEventListener('click', ev => {
		clearList();
		saveToStorage();
	});

	text.addEventListener('keydown', ev => {
		if(ev.key == "Enter") {
			add.click();
		}
	});

	loadFromStorage();
})()
