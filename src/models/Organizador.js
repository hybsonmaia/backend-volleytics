import mongoose from "mongoose";

const organizadorSchema = new mongoose.Schema({
  organizadorId: {
    type: Number,
    unique: true,
  },
  nome: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  senha: {
    type: String,
  },
  peladas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pelada',
    },
  ],
});

export default mongoose.model("Organizador", organizadorSchema);
