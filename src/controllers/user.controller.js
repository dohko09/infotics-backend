import { getConnection } from "../database/database.js";
import { comparePassword, encriptyngPassword } from "../config/hash.js";
import { generateToken } from "../config/jwt.js";

const getUsers = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM users";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al obtener datos de usuarios. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const editProfile = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    let { full_name, pin, oldPin } = req.body;
    const { userId } = req.params;
    if (
      full_name === null ||
      userId === null ||
      pin === null ||
      oldPin === null
    ) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const queryCheckPin = "SELECT pin FROM users WHERE id = ?";
    const checkPinValues = [userId];
    const checkPin = await connection.query(queryCheckPin, checkPinValues);
    const checkPinHash = checkPin[0].pin;
    const checkPinResult = await comparePassword(oldPin, checkPinHash);
    if (!checkPinResult) {
      return res.status(400).json({
        message: "El pin ingresado no coincide con el pin actual.",
      });
    }
    const hash = await encriptyngPassword(pin);
    const sentencia = "UPDATE users SET full_name=?, pin=? WHERE id = ?";
    const valores = [full_name, hash, userId];
    const resultadoSentencia = await connection.query(sentencia, valores);

    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    const queryCheckId =
      "SELECT id, full_name, mail, category FROM users WHERE id = ?";
    const checkIdValues = [userId];

    const respuesta = await connection.query(queryCheckId, checkIdValues);

    const { id, mail, category } = respuesta[0];
    full_name = respuesta[0].full_name;

    const userData = {
      id,
      full_name,
      mail,
      category,
    };
    const token = generateToken({ userData }, "1h");
    const user = { id, full_name, mail, category, token };
    return res.status(200).json({
      message: "Información actualizada con éxito.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const editProfileNoPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    let { full_name } = req.body;
    const { userId } = req.params;
    if (full_name === null || userId === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const sentencia = "UPDATE users SET full_name=? WHERE id = ?";
    const valores = [full_name, userId];

    const resultadoSentencia = await connection.query(sentencia, valores);

    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    const queryCheckId =
      "SELECT id, full_name, mail, category FROM users WHERE id = ?";
    const checkIdValues = [userId];

    const respuesta = await connection.query(queryCheckId, checkIdValues);

    const { id, mail, category } = respuesta[0];
    full_name = respuesta[0].full_name;

    const userData = {
      id,
      full_name,
      mail,
      category,
    };
    const token = generateToken({ userData }, "1h");
    const user = { id, full_name, mail, category, token };
    return res.status(200).json({
      message: "Información actualizada con éxito.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const updateUser = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { full_name, category, pin } = req.body;
    const { userId } = req.params;
    if (
      full_name === null ||
      userId === null ||
      category === null ||
      pin === null
    ) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const hash = await encriptyngPassword(pin);
    const sentencia =
      "UPDATE users SET full_name=?, pin=?, category=? WHERE id = ?";
    const valores = [full_name, hash, category, userId];
    const resultadoSentencia = await connection.query(sentencia, valores);
    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    return res.status(200).json({
      message: "Información actualizada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const updateUserNoPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { full_name, category } = req.body;
    const { userId } = req.params;
    if (full_name === null || userId === null || category === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const sentencia = "UPDATE users SET full_name=?, category=? WHERE id = ?";
    const valores = [full_name, category, userId];
    const resultadoSentencia = await connection.query(sentencia, valores);

    if (resultadoSentencia.length === 0) {
      return res.status(400).json({
        message: "Error al actualizar la información del perfil.",
      });
    }
    return res.status(200).json({
      message: "Información actualizada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const deleteUser = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { userId } = req.params;
    if (userId === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const query = "DELETE FROM users WHERE id=?";
    const values = [userId];
    const response = await connection.query(query, values);
    if (response.length === 0) {
      return res.status(400).json({
        message: "Error al eliminar el usuario. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json({
      message: "Usuario eliminado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el usuario. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const createMessage = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { id, message } = req.body;
    if (id === null || message === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const query = "INSERT INTO messages (user, message) VALUES (?,?)";
    const values = [id, message];

    const response = await connection.query(query, values);
    if (response.length === 0) {
      return res.status(400).json({
        message: "Error al enviar el mensaje. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json({
      message: "Mensaje enviado con éxito.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al enviar el mensaje. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const addView = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { user, news } = req.body;
    if (!(user && news)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    // Verificar si el correo existe en la base de datos
    const insertLog = "INSERT INTO user_news(user, news) VALUES(?, ?)";
    const values = [user, news];
    const respuesta = await connection.query(insertLog, values);
    return respuesta;
  } catch (error) {
    return res.status(500).json({
      message: "Registro de visualización fallido.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getViewsByUser = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const query = "CALL sp_view_logs_news(?)";
    const values = [userId];

    const data = await connection.query(query, values);
    if (data.length === 0) {
      return res.status(400).json({
        message:
          "Error al obtener la información. Por favor, intenta nuevamente.",
      });
    }
    return res.status(200).json(data);
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

export {
  getUsers,
  editProfile,
  editProfileNoPassword,
  updateUser,
  updateUserNoPassword,
  deleteUser,
  createMessage,
  addView,
  getViewsByUser,
};
