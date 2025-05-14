import { EbillingJS } from "ebilling-js";

// Récupération des variables d'environnement
const envVariables = {
  username: process.env.EBILLING_USERNAME!,
  sharedKey: process.env.EBILLING_SHARED_KEY!,
  domain: process.env.EBILLING_DOMAIN!
};

// Affichage des variables d'environnement (à des fins de debug)
console.log('Configuration EbillingJS:', {
  environment: "lab",
  username: envVariables.username ? "*** (masqué)" : "non défini",
  sharedKey: envVariables.sharedKey ? "*** (masqué)" : "non défini",
  domain: envVariables.domain || "non défini"
});

const ebilling = new EbillingJS(
  "lab",
  envVariables.username,
  envVariables.sharedKey,
  envVariables.domain
);

export default ebilling;

