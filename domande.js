/* =====================================================================
   DOMANDE DEL QUIZ
   ---------------------------------------------------------------------
   Ogni volta che si gioca, il sito pesca A CASO un certo numero di
   domande da questo elenco (senza ripeterle nello stesso quiz) e
   mescola l'ordine delle risposte.

   Quante domande fare per ogni quiz:                                  */
const DOMANDE_PER_QUIZ = 3;
/*
   COME MODIFICARE O AGGIUNGERE DOMANDE:
   Ogni domanda è un blocco tra parentesi graffe { ... } con queste parti:

     testo:     la domanda, tra virgolette.
     risposte:  l'elenco delle risposte, ognuna tra virgolette,
                separate da virgole.
     corretta:  il NUMERO della risposta giusta, contando DA ZERO:
                  0 = prima risposta dell'elenco
                  1 = seconda risposta dell'elenco
                (Consiglio: scrivi sempre per prima la risposta giusta
                 e lascia corretta: 0. Tanto il sito le mescola da solo.)
     spiegazione: (facoltativa) frase mostrata se il ragazzo sbaglia.
                  Per usarla aggiungi una riga così:
                  spiegazione: "Testo della spiegazione."

   REGOLE IMPORTANTI:
   - Non cancellare le virgole tra un blocco e l'altro.
   - Usa l'apostrofo ' dentro i testi (es. "Cos'è"): va benissimo.
     Non usare le virgolette " dentro i testi.
   - Le domande nell'elenco devono essere almeno quante DOMANDE_PER_QUIZ.
   ===================================================================== */

const DOMANDE = [
  {
    testo: "Quali sono i principi attivi della cannabis?",
    risposte: ["THC e CBD", "H2O e CO2"],
    corretta: 0
  },
  {
    testo: "Quali sono gli effetti immediati, a breve termine, dell'assunzione di cannabis?",
    risposte: ["Aumento dell'appetito e tachicardia", "Battito lento"],
    corretta: 0
  },
  {
    testo: "Quanto tempo resta il THC nell'urina?",
    risposte: ["Fino a 30 giorni", "48 ore"],
    corretta: 0
  },
  {
    testo: "Che rischi comporta l'uso frequente di cannabis?",
    risposte: ["Deficit di memoria e ansia", "Tranquillità"],
    corretta: 0
  },
  {
    testo: "Perché chi assume cannabis ha spesso molta fame?",
    risposte: ["L'appetito viene stimolato dal principio attivo", "Perché ti fa sentire più leggero"],
    corretta: 0
  },
  {
    testo: "La cannabis dà dipendenza?",
    risposte: ["Sì, psicologica, ma può essere anche fisica", "No, è un falso mito"],
    corretta: 0
  }
];
