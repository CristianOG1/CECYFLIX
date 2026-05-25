import mongoose from 'mongoose';

const peliculaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  genero: String,
  descripcion: String
});

export default mongoose.model('Pelicula', peliculaSchema);