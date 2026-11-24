/* =====================================================================
   DOMANDE DEL QUIZ
   ---------------------------------------------------------------------
   COME MODIFICARLE:
   Ogni domanda è un blocco tra parentesi graffe { ... } con 4 parti:

     testo:     la domanda, tra virgolette.
     risposte:  l'elenco delle risposte possibili (da 3 a 4),
                ognuna tra virgolette e separate da virgole.
     corretta:  il NUMERO della risposta giusta, contando DA ZERO:
                  0 = prima risposta
                  1 = seconda risposta
                  2 = terza risposta
                  3 = quarta risposta
     spiegazione: (facoltativa) una frase mostrata se il ragazzo sbaglia,
                  per spiegare la risposta giusta.

   REGOLE IMPORTANTI:
   - Non cancellare le virgole tra un blocco e l'altro.
   - Se nel testo ti serve una virgoletta " scrivi \" (barra + virgoletta),
     oppure usa l'apostrofo ' che non crea problemi.
   - Puoi mettere anche più di 3 domande: verranno poste tutte, in ordine.

   ESEMPIO:
     {
       testo: "Di che colore è il cielo?",
       risposte: ["Verde", "Blu", "Rosso"],
       corretta: 1,
       spiegazione: "Il cielo di giorno appare blu."
     },
   ===================================================================== */

const DOMANDE = [
  {
    testo: "DOMANDA 1 (segnaposto): scrivi qui il testo della prima domanda",
    risposte: ["Risposta A", "Risposta B (giusta)", "Risposta C", "Risposta D"],
    corretta: 1,
    spiegazione: "Qui puoi spiegare perché la risposta giusta è la B."
  },
  {
    testo: "DOMANDA 2 (segnaposto): scrivi qui il testo della seconda domanda",
    risposte: ["Risposta A (giusta)", "Risposta B", "Risposta C"],
    corretta: 0,
    spiegazione: "Qui puoi spiegare perché la risposta giusta è la A."
  },
  {
    testo: "DOMANDA 3 (segnaposto): scrivi qui il testo della terza domanda",
    risposte: ["Risposta A", "Risposta B", "Risposta C", "Risposta D (giusta)"],
    corretta: 3,
    spiegazione: "Qui puoi spiegare perché la risposta giusta è la D."
  }
];
