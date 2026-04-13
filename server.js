const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");



const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database("banco.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS entregas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cliente TEXT,
    endereco TEXT,
    movel TEXT,
    valor REAL,
    data_entrega TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS buscas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cliente TEXT,
    endereco TEXT,
    movel TEXT,
    valor REAL,
    data_busca TEXT
  )`);
});

// SALVAR ENTREGA
app.post("/entregas", (req, res) => {
  const { nome_cliente, endereco, movel, valor, data_entrega } = req.body;

  db.run(
    `INSERT INTO entregas (nome_cliente, endereco, movel, valor, data_entrega)
     VALUES (?, ?, ?, ?, ?)`,
    [nome_cliente, endereco, movel, valor, data_entrega],
    function (err) {
      if (err) return res.json(err);
      res.json({ id: this.lastID });
    }
  );
});

// LISTAR ENTREGAS
app.get("/entregas", (req, res) => {
  db.all("SELECT * FROM entregas", [], (err, rows) => {
    if (err) return res.json(err);
    res.json(rows);
  });
});

// SALVAR BUSCA
app.post("/buscas", (req, res) => {
  const { nome_cliente, endereco, movel, valor, data_busca } = req.body;

  db.run(
    `INSERT INTO buscas (nome_cliente, endereco, movel, valor, data_busca)
     VALUES (?, ?, ?, ?, ?)`,
    [nome_cliente, endereco, movel, valor, data_busca],
    function (err) {
      if (err) return res.json(err);
      res.json({ id: this.lastID });
    }
  );
});

// LISTAR BUSCAS
app.get("/buscas", (req, res) => {
  db.all("SELECT * FROM buscas", [], (err, rows) => {
    if (err) return res.json(err);
    res.json(rows);
  });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando"));