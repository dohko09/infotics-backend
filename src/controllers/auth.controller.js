import { getConnection } from "../database/database.js";
import { transporter } from "../config/mailer.js";
import {
  encriptyngPassword,
  comparePassword,
  generateNewPassword,
} from "../config/hash.js";
import {
  generateToken,
  generateTokenWithoutTime,
  verifyToken,
} from "../config/jwt.js";

import {
  euclideanDistance,
  encryptBiometrics,
  decryptBiometrics,
  getInitializationVector,
} from "../config/utils.js";

const register = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { name, email, pin } = req.body;
    if (!(name && email && pin)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    const checkEmail = "SELECT mail FROM mails WHERE mail = ?";
    const emailValues = [email];
    const resultExists = await connection.query(checkEmail, emailValues);

    if (resultExists.length === 0) {
      return res.status(400).json({
        message: "El correo no existente en la base de datos.",
      });
    }

    // Verificar si el correo ya existe en la base de datos
    const queryCheckEmail = "SELECT mail FROM users WHERE mail = ?";
    const checkEmailValues = [email];

    const result = await connection.query(queryCheckEmail, checkEmailValues);

    if (result.length > 0) {
      return res.status(400).json({
        message: "El correo ya está registrado a una cuenta.",
      });
    }

    const hash = await encriptyngPassword(pin);
    const token = generateToken({ email: email }, "3h");
    const query = "CALL sp_insert_user(?, ?, ?, ?)";
    const values = [name, email, hash, token];

    const response = await connection.query(query, values);
    if (!response[0][0].respuesta === "ok") {
      return res.status(400).json({
        message:
          "Error al registrar el usuario. Por favor, intenta nuevamente.",
      });
    }
    /*return res.status(200).json({
          message:
            "Usuario registrado. Por favor, verifica tu correo electrónico para activar tu cuenta.",
        });*/
    const activationLink = `https://infotic-api.up.railway.app/api/v1/auth/activate-account/${token}`;
    const groupTelegram = `https://t.me/+jW1E_Bs1-OkzOWVh`;
    const channelDiscord = `https://discord.gg/vJAYBUqeNg`;
    const profileTwitter = `https://twitter.com/cmentordev`;
    const mailOptions = {
      from: "Department Dev - Code Mentor <ecuadorpro2000@gmail.com>",
      to: email,
      subject: "Activación de cuenta",
      html: `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; text-align: center;">
      <h1 style="color: #333;">¡Bienvenido a InfoTICs! 📰</h1>
      <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>
      <p style="text-align: center;">
          <a href="${activationLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Activar cuenta</a>
      </p>
      <p style="margin-top: 20px;">Enlace para ingresar al grupo de Telegram:
      </p>
      <p style="text-align: center;">
          <a href="${groupTelegram}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0072b1; color: #fff; text-decoration: none; border-radius: 5px;">Unirme al grupo</a>
      </p>
      <p style="margin-top: 20px;">Enlace para ingresar al canal de Discord:
      </p>
      <p style="text-align: center;">
          <a href="${channelDiscord}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #7289da; color: #fff; text-decoration: none; border-radius: 5px;">Unirme al canal</a>
      </p>
      <p style="margin-top: 20px;">Enlace para ingresar al perfil de Twitter:
      </p>
      <p style="text-align: center;">
          <a href="${profileTwitter}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #1da1f2; color: #fff; text-decoration: none; border-radius: 5px;">Ver perfil</a>
      </p>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, (mailError, info) => {
      if (mailError) {
        return res.status(500).json({
          message:
            "Error al enviar el correo electrónico de activación. Por favor, intenta nuevamente.",
        });
      } else {
        return res.status(200).json({
          message:
            "Usuario registrado. Por favor, verifica tu correo electrónico para activar tu cuenta.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al registrar el usuario. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const activateAccount = async (req, res) => {
  const { token } = req.params;
  let connection;
  try {
    connection = await getConnection();
    const decodedToken = verifyToken(token);

    const query = "SELECT mail FROM users WHERE mail = ? AND token = ?";
    const values = [decodedToken.email, token];
    const respuesta = await connection.query(query, values);

    if (respuesta.length === 0) {
      return res.redirect("https://infotics.vercel.app/#/activation-problems");
    }

    const updateQuery =
      "UPDATE users SET status = 1, token=NULL WHERE mail = ?";
    const updateValues = [decodedToken.email];

    const resultado = await connection.query(updateQuery, updateValues);

    if (resultado.length === 0) {
      return res.redirect("https://infotics.vercel.app/#/activation-problems");
    }
    return res.redirect("https://infotics.vercel.app/#/activation");
  } catch (error) {
    return res.redirect("https://infotics.vercel.app/#/activation-problems");
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const login = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { email, pin, descriptor } = req.body;
    if (!(email && pin && descriptor)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }

    // Verificar si el correo existe en la base de datos
    const queryCheckEmail = "SELECT * FROM users WHERE mail = ?";
    const checkEmailValues = [email];

    const respuesta = await connection.query(queryCheckEmail, checkEmailValues);
    if (respuesta.length === 0) {
      return res.status(404).json({
        message:
          "No existe el correo proporcionado. Por favor, intenta nuevamente.",
      });
    }
    if (respuesta[0].status === 0) {
      return res.status(400).json({
        message: "Para ingresar, active su cuenta. Verifique su correo.",
      });
    }
    let threshold = 0.5;
    const iv = Buffer.from(respuesta[0].init_vector, "base64");
    const distance = euclideanDistance(
      descriptor,
      decryptBiometrics(respuesta[0].face_descriptor, iv)
    );
    if (distance > threshold) {
      return res
        .status(400)
        .json({ message: "Usuario no autorizado para acceder a esta cuenta" });
    }
    const respuestaComparacion = await comparePassword(pin, respuesta[0].pin);

    if (respuestaComparacion) {
      const insertLog = "INSERT INTO logs(user) VALUES(?)";
      const values = [respuesta[0].id];
      await connection.query(insertLog, values);
      const { id, full_name, mail, category } = respuesta[0];

      const userData = {
        id,
        full_name,
        mail,
        category,
      };

      const token = generateTokenWithoutTime({ userData });

      const user = { id, full_name, mail, category, token };

      return res.status(200).json({
        message: `Bienvenido ${full_name}`,
        user,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Inicio de sesion fallido, contraseña no valida" });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Verifique que las credenciales sean correctas. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const loginNoPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { email, pin } = req.body;
    if (!(email && pin)) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    // Verificar si el correo existe en la base de datos
    const queryCheckEmail = "SELECT * FROM users WHERE mail = ?";
    const checkEmailValues = [email];
    const respuesta = await connection.query(queryCheckEmail, checkEmailValues);
    if (respuesta.length === 0) {
      return res.status(404).json({
        message:
          "No existe el correo proporcionado. Por favor, intenta nuevamente.",
      });
    }
    if (respuesta[0].status === 0) {
      return res.status(400).json({
        message: "Para ingresar, active su cuenta. Verifique su correo.",
      });
    }
    const respuestaComparacion = await comparePassword(pin, respuesta[0].pin);
    if (respuestaComparacion) {
      const insertLog = "INSERT INTO logs(user) VALUES(?)";
      const values = [respuesta[0].id];
      await connection.query(insertLog, values);
      const { id, full_name, mail, category } = respuesta[0];

      const userData = {
        id,
        full_name,
        mail,
        category,
      };

      const token = generateTokenWithoutTime({ userData });

      const user = { id, full_name, mail, category, token };

      return res.status(200).json({
        message: `Bienvenido ${full_name}`,
        user,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Inicio de sesion fallido, contraseña no valida" });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Verifique que las credenciales sean correctas. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

const resetPassword = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { email } = req.body;
    if (email === null) {
      return res.status(400).json({
        message: "Campos necesarios incompletos.",
      });
    }
    const query = "SELECT mail FROM users WHERE mail = ?";
    const values = [email];
    const respuesta = await connection.query(query, values);

    if (respuesta.length === 0) {
      return res.status(404).json({
        message:
          "No existe el correo proporcionado. Por favor, intenta nuevamente.",
      });
    }

    const newPassword = await generateNewPassword();
    const hash = await encriptyngPassword(newPassword);

    const updateQuery = "UPDATE users SET pin = ? WHERE mail = ?";
    const updateValues = [hash, email];

    const resultado = await connection.query(updateQuery, updateValues);

    if (resultado.length === 0) {
      return res.status(400).json({
        message:
          "Error al reestablecer la contraseña. Por favor, intenta nuevamente.",
      });
    }
    const mailOptions = {
      from: "Department Dev - Code Mentor <ecuadorpro2000@gmail.com>",
      to: email,
      subject: "Reestablecimiento de contraseña",
      html: `
              <h1>Reestablecimiento de contraseña</h1>
              <p>Por favor, utiliza la siguiente contraseña para ingresar a tu cuenta:</p>
              <p>${newPassword}</p>
            `,
    };

    transporter.sendMail(mailOptions, (mailError, info) => {
      if (mailError) {
        return res.status(500).json({
          message:
            "Error al enviar el correo electrónico de reestablecimiento de contraseña. Por favor, intenta nuevamente.",
        });
      } else {
        return res.status(200).json({
          message:
            "Reestablecimiento de contraseña exitoso. Por favor, verifica tu correo electrónico.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al actualizar la contraseña. Por favor, intenta nuevamente.",
    });
  } finally {
    if (connection) {
      connection.end(); // Cierra la conexión en el bloque finally
    }
  }
};

export { register, activateAccount, login, loginNoPassword, resetPassword };
