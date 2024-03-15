import qrcode from "qrcode";

const generateQR = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Falta el parámetro url" });
    }

    const options = {
      errorCorrectionLevel: "L",
      width: "10px",
      height: "10px",
    };
    const qrCode = await qrcode.toDataURL(url, options);
    res.json({
      message: "Código QR generado y disponible en la consola",
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al generar el código QR" });
  }
};

export { generateQR };
