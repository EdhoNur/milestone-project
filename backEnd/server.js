// Import express untuk membuat server
const express = require("express");

// Import cors agar backend bisa diakses dari frontend beda origin
const cors = require("cors");

// Import bcrypt untuk hash dan compare password
const bcrypt = require("bcryptjs");

// Import dotenv untuk membaca file .env
require("dotenv").config();

// Import koneksi database dari config/db.js
const db = require("./config/db");

// Inisialisasi express app
const app = express();

// Mengaktifkan CORS middleware
app.use(cors());

// Middleware agar bisa membaca JSON dari request body
app.use(express.json());


// ===============================
// ROOT ENDPOINT
// ===============================

// Endpoint test untuk memastikan server berjalan
app.get("/", (req, res) => {
  res.send("AssistBro API Running...");
});


// ===============================
// LOGIN USER
// ===============================

app.post("/login", (req, res) => {

  // Ambil email dan password dari request body
  const { email, password } = req.body;

  // Query untuk mencari user berdasarkan email
  const sql = "SELECT * FROM users WHERE email = ?";

  // Jalankan query ke database
  db.query(sql, [email], async (err, result) => {

    // Jika error database
    if (err) return res.status(500).json(err);

    // Jika user tidak ditemukan
    if (result.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Ambil user pertama dari hasil query
    const user = result[0];

    // Bandingkan password input dengan password hash di database
    const isMatch = await bcrypt.compare(password, user.password);

    // Jika password tidak cocok
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    // Jika login berhasil
    res.json({
      message: "Login berhasil!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
});


// ===============================
// CREATE CONTACT
// ===============================

app.post("/contacts", (req, res) => {

  // Ambil data dari body
  const { name, email, message } = req.body;

  // Query insert ke table contacts
  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Pesan berhasil dikirim!"
    });
  });
});


// ===============================
// READ CONTACTS
// ===============================

app.get("/contacts", (req, res) => {

  // Ambil semua data contacts
  db.query("SELECT * FROM contacts", (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);
  });
});


// ===============================
// UPDATE CONTACT
// ===============================

app.put("/contacts/:id", (req, res) => {

  // Ambil id dari parameter URL
  const { id } = req.params;

  // Ambil data baru dari body
  const { name, email, message } = req.body;

  // Query update berdasarkan id
  const sql = `
    UPDATE contacts 
    SET name = ?, email = ?, message = ?
    WHERE id = ?
  `;

  db.query(sql, [name, email, message, id], (err, result) => {

    if (err) return res.status(500).json(err);

    // Jika tidak ada data yang terupdate
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact tidak ditemukan" });
    }

    res.json({ message: "Contact berhasil diupdate!" });
  });
});


// ===============================
// DELETE CONTACT
// ===============================

app.delete("/contacts/:id", (req, res) => {

  // Ambil id dari parameter
  const { id } = req.params;

  const sql = "DELETE FROM contacts WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) return res.status(500).json(err);

    // Jika id tidak ditemukan
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact tidak ditemukan" });
    }

    res.json({ message: "Contact berhasil dihapus!" });
  });
});


// ===============================
// CREATE USER (REGISTER)
// ===============================

app.post("/users", async (req, res) => {

  // Ambil data dari body
  const { username, email, password } = req.body;

  // Hash password sebelum disimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(sql, [username, email, hashedPassword], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "User created successfully!" });
  });
});


// ===============================
// READ ALL USERS
// ===============================

app.get("/users", (req, res) => {

  // Ambil semua user tanpa password
  db.query("SELECT id, username, email, createdAt FROM users", (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);
  });
});


// ===============================
// READ USER BY ID
// ===============================

app.get("/users/:id", (req, res) => {

  const { id } = req.params;

  db.query(
    "SELECT id, username, email, createdAt FROM users WHERE id = ?",
    [id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
});


// ===============================
// UPDATE USER
// ===============================

app.put("/users/:id", async (req, res) => {

  const { id } = req.params;

  const { username, email, password } = req.body;

  // Hash password baru
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    UPDATE users 
    SET username = ?, email = ?, password = ?
    WHERE id = ?
  `;

  db.query(sql, [username, email, hashedPassword, id], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "User updated successfully!" });
  });
});


// ===============================
// DELETE USER
// ===============================

app.delete("/users/:id", (req, res) => {

  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "User deleted successfully!" });
  });
});


// ===============================
// MENJALANKAN SERVER
// ===============================

// Jalankan server di port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});