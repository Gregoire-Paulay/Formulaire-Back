require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import des packages nécéssaire pour utiliser mailgun
const formData = require("form-data");
const Mailgun = require("mailgun.js");
// -- Utilisation de Mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Grégoire Paulay",
  key: process.env.MAILGUN_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le formulaire!");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);
    const { firstname, lastname, email, sujet, message } = req.body;
    const messageData = {
      from: `${firstname} ${lastname} ${email}`,
      to: process.env.MAIL,
      subject: sujet,
      text: message,
    };
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toute les routes sauf celles crées au dessus arriveront ici
app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});
//Pour écouter le serveur : ici on écoute la requete du port 3000
app.listen(process.env.PORT, () => {
  console.log("server started");
});
