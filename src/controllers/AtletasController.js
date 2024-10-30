import Counter from "../models/Counter.js";
import Atleta from "../models/Atleta.js";
import Pelada from "../models/Pelada.js";

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

async function getAtletas(request, response) {
  try {

    const atletas = await Atleta.find().populate({
      path: "peladaId",
      select: "nomePelada", 
    });

    return response.json(atletas);
  } catch (error) {
    console.error("Erro ao buscar atletas:", error);
    return response.status(500).json({ error: "Erro ao buscar atletas" });
  }
}

async function createAtleta(request, response) {
  try {
    const { nome, posicao, passe, ataque, saque, toque, peladaId } = request.body;
    console.log("Dados recebidos:", { nome, posicao, passe, ataque, saque, toque, peladaId });

    if (!peladaId) {
      return response.status(400).json({ error: "O campo peladaId é obrigatório." });
    }

    const peladaExistente = await Pelada.findById(peladaId);
    if (!peladaExistente) {
      return response.status(404).json({ error: "Pelada não encontrada." });
    }

    const media = (passe + ataque + saque + toque) / 4;
    const nextId = await getNextSequence("atletaId");

    const novoAtleta = await Atleta.create({
      id: nextId,
      nome,
      posicao,
      passe,
      ataque,
      saque,
      toque,
      media,
      peladaId,
    });

    peladaExistente.atletas.push(novoAtleta._id);
    await peladaExistente.save();

    return response.json({
      message: "Atleta criado com sucesso e adicionado à pelada!",
      atleta: novoAtleta,
    });
  } catch (error) {
    console.error("Erro ao cadastrar atleta:", error);
    return response.status(500).json({ error: "Erro ao cadastrar atleta" });
  }
}

async function deleteAtleta(request, response) {
  const { id } = request.params;

  try {
    const atletaDeletado = await Atleta.findOneAndDelete({ id: parseInt(id) });

    if (!atletaDeletado) {
      return response.status(404).json({ error: "Atleta não encontrado" });
    }

    return response.json({ message: "Atleta deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar atleta:", error);
    return response.status(500).json({ error: "Erro ao deletar atleta" });
  }
}

async function deleteAllAtletas(request, response) {
  try {
    const resultado = await Atleta.deleteMany({});

    if (resultado.deletedCount === 0) {
      return response.status(404).json({ message: "Nenhum atleta encontrado para deletar." });
    }

    return response.json({ message: "Todos os atletas foram deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar todos os atletas:", error);
    return response.status(500).json({ error: "Erro ao deletar todos os atletas" });
  }
}

export { getAtletas, createAtleta, deleteAtleta, deleteAllAtletas };
