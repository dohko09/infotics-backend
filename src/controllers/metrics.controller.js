import { getConnection } from "../database/database.js";

const getTotalUsers = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_total_users";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el total de usuarios.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getTotalIncomeToday = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_logs_today";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los logs de hoy.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getIncomeLogsLast7Days = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_logs_last_days";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los logs de los últimos 7 días.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getTotalPublishedNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_total_news";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el total de noticias.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getIncomeLogs = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT*FROM view_logs";
    const data = await connection.query(query);
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

const getMostViewedPosts = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT*FROM view_number_views";
    const data = await connection.query(query);
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

const getMessages = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM view_messages order by created_at desc";
    const data = await connection.query(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los mensajes.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export {
  getTotalUsers,
  getTotalIncomeToday,
  getTotalPublishedNews,
  getIncomeLogsLast7Days,
  getIncomeLogs,
  getMostViewedPosts,
  getMessages,
};
