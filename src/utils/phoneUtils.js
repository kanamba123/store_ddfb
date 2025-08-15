// Liste des préfixes valides
const validPrefixes = ["22","69","68","67","65","64","62","61","79","78","77","75","72","71"];

/**
 * Vérifie si un numéro de téléphone est valide :
 * - exactement 8 chiffres
 * - commence par un préfixe valide
 * @param {string} phoneNumber
 * @returns {boolean}
 */
export function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^[0-9]{8}$/;
  if (!phoneRegex.test(phoneNumber)) return false;

  const prefix = phoneNumber.substring(0, 2);
  return validPrefixes.includes(prefix);
}
