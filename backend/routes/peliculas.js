import express from 'express';

import Pelicula from '../models/pelicula.js';

const router = express.Router();

// Obtener películas
router.get('/', async (req, res) => {

  try {

    const peliculas = await Pelicula.find();

    res.json(peliculas);

  } catch (error) {

    res.status(500).json({
      mensaje: 'Error al obtener películas'
    });

  }

});

export default router;