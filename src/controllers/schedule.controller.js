import { getConnection } from "../database/database.js";

const getAllSchedules = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM documents where category='Horario' order by created_at desc"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los documentos" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getSchedule = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { scheduleId } = req.params;
    if (!scheduleId) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const data = await connection.query(
      "SELECT * FROM documents WHERE id=?",
      scheduleId
    );
    // Transforma el resultado en JSON utilizando JSON.stringify
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el horario" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getPublicSchedules = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM documents where isPrivate=0 and category='Horario' order by created_at desc"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los documentos" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export { getAllSchedules, getSchedule, getPublicSchedules };