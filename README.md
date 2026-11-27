# Cruciverba del Medioevo · Accademia Medievale

Applicazione web didattica in **HTML, CSS e JavaScript vanilla** (nessun framework, nessuna libreria esterna) per studenti di terza media.

## Contenuto

- **Scelta della materia** dopo il login: 🏰 Storia del Medioevo oppure 🏛️ Filosofia Greca.
- Due cruciverba indipendenti, ciascuno con **15 parole** e definizioni semplici.
- Percorsi: 15 parole e 10 argomenti di teoria per il Medioevo; 15 parole e 12 argomenti di teoria per la Filosofia Greca.
- Attestati differenziati: "Esperto del Medioevo" oppure "Esperto di Filosofia Greca".
- **Attestato speciale** "Studioso di Storia e Filosofia" se si ottiene almeno 8/10 in entrambi i percorsi.
- **Accesso automatico** con profilo demo; il pulsante «Esci dall'account» riporta al modulo di login.
- **Modalità Studio**: definizioni, teoria (10 argomenti), suggerimento, controllo, soluzione e correzione degli errori.
- **Modalità Verifica**: timer, nessun aiuto, consegna unica, voto in decimi, elenco degli errori con spiegazione.
- **Attestato PDF** generato in JavaScript puro se il voto è almeno 6/10, con downloading immediato.
- **PDF stampabile A4**: 🖨️ Stampa (ottimizzata per A4, senza interfaccia) e 📄 Scarica PDF (vuoto, oppure con soluzioni solo in Modalità Studio).
- **Storico risultati** locale con nome, e-mail, data, modalità, tempo, percentuale e voto.
- **Invio e-mail** tramite EmailJS (REST API via `fetch`, senza SDK).
- Salvataggio automatico dei progressi in `localStorage`.

## Pubblicazione (GitHub Pages)

1. Crea il repository `cruciverba-medioevo` (già pubblicato in questo progetto).
2. Vai su **Settings → Pages**.
3. In **Build and deployment**, imposta:
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)**
4. Salva. Il sito sarà disponibile all'indirizzo:
   `https://alessandrorizzo1073-bit.github.io/cruciverba-medioevo/`

In alternativa, da terminale con GitHub CLI:

```bash
gh api -X PUT repos/alessandrorizzo1073-bit/cruciverba-medioevo/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

## Configurazione EmailJS (facoltativa)

L'attestato viene sempre generato e scaricato. Per l'invio automatico all'indirizzo e-mail inserito:

1. Registrati gratuitamente su https://www.emailjs.com/
2. Crea un **Email Service** e prendi il relativo **Service ID**.
3. Crea un **Email Template** con queste variabili:
   - `{{to_email}}`, `{{studente}}`, `{{data}}`, `{{voto}}`, `{{percentuale}}`, `{{tempo}}`, `{{pdf_link}}`
   - Esempio di riga nel template: `<a href="{{pdf_link}}" download>Scarica il tuo attestato</a>`
4. Prendi il **Public Key** dalla sezione Account → API Keys.
5. Modifica l'oggetto `EMAILJS` all'inizio del blocco `<script>` di `index.html`:

```js
const EMAILJS = {
  publicKey: 'LA_TUA_PUBLIC_KEY',
  serviceId: 'IL_TUO_SERVICE_ID',
  templateId: 'IL_TUO_TEMPLATE_ID',
  enabled: true
};
```

Il piano gratuito EmailJS ha un numero limitato di invii mensili: per un uso in classe con molti studenti potrebbe essere necessario un piano superiore.

## Database Cloudflare (D1 + Worker)

Lo storico risultati può essere salvato su **Cloudflare D1** invece che solo nel browser. Il sito funzira comunque senza database (fallback a `localStorage`).

### File inclusi

- `schema.sql` — tabella `risultati` (nome, email, data, modalità, tempo, percentuale, voto).
- `worker.js` — API REST con CORS: `POST /api/risultati`, `GET /api/risultati?email=...`, `DELETE /api/risultati?email=...`, `GET /api/health`.
- `wrangler.toml` — configurazione del Worker e del binding D1.

### Deploy (da eseguire tu, serve un account Cloudflare)

```bash
# 1. Login
npx wrangler login

# 2. Crea il database D1 e copia il database_id stampato
npx wrangler d1 create cruciverba-medioevo-db

# 3. Incolla il database_id in wrangler.toml al posto di SOSTITUISCI_CON_IL_DATABASE_ID

# 4. Crea la tabella (produzione)
npx wrangler d1 execute cruciverba-medioevo-db --remote --file=schema.sql

# 5. Deploy del Worker
npx wrangler deploy
```

Wrangler stamperà l'URL del Worker, per esempio:
`https://cruciverba-medioevo-api.<tuo-subdomain>.workers.dev`

### Collegamento del sito al database

In `index.html`, all'inizio del blocco `<script>`, imposta:

```js
const API_BASE = 'https://cruciverba-medioevo-api.<tuo-subdomain>.workers.dev';
```

Poi fai commit e push: il sito su GitHub Pages userà Cloudflare D1. Se l'URL non è raggiungibile, lo storico continua a usare i dati salvati nel browser.

> Nota: non è stato possibile creare il database in questo ambiente perché non sono disponibili credenziali Cloudflare (`CLOUDFLARE_API_TOKEN` / wrangler autenticato). I file sono pronti per il deploy con i comandi sopra.

## Struttura file

- `index.html` — applicazione completa (HTML, CSS e JS inclusi).
- `worker.js` — API Cloudflare Worker.
- `schema.sql` — schema del database D1.
- `wrangler.toml` — configurazione Worker + D1.
- `README.md` — queste istruzioni.
