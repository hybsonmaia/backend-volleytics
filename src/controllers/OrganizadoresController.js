import Counter from "../models/Counter.js";
import Organizador from "../models/Organizador.js";
import Pelada from "../models/Pelada.js";
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

async function getOrganizadores(request, response) {
  try {
    const organizadores = await Organizador.find().populate({
      path: "peladas",
      model: "Pelada"
    });
    
    const organizadoresSemSenha = organizadores.map(organizador => {
      const organizadorObj = organizador.toObject();
      delete organizadorObj.senha;
      return organizadorObj;
    });

    return response.json(organizadoresSemSenha);
  } catch (error) {
    console.error("Erro ao obter organizadores:", error);
    return response.status(500).json({ error: "Erro ao obter organizadores" });
  }
}

async function createOrganizador(request, response) {
  try {
    const { nome, email, nomePelada, senha } = request.body;

    const saltRounds = 10;
    const hashedSenha = await bcrypt.hash(senha, saltRounds);

    const novoOrganizador = await Organizador.create({
      organizadorId: await getNextSequence("organizadorId"),
      nome,
      email,
      nomePelada,
      senha: hashedSenha,
      peladas: [],
    });

    const pelada = await Pelada.create({
      peladaId: await getNextSequence("peladaId"),
      nomePelada: nomePelada,
      organizador: novoOrganizador._id,
      atletas: [],
    });

    novoOrganizador.peladas.push(pelada._id);
    await novoOrganizador.save();

    await novoOrganizador.populate({
      path: "peladas",
      model: "Pelada",
    });

    return response.json({
      message: "Organizador e pelada criados com sucesso!",
      organizador: novoOrganizador,
    });

  } catch (error) {
    console.error("Erro ao cadastrar organizador e pelada:", error);
    return response.status(500).json({ error: "Erro ao cadastrar organizador e pelada" });
  }
}

async function deleteOrganizador(request, response) {
  const { id } = request.params;

  try {
    const organizadorDeletado = await Organizador.findOneAndDelete({ organizadorId: parseInt(id) });

    if (!organizadorDeletado) {
      return response.status(404).json({ error: "Organizador não encontrado" });
    }

    return response.json({ message: "Organizador deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar organizador:", error);
    return response.status(500).json({ error: "Erro ao deletar organizador" });
  }
}

async function deleteAllOrganizadores(request, response) {
  try {
    const resultado = await Organizador.deleteMany({});

    if (resultado.deletedCount === 0) {
      return response.status(404).json({ message: "Nenhum organizador encontrado para deletar." });
    }

    return response.json({ message: "Todos os organizadores foram deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar todos organizadores:", error);
    return response.status(500).json({ error: "Erro ao deletar todos organizadores" });
  }
}

async function login(request, response) {
  try {
    const { email, senha } = request.body;
    const organizador = await Organizador.findOne({ email });

    if (!organizador || !bcrypt.compareSync(senha, organizador.senha)) {
      return response.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: organizador._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const pelada = await Pelada.findOne({ organizador: organizador._id });

    return response.json({
      message: "Login realizado com sucesso!",
      token,
      peladaId: pelada ? pelada._id : null,
      nomePelada: pelada ? pelada.nomePelada : null,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return response.status(500).json({ error: "Erro ao fazer login" });
  }
}

router.post('/logout', (req, res) => {
  return res.json({ message: "Logout realizado com sucesso!" });
});

export { getOrganizadores, createOrganizador, deleteOrganizador, deleteAllOrganizadores, login, logout };

