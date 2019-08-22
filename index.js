const express = require("express");

const server = express();

server.use(express.json());

let Requests = 0;
const projects = [];

function logRequests(req, res, next) {
  Requests++;

  console.log(`Requests: ${Requests}`);

  return next();
}

server.use(logRequests);

function verificaid(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Id do projeto não encontrado" });
  }

  return next();
}

//exibindo o tip de solicitação
server.use((req, res, next) => {
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  return next();
});

//cadastrando um projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  console.log(`Cadastro: ${id} - ${title}`);
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//exibindo projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.delete("/projects/:id", verificaid, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);
  return res.json({ Message: `Projeto ${id} Deletado` });
  console.log(`Deletando Projeto: ${id}`);
});

server.post("/projects/:id/tarefas", verificaid, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
