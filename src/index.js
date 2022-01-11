const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  const { id } = request.params;

  // const validateId = validate(id);

  // if(!validateId) {
  //   return response.status(400).json({ error: "Id provided is not a valid uuid" });
  // }

  const repository = repositories.find(repo => repo.id === id);
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if(!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;
  request.repositoryIndex = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepository, (request, response) => {
  // const { id } = request.params;
  // const updatedRepository = request.body;
  const { title, url, techs } = request.body;
  const { repository, repositoryIndex } = request;

  // const repositoryIndex = repositories.findindex(repository => repository.id === id);
  // const repositoryIndex = repositories.findIndex(repository);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  // const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repositoryIndex } = request;

  // const repositoryIndex = repositories.findIndex(repository);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {
  const { repository, repositoryIndex } = request;

  // const repositoryIndex = repositories.findIndex(repository);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  // const likes = ++repositories[repositoryIndex].likes;

  repository.likes += 1;

  repositories[repositoryIndex] = repository;

  return response.json({ likes: repository.likes });
});

module.exports = app;
