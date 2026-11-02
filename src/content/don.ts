// The donation page only points to WhatsApp: the Ligue's team gives the
// details (means of payment, receipts) in the conversation.

const MESSAGE =
  "Bonjour, je souhaite contribuer à la construction du siège de la Ligue pour la Lecture de la Bible. Pouvez-vous me donner les informations ?";

/** Digits only, with Benin's +229 prefix added to a local number. */
export function whatsappNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("229") && digits.length > 10 ? digits : `229${digits}`;
}

export function whatsappLink(raw: string) {
  return `https://wa.me/${whatsappNumber(raw)}?text=${encodeURIComponent(MESSAGE)}`;
}

/** "+229 01 97 57 20 37" */
export function displayNumber(raw: string) {
  const n = whatsappNumber(raw);
  return `+229 ${n.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ")}`;
}

export const steps = [
  { title: "Écrivez-nous sur WhatsApp", text: "Un message suffit : le bouton ouvre la conversation avec l'équipe de la Ligue, déjà rédigée." },
  { title: "Recevez les informations", text: "L'équipe vous indique les moyens de contribuer et répond à vos questions sur le projet." },
  { title: "Suivez le chantier", text: "Chaque étape de la construction est documentée sur ce site, en photos et en comptes rendus." },
];
