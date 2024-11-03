import { Router } from "express";
import {
  getAtletas,
  createAtleta,
  deleteAtleta,
  deleteAllAtletas,
} from "./controllers/AtletasController.js";

import {
  getOrganizadores,
  createOrganizador,
  deleteOrganizador,
  deleteAllOrganizadores,
  login,
  logout,
} from "./controllers/OrganizadoresController.js";

import {
  getPeladas,
  createPelada,
  deletePelada,
  deleteAllPeladas,
} from "./controllers/PeladasController.js";

const routes = Router();
routes.get("/atletas", getAtletas);
routes.post("/atletas", createAtleta);
routes.delete("/atletas/:id", deleteAtleta);
routes.delete("/atletas", deleteAllAtletas);

routes.get("/organizadores", getOrganizadores);
routes.post("/organizadores", createOrganizador);
routes.delete("/organizadores/:id", deleteOrganizador);
routes.delete("/organizadores", deleteAllOrganizadores);

routes.post("/login", login);
routes.post("/logout", logout);

routes.get("/peladas", getPeladas);
routes.post("/peladas", createPelada);
routes.delete("/peladas/:id", deletePelada);
routes.delete("/peladas", deleteAllPeladas);

export default routes;
