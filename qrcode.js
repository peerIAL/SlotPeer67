/* =====================================================================
   GENERATORE DI QR CODE (scritto da zero, nessuna libreria esterna)
   ---------------------------------------------------------------------
   Segue lo standard ufficiale dei QR code (ISO/IEC 18004), modalità
   "byte", così funziona con qualsiasi indirizzo web.
   NON serve modificare questo file.

   Uso:
     const qr = QRGeneratore.genera("https://esempio.it", "M");
     qr.dimensione  → numero di quadratini per lato
     qr.moduli[y][x] → true = quadratino nero
   Livelli di correzione errori: "L" (7%), "M" (15%), "Q" (25%), "H" (30%).
   ===================================================================== */

(function (globale) {
  "use strict";

  // Tabelle dello standard: codewords di correzione per blocco e numero di blocchi
  const ECC_PER_BLOCCO = {
    L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  };
  const NUM_BLOCCHI = {
    L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
  };
  const BIT_FORMATO = { L: 1, M: 0, Q: 3, H: 2 };

  const bit = (valore, i) => ((valore >>> i) & 1) !== 0;

  // Numero di moduli disponibili per i dati in una certa versione
  function moduliDatiGrezzi(ver) {
    let r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const nAll = Math.floor(ver / 7) + 2;
      r -= (25 * nAll - 10) * nAll - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }
  function codewordsDati(ver, liv) {
    return Math.floor(moduliDatiGrezzi(ver) / 8) - ECC_PER_BLOCCO[liv][ver] * NUM_BLOCCHI[liv][ver];
  }

  // ---- Aritmetica di Reed-Solomon nel campo GF(256) ----
  function moltiplica(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
  function divisoreRS(grado) {
    const r = new Array(grado).fill(0);
    r[grado - 1] = 1;
    let radice = 1;
    for (let i = 0; i < grado; i++) {
      for (let j = 0; j < grado; j++) {
        r[j] = moltiplica(r[j], radice);
        if (j + 1 < grado) r[j] ^= r[j + 1];
      }
      radice = moltiplica(radice, 0x02);
    }
    return r;
  }
  function restoRS(dati, divisore) {
    const r = divisore.map(() => 0);
    for (const b of dati) {
      const fattore = b ^ r.shift();
      r.push(0);
      divisore.forEach((coef, i) => (r[i] ^= moltiplica(coef, fattore)));
    }
    return r;
  }

  // Posizioni dei quadratini di allineamento
  function posizioniAllineamento(ver, dim) {
    if (ver === 1) return [];
    const n = Math.floor(ver / 7) + 2;
    const passo = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
    const r = [6];
    for (let p = dim - 7; r.length < n; p -= passo) r.splice(1, 0, p);
    return r;
  }

  function genera(testo, livello) {
    const liv = ECC_PER_BLOCCO[livello] ? livello : "M";
    const byte = Array.from(new TextEncoder().encode(String(testo)));

    // 1) Scegli la versione (grandezza) più piccola che contiene il testo
    let ver, bitConteggio;
    for (ver = 1; ver <= 40; ver++) {
      bitConteggio = ver <= 9 ? 8 : 16;
      if (4 + bitConteggio + byte.length * 8 <= codewordsDati(ver, liv) * 8) break;
    }
    if (ver > 40) throw new Error("Testo troppo lungo per un QR code");

    // 2) Codifica i dati in una sequenza di bit
    const bits = [];
    const aggiungi = (valore, n) => { for (let i = n - 1; i >= 0; i--) bits.push((valore >>> i) & 1); };
    aggiungi(0b0100, 4);               // modalità byte
    aggiungi(byte.length, bitConteggio);
    byte.forEach((b) => aggiungi(b, 8));
    const capacita = codewordsDati(ver, liv) * 8;
    aggiungi(0, Math.min(4, capacita - bits.length)); // terminatore
    aggiungi(0, (8 - (bits.length % 8)) % 8);
    for (let pad = 0xec; bits.length < capacita; pad ^= 0xec ^ 0x11) aggiungi(pad, 8);

    const dati = [];
    for (let i = 0; i < bits.length; i += 8) {
      let v = 0;
      for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
      dati.push(v);
    }

    // 3) Dividi in blocchi, aggiungi la correzione errori e intercala
    const nBlocchi = NUM_BLOCCHI[liv][ver];
    const eccLen = ECC_PER_BLOCCO[liv][ver];
    const totaleCodewords = Math.floor(moduliDatiGrezzi(ver) / 8);
    const nBlocchiCorti = nBlocchi - (totaleCodewords % nBlocchi);
    const lenCorto = Math.floor(totaleCodewords / nBlocchi);
    const divisore = divisoreRS(eccLen);
    const blocchi = [];
    for (let i = 0, k = 0; i < nBlocchi; i++) {
      const lung = lenCorto - eccLen + (i < nBlocchiCorti ? 0 : 1);
      const d = dati.slice(k, k + lung);
      k += lung;
      const ecc = restoRS(d, divisore);
      if (i < nBlocchiCorti) d.push(0);
      blocchi.push(d.concat(ecc));
    }
    const finali = [];
    for (let i = 0; i < blocchi[0].length; i++) {
      blocchi.forEach((b, j) => {
        if (i !== lenCorto - eccLen || j >= nBlocchiCorti) finali.push(b[i]);
      });
    }

    // 4) Disegna la matrice
    const dim = ver * 4 + 17;
    const moduli = Array.from({ length: dim }, () => new Array(dim).fill(false));
    const funzione = Array.from({ length: dim }, () => new Array(dim).fill(false));
    const imposta = (x, y, nero) => { moduli[y][x] = nero; funzione[y][x] = true; };

    for (let i = 0; i < dim; i++) { imposta(6, i, i % 2 === 0); imposta(i, 6, i % 2 === 0); } // linee di sincronia

    const finder = (cx, cy) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx, y = cy + dy;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < dim && y >= 0 && y < dim) imposta(x, y, dist !== 2 && dist !== 4);
      }
    };
    finder(3, 3); finder(dim - 4, 3); finder(3, dim - 4);

    const all = posizioniAllineamento(ver, dim);
    const nA = all.length;
    for (let i = 0; i < nA; i++) for (let j = 0; j < nA; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === nA - 1) || (i === nA - 1 && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++)
        imposta(all[i] + dx, all[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }

    const disegnaFormato = (maschera) => {
      const d = (BIT_FORMATO[liv] << 3) | maschera;
      let rem = d;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const b = ((d << 10) | rem) ^ 0x5412;
      for (let i = 0; i <= 5; i++) imposta(8, i, bit(b, i));
      imposta(8, 7, bit(b, 6)); imposta(8, 8, bit(b, 7)); imposta(7, 8, bit(b, 8));
      for (let i = 9; i < 15; i++) imposta(14 - i, 8, bit(b, i));
      for (let i = 0; i < 8; i++) imposta(dim - 1 - i, 8, bit(b, i));
      for (let i = 8; i < 15; i++) imposta(8, dim - 15 + i, bit(b, i));
      imposta(8, dim - 8, true);
    };
    disegnaFormato(0); // riserva lo spazio

    if (ver >= 7) {
      let rem = ver;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      const b = (ver << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const a = dim - 11 + (i % 3), c = Math.floor(i / 3);
        imposta(a, c, bit(b, i)); imposta(c, a, bit(b, i));
      }
    }

    // Posiziona i bit dei dati a zig-zag
    let i = 0;
    for (let destra = dim - 1; destra >= 1; destra -= 2) {
      if (destra === 6) destra = 5;
      for (let v = 0; v < dim; v++) for (let j = 0; j < 2; j++) {
        const x = destra - j;
        const suGiu = ((destra + 1) & 2) === 0;
        const y = suGiu ? dim - 1 - v : v;
        if (!funzione[y][x] && i < finali.length * 8) {
          moduli[y][x] = bit(finali[i >>> 3], 7 - (i & 7));
          i++;
        }
      }
    }

    // 5) Prova le 8 maschere e tieni quella con penalità minore
    const condMaschera = [
      (x, y) => (x + y) % 2 === 0,
      (x, y) => y % 2 === 0,
      (x) => x % 3 === 0,
      (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
      (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
      (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
      (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
    ];
    const applicaMaschera = (m) => {
      for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++)
        if (!funzione[y][x] && condMaschera[m](x, y)) moduli[y][x] = !moduli[y][x];
    };

    let migliore = 0, penalitaMin = Infinity;
    for (let m = 0; m < 8; m++) {
      applicaMaschera(m);
      disegnaFormato(m);
      const p = penalita(moduli, dim);
      if (p < penalitaMin) { penalitaMin = p; migliore = m; }
      applicaMaschera(m); // annulla (la maschera è un XOR)
    }
    applicaMaschera(migliore);
    disegnaFormato(migliore);

    return { dimensione: dim, moduli, versione: ver, livello: liv, maschera: migliore };
  }

  // Calcolo della "penalità" di una maschera (regole dello standard)
  function penalita(m, dim) {
    let p = 0, neri = 0;
    const leggi = (orizzontale, a, b) => (orizzontale ? m[a][b] : m[b][a]);
    for (const orizz of [true, false]) {
      for (let a = 0; a < dim; a++) {
        let run = 1;
        const riga = [];
        for (let b = 0; b < dim; b++) {
          const v = leggi(orizz, a, b);
          riga.push(v ? 1 : 0);
          if (b > 0) {
            if (v === leggi(orizz, a, b - 1)) run++;
            else { if (run >= 5) p += run - 2; run = 1; }
          }
        }
        if (run >= 5) p += run - 2;
        const s = riga.join("");
        const conta = (pat) => { let c = 0, k = -1; while ((k = s.indexOf(pat, k + 1)) !== -1) c++; return c; };
        p += 40 * (conta("10111010000") + conta("00001011101"));
      }
    }
    for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++) {
      if (m[y][x]) neri++;
      if (x < dim - 1 && y < dim - 1) {
        const c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
      }
    }
    const totale = dim * dim;
    p += Math.max(0, Math.ceil(Math.abs(neri * 20 - totale * 10) / totale) - 1) * 10;
    return p;
  }

  // Disegna il QR code su un <canvas>
  function disegnaSuCanvas(canvas, qr, opzioni = {}) {
    const margine = 4;                        // "zona di quiete" bianca richiesta dallo standard
    const lato = opzioni.lato || 800;          // pixel del lato del QR
    const didascalia = opzioni.didascalia || "";
    const altezzaTesto = didascalia ? Math.round(lato * 0.12) : 0;
    const celle = qr.dimensione + margine * 2;
    const passo = Math.floor(lato / celle);
    const latoReale = passo * celle;

    canvas.width = latoReale;
    canvas.height = latoReale + altezzaTesto;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    for (let y = 0; y < qr.dimensione; y++) for (let x = 0; x < qr.dimensione; x++)
      if (qr.moduli[y][x]) ctx.fillRect((x + margine) * passo, (y + margine) * passo, passo, passo);

    if (didascalia) {
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let corpo = Math.round(altezzaTesto * 0.55);
      ctx.font = `bold ${corpo}px Arial, sans-serif`;
      while (ctx.measureText(didascalia).width > latoReale * 0.92 && corpo > 10) {
        corpo -= 2;
        ctx.font = `bold ${corpo}px Arial, sans-serif`;
      }
      ctx.fillText(didascalia, latoReale / 2, latoReale + altezzaTesto / 2 - passo * 2);
    }
  }

  globale.QRGeneratore = { genera, disegnaSuCanvas };
})(typeof window !== "undefined" ? window : globalThis);
