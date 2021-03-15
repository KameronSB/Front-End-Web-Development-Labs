let pageSize = 12;
let currentPage;
let objectIDs;

async function loadObject(id) {
	const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
	const response = await fetch(url);
	return response.json();
}

async function loadSearch(query, isHighlight) {
	let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true`;
	if(isHighlight) {
		url = `${url}&isHighlight=${isHighlight}`;
	}
	url = `${url}&q=${query}`;
	const response = await fetch(url);
	return response.json();
}

// This function converts object data into DOM elements
function buildArticleFromData(obj) {
	const article = document.createElement("article");
	const title = document.createElement("h3");
	const primaryImageSmall = document.createElement("img");
	const primaryImage = document.createElement("img");
	const objectInfo = document.createElement("p");
	const objectName = document.createElement("span");
	const objectDate = document.createElement("span");
	const medium = document.createElement("p");

	title.textContent = obj.title;
	primaryImageSmall.src = obj.primaryImageSmall;
	primaryImageSmall.alt = `${obj.title} (small image)`;
	primaryImage.src = obj.primaryImage;
	primaryImage.alt = obj.title;
	primaryImage.className = "modal";
	objectName.textContent = obj.objectName;
	objectDate.textContent = `, ${obj.objectDate}`;
	medium.textContent = obj.medium;

	primaryImageSmall.addEventListener('click', ev => {
		primaryImage.classList.add('on');
	});
	primaryImage.addEventListener('click', ev => {
		primaryImage.classList.remove('on');
	});

	article.appendChild(title);
	article.appendChild(primaryImage);
	article.appendChild(primaryImageSmall);
	article.appendChild(objectInfo);
	article.appendChild(medium);

	objectInfo.appendChild(objectName);
	if(obj.objectDate) {
		objectInfo.appendChild(objectDate);
	}

	return article;
}

async function insertArticles(objIds) {
	objects = await Promise.all(objIds.map(loadObject))
	articles = objects.map(buildArticleFromData);
	articles.forEach(a => results.appendChild(a));
}

async function doSearch(ev) {
	clearResults();
	loader.classList.add("waiting");
	result = await loadSearch(query.value);
	objectIDs = result.objectIDs;
	count.textContent = `found ${objectIDs.length} results for "${query.value}"`;
	nPages.textContent = Math.ceil(objectIDs.length / pageSize);
	currentPage = 1;
	loadPage();
}

async function loadPage() {
	clearResults();
	const myObjects = objectIDs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	loader.classList.add("waiting");
	await insertArticles(myObjects);
	loader.classList.remove("waiting");
  pageIndicator.textContent = currentPage;
}

function nextPage() {
	currentPage += 1;
	const nPages = Math.ceil(objectIDs.length / pageSize);
	if(currentPage > nPages) { currentPage = 1;}
	loadPage();
}
function prevPage() {
	currentPage -= 1;
	const nPages = Math.ceil(objectIDs.length / pageSize);
	if(currentPage < 1) { currentPage = nPages;}
	loadPage();
}

function clearResults() {
	while(results.firstChild) {
		results.firstChild.remove();
	}
}

query.addEventListener('change', doSearch);
prev.addEventListener('click', prevPage);
next.addEventListener('click', nextPage);
