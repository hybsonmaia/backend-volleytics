import mongoose from "mongoose";

const atletaSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  nome: {
    type: String,
    required: true,
    unique: true,
  },
  posicao: {
    type: String,
    required: true,
  },
  passe: {
    type: Number,
    required: true,
  },
  ataque: {
    type: Number,
    required: true,
  },
  saque: {
    type: Number,
    required: true,
  },
  toque: {
    type: Number,
    required: true,
  },
  media: {
    type: Number,
  },
  createadAt: {
    type: Date,
    default: Date.now(),
  },
  peladaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelada",
  },
});

export default mongoose.model("Atleta", atletaSchema);
