import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors
import config from "./configs/db-config.js";
import pkg from 'pg'
//import client from "pg/lib/native/client.js";


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
        //console.log("Alumnos obtenidos:", alumnos);
        res.status(200).json(alumnos);
    } 
    catch (error) {
        console.error("Error al obtener estudiantes:", error);
        res.status(500).json({ error: error.message });
    }
    finally {
        await cliente.end()
    }
})

app.get('/api/alumnos/:id', async (req, res) => {
    const cliente = new Client(config)
    const id = req.params.id;
    if(isNaN(Number(id))){
        return res.status(400).json({ error: "El ID debe ser un número" });
    }
    
    try {
        await cliente.connect()
        const result = await cliente.query("SELECT * FROM ALUMNOS WHERE ID = $1", [id]);
        const alumno = result.rows[0];
        
        //si no encuentra el alumno, devuelve un error 404
        if (!alumno) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
        //si lo encuentra, devuelve el alumno
        console.log("Alumno obtenido:", alumno);
        res.status(200).json(alumno);

    } catch (error) {
        console.error("Error al obtener el estudiante:", error);
        res.status(500).json({ error: error.message });
    }
    finally{
        await cliente.end()
    }


})


app.post('/api/alumnos/', async (req, res) => {
    const cliente = new Client(config)
    const { nombre, apellido, idCurso, fechaNacimiento, haceDeportes } = req.body;

    if (!nombre || !apellido || !idCurso || isNaN(Number(idCurso)) || !fechaNacimiento || haceDeportes === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        await cliente.connect();
        const result = await cliente.query(
            "INSERT INTO ALUMNOS (NOMBRE, APELLIDO, ID_CURSO ,FECHA_NACIMIENTO, HACE_DEPORTES) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [nombre, apellido, idCurso, fechaNacimiento, haceDeportes]
        );
        res.status(201).json(result.rows[0]);
        console.log("Alumno creado:", result.rows[0]);
    } catch (error) {
        console.error("Error al crear el estudiante:", error);
        res.status(500).json({ error: error.message });
    }
})


app.put('/api/alumnos/', async (req, res) => {
    const cliente = new Client(config)
    const {id, nombre, apellido, idCurso, fechaNacimiento, haceDeportes } = req.body;

    if (!id || !nombre || !apellido || !idCurso || isNaN(Number(idCurso)) || !fechaNacimiento || haceDeportes === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        await cliente.connect();
        const result = await cliente.query(
            "UPDATE ALUMNOS SET NOMBRE = $1, APELLIDO = $2, ID_CURSO = $3, FECHA_NACIMIENTO = $4, HACE_DEPORTES = $5 WHERE ID = $6 RETURNING *",
            [nombre, apellido, idCurso, fechaNacimiento, haceDeportes, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });  
        }

        res.status(201).json(result.rows[0]);
        console.log("Alumno modificado:", result.rows[0]);
    } catch (error) {
        console.error("Error al ACTUALIZAR el estudiante:", error);
        res.status(500).json({ error: error.message });
    }
})


app.delete('/api/alumnos/:id', async (req, res) => {
    const cliente = new Client(config)
    const id = req.params.id;

    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "El ID debe ser un número" });
    }

    try {
        await cliente.connect();
        const result = await cliente.query("DELETE FROM ALUMNOS WHERE ID = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }

        res.status(200).json({ message: "Estudiante eliminado correctamente" });
        console.log("Alumno eliminado:", result.rows[0]);
    } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
        res.status(500).json({ error: error.message });
    }
    finally {
        await cliente.end()
    }

})

//
// Inicio el Server y lo pongo a escuchar.
//
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})