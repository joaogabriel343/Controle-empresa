const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Criação da conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",  // Altere conforme seu usuário
  password: "",  // Altere conforme sua senha
  database: "projeto-empresa"  
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados: " + err.stack);
    return;
  }
  console.log("Conectado ao banco de dados como id " + db.threadId);
});

// Rota para obter as empresas
app.get("/companies", (req, res) => {
  db.query("SELECT * FROM Companies", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Rota para adicionar empresas
app.post("/companies", (req, res) => {
  const { name, fantasyName, creationDate, capital } = req.body;
  const query = `INSERT INTO Companies (name, fantasy_name, creation_date, capital)
                 VALUES (?, ?, ?, ?)`;

  db.query(query, [name, fantasyName, creationDate, capital], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: "Empresa criada com sucesso!" });
    }
  });
});

// Rota para deletar uma empresa (ajustada para receber ID)
app.delete("/companies/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Companies WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Empresa excluída com sucesso!" });
    }
  });
});

// Rota para adicionar CEOs (Se necessário, defina a estrutura do CEO)
app.post("/ceos", (req, res) => {
  const { name, position, companyName } = req.body;
  const query = `INSERT INTO Ceos (name, position, company_name)
                 VALUES (?, ?, ?)`;

  db.query(query, [name, position, companyName], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: "CEO adicionado com sucesso!" });
    }
  });
});

// Rota para deletar CEOs
app.delete("/ceos/:companyName/:ceoName", (req, res) => {
  const { companyName, ceoName } = req.params;
  db.query("DELETE FROM Ceos WHERE company_name = ? AND name = ?", [companyName, ceoName], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "CEO excluído com sucesso!" });
    }
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
