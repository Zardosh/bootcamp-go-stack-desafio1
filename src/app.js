const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
	const { id } = request.params;

	if (!isUuid(id)) {
		return response.status(400).json({ error: 'Invalid project ID.' });
	}

	return next();
}

function doesProjectExist(request, response, next) {
	const { id } = request.params;

	const projectIndex = repositories.findIndex(project => project.id === id);

	if (projectIndex < 0) {
		return response.status(400).json({ error: 'Project does not exist.' });
	}

	return next();
}

app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body;

	const project = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	};

	repositories.push(project);

	return response.json(project);
});

app.put("/repositories/:id", validateProjectId, doesProjectExist, (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const project = repositories.find(project => project.id === id);

	project.title = title ? title : project.title;
	project.url = url ? url : project.url;
	project.techs = techs ? techs : project.techs;

	return response.json(project);
});

app.delete("/repositories/:id", validateProjectId, doesProjectExist, (request, response) => {
	const { id } = request.params;
	
	const projectIndex = repositories.findIndex(project => project.id === id);

	repositories.splice(projectIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, doesProjectExist, (request, response) => {
	const { id } = request.params;

	const project = repositories.find(project => project.id === id);

	project.likes += 1;

	return response.json(project);
});

module.exports = app;
