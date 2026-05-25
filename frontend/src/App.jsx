import { useEffect, useState } from 'react'

import './index.css'

function App() {

  const [peliculas, setPeliculas] = useState([])
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([])

  const [input, setInput] = useState('')

  const [recomendacionIA, setRecomendacionIA] = useState('')

  // Obtener películas
  useEffect(() => {

    fetch('http://localhost:4000/api/peliculas')
      .then(res => res.json())
      .then(data => {

        setPeliculas(data)
        setPeliculasFiltradas(data)

      })

  }, [])

  // Buscar normal
  const handleBuscarTexto = () => {

    const texto = input.toLowerCase()

    const filtradas = peliculas.filter((peli) =>

      peli.titulo.toLowerCase().includes(texto) ||
      peli.genero.toLowerCase().includes(texto)

    )

    setPeliculasFiltradas(filtradas)

    setRecomendacionIA('')

  }

  // Buscar IA
  const handleBuscarDescripcion = async () => {

    setRecomendacionIA('Pensando...')

    try {

      const response = await fetch(
        'http://localhost:4000/api/recomendaciones',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            prompt:
              `Tengo estas películas:
              ${peliculas.map(p => p.titulo).join(', ')}

              Recomiéndame películas que coincidan con:
              "${input}"`

          })

        }
      )

      const data = await response.json()

      setRecomendacionIA(data.recomendacion)

    } catch (err) {

      setRecomendacionIA('❌ Error con IA')

    }

  }

  return (

    <div className="App">

      <h1 className="titulo">
        CECYFLIX 🎬
      </h1>

      <div className="buscador">

        <input
          type="text"
          placeholder="¿Qué quieres ver?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={handleBuscarTexto}>
          Buscar
        </button>

        <button
          className="btn-ia"
          onClick={handleBuscarDescripcion}
        >
          Buscar por IA
        </button>

      </div>

      {
        recomendacionIA && (

          <div className="bloque-recomendaciones">

            <h2>✨ IA Recomienda</h2>

            <p>{recomendacionIA}</p>

          </div>

        )
      }

      <div className="grid">

        {
          peliculasFiltradas.map((peli, i) => (

            <div className="tarjeta" key={i}>


              <div className="info">

                <h3>{peli.titulo}</h3>

                <p>{peli.descripcion}</p>

                <span>{peli.genero}</span>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default App