/* =====================================================================
   LOGICA DEL GIOCO
   ---------------------------------------------------------------------
   Flusso: sblocco con codice → slot machine → quiz → banner di vittoria.

   Il codice di sblocco si cambia in  config.js
   Le domande del quiz si cambiano in domande.js
   Questo file normalmente NON serve modificarlo.

   Ricaricando la pagina si riparte sempre dall'inizio: non viene
   salvato nulla sul telefono.
   ===================================================================== */

"use strict";

/* ---------------------------------------------------------------------
   IMPOSTAZIONI DELLA SLOT MACHINE
   --------------------------------------------------------------------- */
const PROBABILITA_VITTORIA = 1 / 3; // una giocata su tre, in media
const GIOCATA_GARANTITA = 3;        // alla 3ª giocata si vince sicuramente
const DURATA_GIRO_MS = 1600;        // durata del giro del primo rullo
const RITARDO_TRA_RULLI_MS = 450;   // ogni rullo si ferma un po' dopo il precedente

/* ---------------------------------------------------------------------
   SIMBOLI DELLA SLOT (disegnati in SVG, nessuna immagine esterna)
   Ogni simbolo ha un nome (letto dai lettori di schermo) e un disegno.
   --------------------------------------------------------------------- */

// Una singola fogliolina, usata 7 volte (ruotata) per comporre la foglia
const FOGLIOLINA = "M0,0 C-7,-12 -8,-30 0,-48 C8,-30 7,-12 0,0Z";

const SIMBOLI = [
  {
    nome: "Foglia di cannabis",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gFoglia" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6bff3d"/><stop offset="1" stop-color="#138a12"/></linearGradient></defs>
      <path d="M50 76 L50 96" stroke="#0d6b0d" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(50,76)" fill="url(#gFoglia)" stroke="#0b5c0b" stroke-width="1.5">
        <path d="${FOGLIOLINA}" transform="rotate(-100) scale(.42)"/>
        <path d="${FOGLIOLINA}" transform="rotate(100) scale(.42)"/>
        <path d="${FOGLIOLINA}" transform="rotate(-65) scale(.7)"/>
        <path d="${FOGLIOLINA}" transform="rotate(65) scale(.7)"/>
        <path d="${FOGLIOLINA}" transform="rotate(-32) scale(.92)"/>
        <path d="${FOGLIOLINA}" transform="rotate(32) scale(.92)"/>
        <path d="${FOGLIOLINA}" transform="scale(1.4)"/>
      </g>
      <g stroke="#0b5c0b" stroke-width="1" opacity=".7">
        <path d="M50 76 L50 14"/>
      </g>
    </svg>`
  },
  {
    nome: "Canna",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- fumo -->
      <path d="M80 30 C70 22 88 16 78 6" fill="none" stroke="#9aa59a" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>
      <path d="M86 32 C94 24 82 18 90 10" fill="none" stroke="#b9c2b9" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
      <g transform="rotate(-32 50 55)">
        <!-- cartina arrotolata a cono -->
        <path d="M14 51 L82 45 L82 63 L14 57 Z" fill="#fbfbf4" stroke="#8f8f80" stroke-width="1.5"/>
        <path d="M30 50 L30 58 M46 48.5 L46 59.5 M62 47 L62 61" stroke="#d8d8c8" stroke-width="1.2"/>
        <!-- filtrino -->
        <rect x="8" y="50" width="12" height="8" rx="2" fill="#e0b07a" stroke="#9a6b38" stroke-width="1.2"/>
        <!-- brace accesa -->
        <ellipse cx="83" cy="54" rx="4.5" ry="9.5" fill="#ff5a1f"/>
        <ellipse cx="84" cy="54" rx="2.5" ry="6" fill="#ffd23f"/>
        <ellipse cx="86" cy="54" rx="2" ry="7" fill="#6e6e6e" opacity=".7"/>
      </g>
    </svg>`
  },
  {
    nome: "Accendino",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- fiamma -->
      <path d="M44 28 C34 18 42 10 46 2 C48 12 58 14 52 26 C50 30 46 30 44 28Z" fill="#ff8a00"/>
      <path d="M46 26 C42 20 45 15 47 11 C49 17 53 19 50 25 C49 27 47 27 46 26Z" fill="#ffe14d"/>
      <!-- testa metallica -->
      <rect x="32" y="28" width="38" height="16" rx="3" fill="#cfd6d6" stroke="#7d8686" stroke-width="1.5"/>
      <circle cx="38" cy="34" r="1.8" fill="#7d8686"/><circle cx="44" cy="34" r="1.8" fill="#7d8686"/>
      <circle cx="38" cy="39" r="1.8" fill="#7d8686"/><circle cx="44" cy="39" r="1.8" fill="#7d8686"/>
      <!-- rotellina -->
      <rect x="56" y="22" width="12" height="9" rx="4" fill="#5d6666"/>
      <!-- corpo colorato -->
      <rect x="30" y="43" width="42" height="52" rx="8" fill="#ff2fd0" stroke="#a3138a" stroke-width="2"/>
      <rect x="35" y="48" width="8" height="42" rx="4" fill="#ff8be8" opacity=".7"/>
    </svg>`
  },
  {
    nome: "Cartine",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- cartina che esce dal pacchetto -->
      <path d="M26 34 L24 12 Q50 6 76 12 L74 34 Z" fill="#fdfdf6" stroke="#9c9c8c" stroke-width="1.5"/>
      <path d="M27 18 Q50 13 73 18" stroke="#d6d6c4" stroke-width="1.2" fill="none"/>
      <!-- pacchetto -->
      <rect x="14" y="30" width="72" height="52" rx="6" fill="#ff8c1a" stroke="#a44f00" stroke-width="2"/>
      <rect x="14" y="30" width="72" height="12" rx="6" fill="#e06b00"/>
      <rect x="24" y="50" width="52" height="22" rx="4" fill="#1d3b1f"/>
      <text x="50" y="65.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#39ff14">CARTINE</text>
    </svg>`
  },
  {
    nome: "Nuvola di fumo",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g fill="#b8c4ba" stroke="#7c8a7e" stroke-width="1.5">
        <circle cx="30" cy="62" r="17"/><circle cx="52" cy="50" r="22"/>
        <circle cx="72" cy="62" r="16"/><circle cx="50" cy="70" r="16"/>
      </g>
      <g fill="#dfe7e0">
        <circle cx="30" cy="62" r="13"/><circle cx="52" cy="50" r="18"/>
        <circle cx="72" cy="62" r="12"/><circle cx="50" cy="70" r="12"/>
      </g>
      <path d="M44 44 C50 36 60 44 54 50 C50 54 46 50 50 47" fill="none" stroke="#9aa79c" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="78" cy="30" r="6" fill="#dfe7e0" stroke="#7c8a7e" stroke-width="1.5"/>
      <circle cx="86" cy="18" r="3.5" fill="#dfe7e0" stroke="#7c8a7e" stroke-width="1.2"/>
    </svg>`
  }
];

/* ---------------------------------------------------------------------
   PICCOLE FUNZIONI DI AIUTO
   --------------------------------------------------------------------- */

// Restituisce l'elemento della pagina con quell'id
const $ = (id) => document.getElementById(id);

// Numero intero casuale da 0 a max-1
const casuale = (max) => Math.floor(Math.random() * max);

// Mostra una sola schermata alla volta
function mostraSchermata(id) {
  document.querySelectorAll(".schermata").forEach((s) => s.classList.remove("attiva"));
  $(id).classList.add("attiva");
  window.scrollTo(0, 0);
}

// Breve vibrazione (solo sui telefoni che la supportano)
function vibra(schema) {
  if (navigator.vibrate) {
    try { navigator.vibrate(schema); } catch (e) { /* ignorato */ }
  }
}

/* =====================================================================
   1) SCHERMATA DI SBLOCCO
   ===================================================================== */

const MESSAGGI_ERRORE_CODICE = [
  "Codice non corretto. Nessun problema, riprova! 🙂",
  "Mmm, non è questo. Controlla maiuscole e minuscole!",
  "Quasi! Riprova con calma, tentativi illimitati 💪",
];
let erroriCodice = 0;

$("form-codice").addEventListener("submit", (evento) => {
  evento.preventDefault(); // non ricaricare la pagina

  const campo = $("campo-codice");
  const messaggio = $("messaggio-codice");
  // .trim() toglie eventuali spazi aggiunti per sbaglio dalla tastiera
  const scritto = campo.value.trim();

  if (scritto === CODICE_SBLOCCO) {
    messaggio.textContent = "Codice giusto! Si parte! 🚀";
    messaggio.className = "messaggio successo";
    campo.blur(); // chiude la tastiera del telefono
    vibra(80);
    setTimeout(() => mostraSchermata("schermata-slot"), 700);
  } else {
    messaggio.textContent = MESSAGGI_ERRORE_CODICE[erroriCodice % MESSAGGI_ERRORE_CODICE.length];
    messaggio.className = "messaggio errore";
    erroriCodice++;
    vibra([60, 40, 60]);
    // Animazione "scuoti" del campo
    campo.classList.remove("scuoti");
    void campo.offsetWidth; // trucco per far ripartire l'animazione
    campo.classList.add("scuoti");
    campo.select();
  }
});

/* =====================================================================
   2) SLOT MACHINE
   ===================================================================== */

const rulli = Array.from(document.querySelectorAll(".rullo"));
// Per ogni rullo ricordiamo i 3 simboli visibili: [sopra, centro, sotto]
const visibiliRulli = rulli.map(() => [casuale(SIMBOLI.length), casuale(SIMBOLI.length), casuale(SIMBOLI.length)]);
let numeroGiocata = 0;   // quante volte si è premuto "Gira"
let staGirando = false;

/**
 * Decide l'esito di una giocata.
 * - Alla giocata numero GIOCATA_GARANTITA (la 3ª) si vince sempre.
 * - Prima si vince con probabilità PROBABILITA_VITTORIA (1 su 3).
 * Restituisce i 3 simboli (indici) che compariranno sulla riga centrale.
 */
function decidiEsito(giocata, numeroCasuale = Math.random()) {
  const vince = giocata >= GIOCATA_GARANTITA || numeroCasuale < PROBABILITA_VITTORIA;

  if (vince) {
    const s = casuale(SIMBOLI.length);
    return { vince: true, simboli: [s, s, s] };
  }

  // Sconfitta: tre simboli casuali che NON siano tutti uguali.
  // A volte i primi due sono uguali ("ci sei quasi!") per aumentare la suspense.
  let simboli;
  do {
    simboli = [casuale(SIMBOLI.length), casuale(SIMBOLI.length), casuale(SIMBOLI.length)];
  } while (simboli[0] === simboli[1] && simboli[1] === simboli[2]);
  return { vince: false, simboli };
}

// Crea il codice HTML di una cella con il simbolo indicato
function htmlCella(indice) {
  const s = SIMBOLI[indice];
  return `<div class="cella" role="img" aria-label="${s.nome}">${s.svg}</div>`;
}

// Disegna i simboli fermi in un rullo (all'avvio e dopo ogni giro)
function disegnaRulloFermo(r) {
  const striscia = rulli[r].querySelector(".striscia");
  striscia.style.transition = "none";
  striscia.style.transform = "translateY(0)";
  striscia.innerHTML = visibiliRulli[r].map(htmlCella).join("");
}

/**
 * Fa girare un rullo e lo ferma con "simboloFinale" sulla riga centrale.
 * Restituisce una Promise che si risolve quando il rullo si è fermato.
 */
function giraRullo(r, simboloFinale, durata) {
  return new Promise((risolvi) => {
    const striscia = rulli[r].querySelector(".striscia");

    // Costruiamo una lunga striscia: simboli attuali + tanti casuali + finali
    const quantiCasuali = 14 + r * 4; // i rulli successivi girano più a lungo
    const sequenza = [...visibiliRulli[r]];
    for (let i = 0; i < quantiCasuali; i++) sequenza.push(casuale(SIMBOLI.length));
    const finali = [casuale(SIMBOLI.length), simboloFinale, casuale(SIMBOLI.length)];
    sequenza.push(...finali);

    striscia.style.transition = "none";
    striscia.style.transform = "translateY(0)";
    striscia.innerHTML = sequenza.map(htmlCella).join("");

    const altezzaCella = striscia.firstElementChild.getBoundingClientRect().height;
    const spostamento = (sequenza.length - 3) * altezzaCella;

    void striscia.offsetHeight; // forza il browser a "vedere" la posizione iniziale
    striscia.classList.add("in-movimento");
    // Curva di rallentamento con un piccolo rimbalzo finale
    striscia.style.transition = `transform ${durata}ms cubic-bezier(.12,.75,.24,1.04)`;
    striscia.style.transform = `translateY(-${spostamento}px)`;

    // Togliamo l'effetto sfocato poco prima della fine
    setTimeout(() => striscia.classList.remove("in-movimento"), durata * 0.75);

    setTimeout(() => {
      visibiliRulli[r] = finali;
      disegnaRulloFermo(r);
      vibra(25);
      risolvi();
    }, durata + 60);
  });
}

const MESSAGGI_SCONFITTA = ["Riprova! 🎰", "Ci sei quasi! Riprova!", "Niente da fare… gira ancora!"];

$("pulsante-gira").addEventListener("click", async () => {
  if (staGirando) return; // evita doppi tocchi mentre gira
  staGirando = true;

  const pulsante = $("pulsante-gira");
  const messaggio = $("messaggio-slot");
  pulsante.disabled = true;
  messaggio.textContent = "Gira, gira, gira…";
  messaggio.className = "messaggio messaggio-slot";

  numeroGiocata++;
  const esito = decidiEsito(numeroGiocata);

  // Facciamo partire i tre rulli insieme, si fermano uno dopo l'altro
  await Promise.all(
    rulli.map((_, r) => giraRullo(r, esito.simboli[r], DURATA_GIRO_MS + r * RITARDO_TRA_RULLI_MS))
  );

  if (esito.vince) {
    messaggio.textContent = "JACKPOT! 🎉";
    messaggio.className = "messaggio messaggio-slot vinto";
    $("slot").classList.add("vincita");
    vibra([100, 60, 100, 60, 250]);
    lanciaCoriandoli(2500);
    pulsante.classList.add("nascosto");
    // Dopo un attimo compare il pulsante per andare al quiz
    setTimeout(() => $("pulsante-vai-quiz").classList.remove("nascosto"), 1200);
  } else {
    const quasi = esito.simboli[0] === esito.simboli[1] || esito.simboli[1] === esito.simboli[2];
    messaggio.textContent = quasi ? MESSAGGI_SCONFITTA[1] : MESSAGGI_SCONFITTA[(numeroGiocata - 1) % 2 === 0 ? 0 : 2];
    messaggio.className = "messaggio messaggio-slot perso";
    pulsante.disabled = false;
    staGirando = false;
  }
});

$("pulsante-vai-quiz").addEventListener("click", () => {
  $("slot").classList.remove("vincita");
  fermaCoriandoli();
  avviaQuiz();
  mostraSchermata("schermata-quiz");
});

// Disegno iniziale dei rulli
rulli.forEach((_, r) => disegnaRulloFermo(r));

/* =====================================================================
   3) QUIZ
   ===================================================================== */

let domandaCorrente = 0;
let rispostaBloccata = false; // evita tocchi multipli sulla stessa domanda
let domandeQuiz = [];         // le domande estratte per questo tentativo

// Mescola un elenco in ordine casuale (algoritmo di Fisher-Yates)
function mescola(elenco) {
  const copia = [...elenco];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = casuale(i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Estrae a caso DOMANDE_PER_QUIZ domande diverse dall'elenco DOMANDE
 * e mescola l'ordine delle risposte, così la risposta giusta
 * non è sempre nella stessa posizione.
 */
function preparaDomande() {
  const quante = Math.min(DOMANDE_PER_QUIZ, DOMANDE.length);
  return mescola(DOMANDE).slice(0, quante).map((d) => {
    const ordine = mescola(d.risposte.map((_, i) => i));
    return {
      testo: d.testo,
      risposte: ordine.map((i) => d.risposte[i]),
      corretta: ordine.indexOf(d.corretta),
      spiegazione: d.spiegazione,
    };
  });
}

function avviaQuiz() {
  domandaCorrente = 0;
  domandeQuiz = preparaDomande(); // ogni tentativo ha una nuova estrazione
  $("pannello-errore").classList.add("nascosto");
  mostraDomanda();
}

function mostraDomanda() {
  const d = domandeQuiz[domandaCorrente];
  rispostaBloccata = false;

  // Pallini di avanzamento
  $("avanzamento").innerHTML = domandeQuiz.map((_, i) => {
    const classe = i < domandaCorrente ? "fatto" : i === domandaCorrente ? "corrente" : "";
    return `<span class="${classe}"></span>`;
  }).join("");

  $("contatore-domanda").textContent = `DOMANDA ${domandaCorrente + 1} DI ${domandeQuiz.length}`;
  $("testo-domanda").textContent = d.testo;

  // Pulsanti delle risposte (A, B, C, D)
  const contenitore = $("risposte");
  contenitore.innerHTML = "";
  d.risposte.forEach((testo, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "risposta";
    const lettera = document.createElement("span");
    lettera.className = "lettera";
    lettera.textContent = "ABCD"[i] || String(i + 1);
    const etichetta = document.createElement("span");
    etichetta.textContent = testo;
    btn.append(lettera, etichetta);
    btn.addEventListener("click", () => rispondi(i, btn));
    contenitore.appendChild(btn);
  });
}

function rispondi(indiceScelto, pulsanteScelto) {
  if (rispostaBloccata) return;
  rispostaBloccata = true;

  const d = domandeQuiz[domandaCorrente];
  const pulsanti = Array.from($("risposte").children);
  pulsanti.forEach((b) => (b.disabled = true));

  if (indiceScelto === d.corretta) {
    // Risposta giusta
    pulsanteScelto.classList.add("giusta");
    vibra(60);
    setTimeout(() => {
      domandaCorrente++;
      if (domandaCorrente < domandeQuiz.length) {
        mostraDomanda();
      } else {
        mostraVittoria();
      }
    }, 900);
  } else {
    // Risposta sbagliata: mostriamo quella giusta e la spiegazione
    pulsanteScelto.classList.add("sbagliata");
    pulsanti[d.corretta].classList.add("giusta");
    vibra([80, 50, 80]);

    const testoErrore = $("testo-errore");
    testoErrore.innerHTML = "";
    testoErrore.append("La risposta giusta era: ");
    const giusta = document.createElement("strong");
    giusta.textContent = d.risposte[d.corretta];
    testoErrore.append(giusta, ".");
    if (d.spiegazione) {
      testoErrore.append(document.createElement("br"), d.spiegazione);
    }
    testoErrore.append(document.createElement("br"), "Puoi rifare il quiz dall'inizio: niente slot questa volta!");

    $("pannello-errore").classList.remove("nascosto");
    // Porta in vista il pannello di errore (utile su schermi piccoli)
    setTimeout(() => $("pannello-errore").scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }
}

$("pulsante-rifai").addEventListener("click", () => {
  avviaQuiz();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =====================================================================
   4) BANNER DI VITTORIA
   ===================================================================== */

function mostraVittoria() {
  mostraSchermata("schermata-vittoria");
  vibra([150, 80, 150, 80, 400]);
  lanciaCoriandoli(4000);
  // Ogni tanto altri coriandoli, per rendere il banner più festoso
  setInterval(() => lanciaCoriandoli(2500), 9000);
  mantieniSchermoAcceso();
}

// Chiede al telefono di non spegnere lo schermo (se supportato),
// così il ragazzo può mostrare il banner al Peer con calma.
async function mantieniSchermoAcceso() {
  try {
    if ("wakeLock" in navigator) {
      await navigator.wakeLock.request("screen");
    }
  } catch (e) { /* non supportato: nessun problema */ }
}

/* =====================================================================
   CORIANDOLI (animazione disegnata su <canvas>, nessuna libreria)
   ===================================================================== */

const tela = $("coriandoli");
const ctx = tela.getContext("2d");
let particelle = [];
let animazioneAttiva = false;
let ultimoStop = 0; // momento in cui i coriandoli sono stati fermati

// Ferma subito i coriandoli (usato quando si passa al quiz)
function fermaCoriandoli() {
  ultimoStop = performance.now();
  particelle = [];
}

function ridimensionaTela() {
  const dpr = window.devicePixelRatio || 1;
  tela.width = window.innerWidth * dpr;
  tela.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", ridimensionaTela);
ridimensionaTela();

function lanciaCoriandoli(durataMs) {
  const colori = ["#39ff14", "#ff2fd0", "#ffe600", "#00e5ff", "#ffffff", "#ff8c1a"];
  const avvio = performance.now();
  const fine = avvio + durataMs;
  const larghezza = window.innerWidth;

  // Creiamo nuovi coriandoli finché dura la "pioggia"
  function genera() {
    if (performance.now() > fine || ultimoStop >= avvio) return;
    for (let i = 0; i < 6; i++) {
      particelle.push({
        x: Math.random() * larghezza,
        y: -20,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3.5,
        dim: 6 + Math.random() * 8,
        angolo: Math.random() * Math.PI,
        rotazione: (Math.random() - 0.5) * 0.3,
        colore: colori[casuale(colori.length)],
        tondo: Math.random() < 0.3,
      });
    }
    setTimeout(genera, 60);
  }
  genera();

  if (!animazioneAttiva) {
    animazioneAttiva = true;
    requestAnimationFrame(animaCoriandoli);
  }
}

function animaCoriandoli() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particelle.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.angolo += p.rotazione;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angolo);
    ctx.fillStyle = p.colore;
    if (p.tondo) {
      ctx.beginPath();
      ctx.arc(0, 0, p.dim / 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.dim / 2, -p.dim / 4, p.dim, p.dim / 2);
    }
    ctx.restore();
  });
  // Eliminiamo i coriandoli usciti dallo schermo
  particelle = particelle.filter((p) => p.y < window.innerHeight + 30);

  if (particelle.length > 0) {
    requestAnimationFrame(animaCoriandoli);
  } else {
    animazioneAttiva = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
