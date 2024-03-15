import { getConnection } from "../database/database.js";
import { deleteImage, uploadDocument } from "../config/cloudinary.js";

import { telegramEnviarMensaje } from "../config/telegram.js";
import { twitterEnviarMensaje } from "../config/twitter.js";
import { discordEnviarMensaje } from "../config/discord.js";

import fse from "fs-extra";
const getAllDocuments = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM documents where category='Documento' order by created_at desc"
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

const getDocument = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const data = await connection.query(
      "SELECT * FROM documents WHERE id=?",
      documentId
    );
    // Transforma el resultado en JSON utilizando JSON.stringify
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el documento" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const getPublicDocuments = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const data = await connection.query(
      "SELECT * FROM documents where isPrivate=0 and category='Documento' order by created_at desc"
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

const createDocument = async (req, res) => {
  let connection;
  let query;
  let mensaje;
  let mensajeMarkdown;
  let extension;

  try {
    connection = await getConnection();
    const { title, category, isPrivate } = req.body;
    if (!(title && category && isPrivate)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    let values = [title, category, isPrivate];

    if (req.files?.file) {
      query =
        "INSERT INTO documents (title, category, isPrivate, document_src, ubication) VALUES(?,?,?,?,?)";
      const mimeType = req.files.file.mimetype;

      if (mimeType === "application/msword") {
        extension = "doc";
      } else if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extension = "docx";
      } else if (mimeType === "application/pdf") {
        extension = "pdf";
      } else if (mimeType === "application/vnd.ms-excel") {
        extension = "xls";
      } else if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        extension = "xlsx";
      } else if (mimeType === "application/vnd.ms-powerpoint") {
        extension = "ppt";
      } else if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        extension = "pptx";
      }

      const result = await uploadDocument(
        req.files.file.tempFilePath,
        extension
      );

      values.push(result.secure_url);
      values.push(result.public_id);
      await fse.unlink(req.files.file.tempFilePath);
    }
    const result = await connection.query(query, values);
    mensajeMarkdown = `📢 **¡Nuevo documento agregado exitosamente!** 📰\n- **Título:** ${title}\n- 👉 **Accede a el mediante el siguiente enlace:**\n🔗 [Ver documento](https://infotics.vercel.app/#/document/${result.insertId}) o https://infotics.vercel.app/#/document/${result.insertId}`;
    mensaje = `📢 ¡Nuevo documento agregado exitosamente! 📰\n- Título: ${title}\n- 👉 Accede a el mediante el siguiente enlace:\n🔗 https://infotics.vercel.app/#/document/${result.insertId}`;
    await telegramEnviarMensaje(mensajeMarkdown);
    await discordEnviarMensaje(mensajeMarkdown);
    await twitterEnviarMensaje(mensaje);

    return res.status(200).json({
      message: "Publicación agregada con éxito.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar la publicación" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const deleteDocument = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { documentId } = req.params;
    if (!documentId) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    // Verificar si el documento existe antes de intentar eliminarlo
    const exist = await connection.query(
      "SELECT * FROM documents WHERE id=?",
      documentId
    );
    if (exist.length === 0) {
      return res.status(404).json({ error: "El documento no existe" });
    }

    // Eliminar el documento
    const result = await connection.query(
      "DELETE FROM documents WHERE id=?",
      documentId
    );

    // Si existía una ubicación, eliminar el documento
    if (exist[0].ubication !== null) {
      await deleteImage(exist[0].ubication);
    }

    // Devolver una respuesta exitosa
    return res
      .status(200)
      .json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el documento" });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export {
  getAllDocuments,
  getDocument,
  getPublicDocuments,
  createDocument,
  deleteDocument,
};
