import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

import peliculasRouter from './routes/peliculas.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/peliculas', peliculasRouter);

// IA OPENROUTER
app.post('/api/recomendaciones', async (req, res) => {

  const { prompt } = req.body;

  try {

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/cypher-alpha:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const recomendacion =
      response.data.choices[0].message.content;

    res.json({ recomendacion });

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: 'Error IA'
    });

  }

});

app.listen(4000, () => {
  console.log('🚀 Servidor en puerto 4000');
});