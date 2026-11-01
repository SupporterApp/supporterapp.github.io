// src/data/empresa.ts

export const empresaData = {
  // Dades de l'empresa (substitueix els valors pels teus reals)
  nom: 'Jordi Sastre Saumell',
  nif: '33909851P',
  adreca: "Carrer d'Ausiàs Marc, 92 baixos 2a, 08205 Sabadell",
  email: 'privacitat@supporter-app.com',
  ciutat: 'Sabadell',
  dataRevisio: '2026-08-04',  // Data d'actualització
  versio: '1.0.0',           // Per a control de versions

  // Nom comercial de l'app. Ha de coincidir amb el nom de la fitxa de les
  // botigues i amb el que fan servir els textos legals.
  nomApp: 'Ffans',

  // Termini compromès per a l'eliminació de dades quan l'usuari ho demana.
  // Ha de ser coherent amb el que es publica a la pàgina d'eliminació de compte.
  diesEliminacioCompte: 30,
};

// Si vols, pots exportar també les dades per separat per a un accés més directe
export const {
  nom,
  nif,
  adreca,
  email,
  ciutat,
  dataRevisio,
  versio,
  nomApp,
  diesEliminacioCompte,
} = empresaData;
