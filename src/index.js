const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {

  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repositories[repositoryIndex];

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

  const { repository } = request;
  const updatedRepository = request.body;

  delete updatedRepository.likes

  const updateRepository = { ...repository, ...updatedRepository };

  repositories[repositoryIndex] = updateRepository;

  return response.json(updateRepository);

});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {

  const { repository } = request;

  const repositoryIndex = repositories.indexOf(repository);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {

  const { repository } = request;

  repositoryIndex = repositories.findIndex(_repository => _repository === repository);

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
