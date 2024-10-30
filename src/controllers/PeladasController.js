import Counter from "../models/Counter.js";
import Pelada from "../models/Pelada.js";
import Organizador from "../models/Organizador.js";

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

async function getPeladas(request, response) {
  try {
    const peladas = await Pelada.find()
      .populate("organizador", "organizadorId nome email")
      .populate("atletas", "nome posicao media");

    return response.json(peladas);
  } catch (error) {
    console.error("Erro ao buscar peladas:", error);
    return response.status(500).json({ error: "Erro ao buscar peladas" });
  }
}


async function createPelada(request, response) {
  try {
    const { organizadorId, nomePelada, ...peladaData } = request.body;

    console.log("Nome da Pelada recebido:", nomePelada);

    const organizador = await Organizador.findOne({ organizadorId });
    if (!organizador) {
      return response.status(404).json({ error: "Organizador não encontrado" });
    }

    peladaData.peladaId = await getNextSequence("peladaId");
    peladaData.organizador = organizador._id;
    peladaData.nomePelada = nomePelada;

    console.log("Dados da Pelada antes de salvar:", peladaData);

    const novaPelada = await Pelada.create(peladaData);

    organizador.peladas.push(novaPelada._id);
    await organizador.save();

    const organizadorPopulado = await Organizador.findById(organizador._id).populate("peladas");

    return response.json({
      message: "Pelada criada e associada com sucesso!",
      organizador: organizadorPopulado,
      pelada: novaPelada,
    });
  } catch (error) {
    console.error("Erro ao cadastrar pelada:", error);
    return response.status(500).json({ error: "Erro ao cadastrar pelada" });
  }
}



async function deletePelada(request, response) {
  const { id } = request.params;

  try {
    const peladaDeletada = await Pelada.findOneAndDelete({ peladaId: parseInt(id) });

    if (!peladaDeletada) {
      return response.status(404).json({ error: "Pelada não encontrada" });
    }

    return response.json({ message: "Pelada deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar pelada:", error);
    return response.status(500).json({ error: "Erro ao deletar pelada" });
  }
}

async function deleteAllPeladas(request, response) {
  try {
    const resultado = await Pelada.deleteMany({});

    return response.json({
      message: "Todas as peladas foram deletadas com sucesso!",
      deletedCount: resultado.deletedCount,
    });
  } catch (error) {
    console.error("Erro ao deletar todas as peladas:", error);
    return response.status(500).json({ error: "Erro ao deletar todas as peladas" });
  }
}

export { getPeladas, createPelada, deletePelada, deleteAllPeladas };
