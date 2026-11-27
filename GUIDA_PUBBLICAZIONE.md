# Guida alla pubblicazione del sito "Sfida Neon"

Questa guida è scritta per chi **non ha mai pubblicato un sito**. Non serve saper programmare: bastano un computer, una connessione internet e un indirizzo email. Tempo necessario la prima volta: circa 20 minuti.

---

## Cosa c'è nella cartella

| File | A cosa serve | Va modificato? |
|---|---|---|
| `index.html` | La pagina del gioco | No |
| `style.css` | I colori e la grafica | No |
| `gioco.js` | Il funzionamento del gioco | No |
| **`config.js`** | **Il codice di sblocco** | **Sì, se vuoi cambiarlo** |
| **`domande.js`** | **Le 3 domande del quiz** | **Sì, per inserire le domande vere** |
| `qr.html` | La pagina che crea il QR code | No |
| `qrcode.js` | Il "motore" che disegna il QR code | No |
| `GUIDA_PUBBLICAZIONE` | Questa guida | No |

> **Regola d'oro:** tutti i file devono stare **insieme nella stessa cartella**. Non rinominarli e non spostarli in sottocartelle.

Puoi provare il gioco subito, anche senza internet: fai doppio clic su `index.html` e si apre nel browser.

---

## 1. Pubblicare il sito gratis online

Il sito va messo su internet, così i ragazzi possono aprirlo dal telefono. Ecco due modi gratuiti. **Consigliamo il primo (Netlify)**, che è il più semplice.

### Opzione A (consigliata): Netlify Drop, trascinando la cartella

**Passo 1: crea un account gratuito**

1. Apri il browser (Chrome, Edge, Firefox o Safari) e vai su **https://app.netlify.com/signup**
2. Scegli **"Sign up with email"** (registrati con email). Puoi anche usare un account Google o GitHub, se ce l'hai.
3. Inserisci email e password, poi apri l'email di conferma che ti arriva e clicca il link.
4. Se Netlify ti fa delle domande iniziali (nome, a cosa ti serve…), rispondi a piacere o salta: non sono importanti.

**Passo 2: carica il sito**

1. Vai su **https://app.netlify.com/drop**
2. Vedrai un grande riquadro con scritto *"Drag and drop your site output folder here"* ("trascina qui la cartella del tuo sito").
3. Apri sul computer la cartella `sito-prevenzione` (quella che contiene `index.html`).
4. **Trascina l'intera cartella** con il mouse dentro il riquadro della pagina Netlify e rilascia.
5. Attendi qualche secondo: compare la scritta *"Published"* o *"Your site is deployed"* (sito pubblicato).

> ⚠️ Trascina **la cartella**, non i singoli file e non un file `.zip`. Dentro la cartella deve esserci direttamente `index.html`.

**Passo 3: trova l'indirizzo del sito**

1. In alto nella pagina del sito vedrai un indirizzo verde, tipo **`https://incredibile-gatto-12345.netlify.app`**. Quello è l'indirizzo del tuo sito.
2. Cliccalo per aprirlo e controllare che il gioco funzioni.

**Passo 4 (facoltativo): scegli un nome più semplice**

1. Nel menu del sito clicca **"Site configuration"** (configurazione del sito), poi **"Change site name"** (cambia nome).
2. Scrivi un nome, ad esempio `sfida-neon-prevenzione`, e clicca **Save**.
3. Il nuovo indirizzo sarà `https://sfida-neon-prevenzione.netlify.app`.

> Fai questa modifica **prima** di creare il QR code: se cambi il nome dopo, il QR vecchio non funziona più.

**Come aggiornare il sito (dopo aver cambiato domande o codice)**

1. Vai su **https://app.netlify.com** e clicca sul tuo sito.
2. Apri la scheda **"Deploys"** (pubblicazioni).
3. In fondo alla pagina c'è un riquadro: *"Need to update your site? Drag and drop your site output folder here"*.
4. Trascinaci di nuovo **tutta la cartella** aggiornata.
5. L'indirizzo **resta lo stesso**, quindi il QR code già stampato continua a funzionare.

### Opzione B (alternativa): GitHub Pages

Più passaggi, ma ha un vantaggio: puoi **modificare le domande direttamente dal browser**, senza ricaricare la cartella.

**Passo 1: crea un account**

1. Vai su **https://github.com/signup**
2. Inserisci email, password e un nome utente (es. `prevenzione-peer`). Il nome utente farà parte dell'indirizzo del sito.
3. Conferma l'email con il codice che ti arriva.

**Passo 2: crea un "repository" (una cartella online)**

1. Una volta entrato, clicca il **+** in alto a destra e poi **"New repository"**.
2. In *Repository name* scrivi ad esempio `sfida-neon`.
3. Seleziona **Public** (pubblico: è necessario per la versione gratuita).
4. Clicca **"Create repository"**.

**Passo 3: carica i file**

1. Nella pagina che compare clicca il link **"uploading an existing file"** (carica un file esistente).
2. Apri la cartella `sito-prevenzione` sul computer, **seleziona tutti i file** al suo interno (Ctrl+A su Windows, Cmd+A su Mac) e trascinali nella pagina.
3. Attendi che finisca il caricamento, poi clicca il pulsante verde **"Commit changes"** (salva le modifiche).

> Qui si caricano **i file**, non la cartella: `index.html` deve trovarsi subito nella lista principale.

**Passo 4: attiva il sito**

1. Nel repository clicca **"Settings"** (impostazioni, l'icona a ingranaggio in alto).
2. Nel menu a sinistra clicca **"Pages"**.
3. Alla voce *Source* scegli **"Deploy from a branch"**.
4. Alla voce *Branch* scegli **`main`** e la cartella **`/ (root)`**, poi clicca **Save**.
5. Attendi 1-2 minuti e ricarica la pagina: in alto comparirà *"Your site is live at…"* con l'indirizzo, tipo **`https://prevenzione-peer.github.io/sfida-neon/`**

---

## 2. Generare e stampare il QR code

1. Apri il sito pubblicato e aggiungi **`qr.html`** alla fine dell'indirizzo, ad esempio:
   `https://sfida-neon-prevenzione.netlify.app/qr.html`
   (in alternativa fai doppio clic sul file `qr.html` nella cartella sul computer).
2. Nel campo **"Indirizzo del sito"** incolla l'indirizzo del gioco (es. `https://sfida-neon-prevenzione.netlify.app`). Se hai aperto la pagina online, l'indirizzo è già scritto.
3. Se vuoi, cambia la scritta che compare sotto il QR (di base: "Inquadrami e gioca!").
4. Per la stampa lascia la qualità su **"Alta"**.
5. Clicca **"Genera QR code"**: compare l'anteprima.
6. Clicca **"⬇ Scarica PNG"**: il file `qr-code-sito.png` finisce nella cartella *Download*.
7. Per stampare puoi cliccare **"🖨 Stampa"** oppure inserire l'immagine PNG in un documento Word, Canva o simili.

**Consigli per la stampa**

- Stampa il QR largo **almeno 5 cm** (meglio 8-10 cm per un cartellone).
- Stampa **nero su bianco**, senza filtri o colori di sfondo.
- **Prima di stampare tante copie, provalo** inquadrandolo con 2-3 telefoni diversi.
- Lascia un po' di margine bianco intorno al QR: serve al telefono per riconoscerlo.

---

## 3. Modificare le domande del quiz

Le domande si trovano nel file **`domande.js`**.

**Con quale programma aprirlo**

- **Windows:** clic destro sul file → *Apri con* → **Blocco note**.
- **Mac:** clic destro → *Apri con* → **TextEdit**. (Se TextEdit mostra il testo in modo strano, vai su *Formato → Converti in formato Solo testo*.)
- ❌ **Non usare Word**: aggiunge formattazioni invisibili che rompono il file.

**Come è fatta una domanda**

```
  {
    testo: "Qui va la domanda?",
    risposte: ["Prima risposta", "Seconda risposta", "Terza risposta", "Quarta risposta"],
    corretta: 1,
    spiegazione: "Frase che compare se il ragazzo sbaglia."
  },
```

- **testo**: la domanda, tra virgolette `" "`.
- **risposte**: da 3 a 4 risposte, ognuna tra virgolette e separate da virgole.
- **corretta**: il numero della risposta giusta **contando da zero**:
  `0` = prima, `1` = seconda, `2` = terza, `3` = quarta.
- **spiegazione**: facoltativa, compare quando si sbaglia.

**Esempio pratico.** Se la risposta giusta è la **terza**, scrivi `corretta: 2`.

**Attenzione a:**

- Non cancellare virgole, parentesi `{ }` `[ ]` o virgolette.
- Se nella domanda ti serve una virgoletta, usa l'apostrofo `'` (es. `"Cos'è il THC?"` va benissimo).
- Puoi copiare e incollare un blocco intero `{ … },` per aggiungere altre domande.

**Dopo la modifica**

1. Salva il file (Ctrl+S oppure Cmd+S).
2. Fai doppio clic su `index.html` per provare il quiz sul computer (il codice di sblocco è lo stesso).
3. Ripubblica:
   - **Netlify:** scheda *Deploys* → trascina di nuovo la cartella (vedi sezione 1A).
   - **GitHub:** apri il repository, clicca su `domande.js`, poi sull'icona della **matita** ✏️ (Edit). Modifica direttamente nel browser e clicca **"Commit changes"**. Il sito si aggiorna in 1-2 minuti.

---

## 4. Cambiare il codice di sblocco

1. Apri il file **`config.js`** con Blocco note o TextEdit (come sopra).
2. Trova la riga:
   ```
   const CODICE_SBLOCCO = "IaLpEeRCaNnA";
   ```
3. Sostituisci solo quello che c'è **tra le virgolette**, ad esempio:
   ```
   const CODICE_SBLOCCO = "NuovoCodice2026";
   ```
4. Ricorda: **maiuscole e minuscole contano**. Evita lettere accentate e simboli strani, che sono scomodi da scrivere sul telefono.
5. Salva e ripubblica (come al punto 3).

---

## 5. Controllare da smartphone prima dell'evento

Fai questa prova **qualche giorno prima** e poi di nuovo **il giorno stesso**, preferibilmente con un iPhone e un telefono Android.

- [ ] Inquadra il QR stampato con la fotocamera: compare il link e si apre il sito.
- [ ] Scrivi un codice **sbagliato**: compare un messaggio d'errore gentile e puoi riprovare.
- [ ] Scrivi il codice **giusto**: si apre la slot machine.
- [ ] Premi **GIRA**: i rulli girano. Si vince **al massimo alla terza giocata**.
- [ ] Dopo la vittoria premi **VAI AL QUIZ**.
- [ ] **Sbaglia apposta** una risposta: compare la spiegazione e il pulsante **RIFAI IL QUIZ**, che riparte dalla prima domanda senza la slot.
- [ ] Rispondi giusto a tutte: compare il banner **"VITTORIA! Vai a ritirare il premio da un Peer"**.
- [ ] Controlla che le domande siano quelle **vere** e non i segnaposto.
- [ ] Prova anche con la **rete mobile** (non solo con il Wi-Fi), visto che all'evento i ragazzi useranno probabilmente quella.

> Per ricominciare il gioco basta **ricaricare la pagina**.

---

## 6. Problemi frequenti e soluzioni

| Problema | Soluzione |
|---|---|
| **Il QR non si legge** | Stampalo più grande, nero su bianco, con margine bianco intorno. Pulisci la fotocamera. Su alcuni Android serve l'app "Google Lens" o la funzione QR nelle impostazioni della fotocamera. |
| **Il QR apre una pagina "Not found" / "Page not found"** | L'indirizzo nel QR è sbagliato oppure hai cambiato il nome del sito dopo aver creato il QR. Rigenera il QR con l'indirizzo giusto. |
| **Netlify mostra "Page not found" al posto del gioco** | Hai caricato una cartella che contiene un'altra cartella. Trascina la cartella che contiene **direttamente** `index.html`. |
| **Il sito è tutto bianco o senza colori** | Manca qualche file (es. `style.css`). Ricarica **tutti** i file insieme. |
| **Ho modificato le domande ma vedo ancora quelle vecchie** | Hai ripubblicato? Se sì, il telefono ricorda la versione vecchia: ricarica la pagina, oppure aprila in una scheda di navigazione in incognito. Su GitHub aspetta 2 minuti. |
| **Dopo la modifica il quiz non compare / la slot non gira** | Quasi sempre c'è un errore di scrittura in `domande.js`: manca una virgola, una virgoletta o una parentesi. Confronta con l'esempio della sezione 3, oppure riprendi il file originale e rifai la modifica con calma. |
| **Il codice giusto non viene accettato** | Controlla maiuscole/minuscole. Alcune tastiere mettono la prima lettera maiuscola in automatico. Verifica anche cosa c'è scritto in `config.js`. |
| **La risposta giusta del quiz risulta sbagliata** | Il numero in `corretta` si conta **da zero**: la prima risposta è `0`, la seconda `1`, e così via. |
| **Netlify ha cancellato il sito** | Succede se si usa Netlify Drop **senza account**: il sito dura solo poco tempo. Crea l'account (sezione 1A) e ricarica la cartella. |
| **Lo schermo del telefono si spegne sul banner finale** | Il sito chiede al telefono di tenere lo schermo acceso, ma non tutti i telefoni lo permettono. Basta toccare lo schermo: il banner resta lì finché non si ricarica la pagina. |

---

*Il sito non usa database e non salva dati dei ragazzi: ogni volta che la pagina viene ricaricata, il gioco riparte da zero.*
