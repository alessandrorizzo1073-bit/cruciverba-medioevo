-- Database Cloudflare D1: cruciverba-medioevo-db
CREATE TABLE IF NOT EXISTS risultati (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  modalita TEXT NOT NULL,
  tempo TEXT NOT NULL,
  percentuale TEXT NOT NULL,
  voto TEXT NOT NULL,
  creato_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risultati_email ON risultati(email);
