import { getConnection } from "../database/database.js";
import { deleteImage, uploadImage } from "../config/cloudinary.js";
import { telegramEnviarMensaje } from "../config/telegram.js";
import { twitterEnviarMensaje } from "../config/twitter.js";
import { discordEnviarMensaje } from "../config/discord.js";
import fse from "fs-extra";

const getAllNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM news order by created_at desc"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las noticias" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { newsId } = req.params;
    const data = await connection.query(
      "SELECT * FROM news WHERE id=?",
      newsId
    );
    // Transforma el resultado en JSON utilizando JSON.stringify
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la noticia" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getPublicNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM news where isPrivate=0 order by created_at desc"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las noticias" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getPinnedNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM news WHERE isAnchored=1 order by created_at desc"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las noticias" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getPublicPinnedNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM news where isPrivate=0 and isAnchored=1 order by created_at desc"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las noticias" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const createNews = async (req, res) => {
  let connection;
  let query;
  let mensaje;
  let mensajeMarkdown;
  try {
    connection = await getConnection();
    const { title, content, category, isPrivate, isAnchored } = req.body;
    if (!(title && content && category && isPrivate && isAnchored)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    let values = [title, content, category, isPrivate, isAnchored];

    query =
      "INSERT INTO news (title, content, category, isPrivate, isAnchored) VALUES(?,?,?,?,?)";
    if (req.files?.imagen) {
      query =
        "INSERT INTO news (title, content, category, isPrivate, isAnchored, image_src, ubication) VALUES(?,?,?,?,?,?,?)";

      const result = await uploadImage(req.files.imagen.tempFilePath);

      values.push(result.secure_url);
      values.push(result.public_id);
      await fse.unlink(req.files.imagen.tempFilePath);
    }
    const result = await connection.query(query, values);
    mensajeMarkdown = `📢 **¡Nueva noticia agregada exitosamente!** 📰\n- **Título:** ${title}\n- 👉 **Accede a ella mediante el siguiente enlace:**\n🔗 [Ver noticia](https://infotics.vercel.app/#/news/${result.insertId}) o https://infotics.vercel.app/#/news/${result.insertId}`;
    mensaje = `📢 ¡Nueva noticia agregada exitosamente! 📰\n- Título: ${title}\n- 👉 Accede a ella mediante el siguiente enlace:\n🔗 https://infotics.vercel.app/#/news/${result.insertId}`;
    await telegramEnviarMensaje(mensajeMarkdown);
    await discordEnviarMensaje(mensajeMarkdown);
    await twitterEnviarMensaje(mensaje);

    return res.status(200).json({
      message: "Noticia agregada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar la noticia" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const editNews = async (req, res) => {
  let connection;
  let query;
  try {
    connection = await getConnection();
    const { newsId } = req.params;
    const { title, content, category, isPrivate, isAnchored } = req.body;
    if (!(title && content && category && isPrivate && isAnchored && newsId)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const values = [title, content, category, isPrivate, isAnchored];
    const exist = await connection.query(
      "SELECT * FROM news WHERE id=?",
      newsId
    );
    query =
      "UPDATE news SET title=?, content=?, category=?, isPrivate=?, isAnchored=? WHERE id=?";
    if (req.files?.imagen) {
      query =
        "UPDATE news SET title=?, content=?, category=?, isPrivate=?, isAnchored=?, image_src=?, ubication=?  WHERE id=?";
      const result = await uploadImage(req.files.imagen.tempFilePath);
      values.push(result.secure_url);
      values.push(result.public_id);
      await fse.unlink(req.files.imagen.tempFilePath);
      if (exist[0].ubication !== null) {
        await deleteImage(exist[0].ubication);
      }
    }
    values.push(newsId);
    const result = await connection.query(query, values);
    // Transforma el resultado en JSON utilizando JSON.stringify
    return res.status(200).json({
      message: "Noticia actualizada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al editar la noticia" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const deleteNews = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { newsId } = req.params;
    if (!newsId) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    // Verificar si la noticia existe antes de intentar eliminarla
    const exist = await connection.query(
      "SELECT * FROM news WHERE id=?",
      newsId
    );
    if (exist.length === 0) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    // Eliminar la noticia
    const result = await connection.query(
      "DELETE FROM news WHERE id=?",
      newsId
    );
    // Si existía una ubicación, eliminar la imagen
    if (exist[0].ubication !== null) {
      await deleteImage(exist[0].ubication);
    }
    // Devolver una respuesta exitosa
    return res.status(200).json({ message: "Noticia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la noticia" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export {
  getAllNews,
  getNews,
  getPublicNews,
  getPinnedNews,
  getPublicPinnedNews,
  createNews,
  editNews,
  deleteNews,
};
