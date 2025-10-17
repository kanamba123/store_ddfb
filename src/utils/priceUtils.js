// utils/priceUtils.js

/**
 * Augmente un prix d'un certain pourcentage.
 * @param {number} price - Le prix de base.
 * @param {number} percentage - Le pourcentage à ajouter (ex: 10 = +10%).
 * @returns {number} - Le nouveau prix augmenté.
 */
export const increasePriceByPercentage = (price, percentage) => {
  if (isNaN(price) || isNaN(percentage)) {
    console.error("Les valeurs doivent être des nombres valides.");
    return price;
  }

  const newPrice = price + (price * percentage) / 100;
  return Number(newPrice.toFixed(2)); // arrondi à 2 décimales
};
