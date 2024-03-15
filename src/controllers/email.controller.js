import { getConnection } from "../database/database.js";

const getEmails = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM mails";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al obtener los correos electronicos. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const addEmail = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { mail, role } = req.body;
    if (!(mail && role)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const checkEmail = "SELECT mail FROM mails WHERE mail = ?";
    const emailValues = [mail];
    const resultExists = await connection.query(checkEmail, emailValues);
    if (resultExists.length > 0) {
      return res.status(400).json({
        message: "El correo electronico ya existe.",
      });
    }
    const query = "INSERT INTO mails (mail, role) VALUES (?,?)";
    const values = [mail, role];
    const response = await connection.query(query, values);
    if (response.length === 0) {
      return res.status(400).json({
        message:
          "Error al registrar el correo electronico. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json({
      message: "Correo electronico registrado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al registrar el correo electronico. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const editEmail = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { mail, role } = req.body;
    const { emailId } = req.params;
    if (mail === null || emailId === null || role === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const checkEmail = "SELECT * FROM mails WHERE mail = ?";
    const emailValues = [mail];

    const resultExists = await connection.query(checkEmail, emailValues);

    if (resultExists.length > 0) {
      return res.status(400).json({
        message: "El correo electronico ya existe.",
      });
    }

    const query = "UPDATE mails SET mail=?, role=? WHERE id=?";
    const values = [mail, role, emailId];

    const response = await connection.query(query, values);

    if (response.length === 0) {
      return res.status(400).json({
        message:
          "Error al actualizar el correo electronico. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json({
      message: "Correo electronico actualizado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al actualizar el correo electronico. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const deleteEmail = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { emailId } = req.params;
    if (emailId === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const query = "DELETE FROM mails WHERE id=?";
    const values = [emailId];

    const response = await connection.query(query, values);

    if (response.length === 0) {
      return res.status(400).json({
        message:
          "Error al eliminar el correo electronico. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json({
      message: "Correo electronico eliminado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al eliminar el correo electronico. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export { getEmails, addEmail, editEmail, deleteEmail };
