import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors
import config from "./configs/db-config.js";
import pkg from 'pg'


const { Client }  = pkg;
const app  = express();
const port = 3000;

// Agrego los Middlewares
app.use(cors());         // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON
//

// Acá abajo poner todos los EndPoints
// (por ejemplo)
//
app.get('/api/alumnos/', async (req, res) => {

    const cliente = new Client(config)
    try {
        await cliente.connect()
        const result = await cliente.query("SELECT * FROM ALUMNOS")
        const alumnos = result.rows;
        res.status(200).json(alumnos);
    } 
    catch (error) {
        console.error("Error al obtener provincias:", error);
        res.status(500).json({ error: error.message });
    }
    finally {
        await cliente.end()
    }
})

//app.get('/api/alumnos/:id', async (req, res) => {...})
//app.post('/api/alumnos/', async (req, res) => {...})
//app.put('/api/alumnos/', async (req, res) => {...})
//app.delete('/api/alumnos/:id', async (req, res) => {...})


//
// Inicio el Server y lo pongo a escuchar.
//

app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)

})