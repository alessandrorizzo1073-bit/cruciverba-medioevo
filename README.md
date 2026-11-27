# Cruciverba del Medioevo · Accademia Medievale

Applicazione web didattica in **HTML, CSS e JavaScript vanilla** (nessun framework, nessuna libreria esterna) per studenti di terza media.

## Contenuto

- Cruciverba generato automaticamente con **15 parole** del programma di Medioevo.
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

## Struttura file

- `index.html` — applicazione completa (HTML, CSS e JS inclusi).
- `README.md` — queste istruzioni.
