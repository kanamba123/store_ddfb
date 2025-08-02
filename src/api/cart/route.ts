import { API_URL } from "@/config/API";

const LOCAL_CART_KEY = "cart";

// 🔹 Mode API (utilisateur connecté)
async function fetchCartAPI(userId?: number) {
  const url = userId ? `${API_URL}/cart?userId=${userId}` : `${API_URL}/cart`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function postProductAPI(product: any) {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function deleteProductAPI(id: number) {
  const res = await fetch(`${API_URL}/cart?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 🔹 Mode LocalStorage (utilisateur non connecté)
function getCartLocal(userId: number | null = null) {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    const cart = stored ? JSON.parse(stored) : [];

    const sessionId = userId ?? "guest-session"; // sessionId lié à userId ou session invité
    // Filtrer uniquement les items pour cette session
    return cart.filter((item: any) => item.sessionId === sessionId);
  } catch (e) {
    console.error("Erreur lecture localStorage", e);
    return [];
  }
}

function saveCartLocal(cart: any[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

async function fetchCartLocal(userId: number | null = null) {
  return getCartLocal(userId);
}

async function postProductLocal(product: any, userId: number | null = null) {
  // Récupère tout le panier (toutes sessions)
  const stored = localStorage.getItem(LOCAL_CART_KEY);
  const cart = stored ? JSON.parse(stored) : [];

  const sessionId = userId ?? "guest-session";
  const productKey = `${sessionId}:${product.id}`;

  // Trouver produit existant pour cette session
  const existing = cart.find((item: any) => item.key === productKey);

  let updated;
  if (existing) {
    updated = cart.map((item: any) =>
      item.key === productKey
        ? { ...item, quantity: item.quantity + (product.quantity ?? 1) }
        : item
    );
  } else {
    const newItem = {
      ...product,
      quantity: product.quantity ?? 1,
      key: productKey,
      sessionId,
    };
    updated = [...cart, newItem];
  }

  saveCartLocal(updated);

  // Retourner uniquement les items de la session en cours
  return updated.filter((item: any) => item.sessionId === sessionId);
}

async function deleteProductLocal(id: number, userId: number | null = null) {
  const stored = localStorage.getItem(LOCAL_CART_KEY);
  const cart = stored ? JSON.parse(stored) : [];

  const sessionId = userId ?? "guest-session";

  // Supprimer uniquement le produit de la session en cours
  const updated = cart.filter(
    (item: any) => !(item.id === id && item.sessionId === sessionId)
  );

  saveCartLocal(updated);

  // Retourner uniquement les items de la session en cours
  return updated.filter((item: any) => item.sessionId === sessionId);
}

// 🔀 Export dynamique selon authentification
export function createCartService(isAuthenticated: boolean) {
  return {
    fetchCart: isAuthenticated ? fetchCartAPI : fetchCartLocal,
    postProduct: isAuthenticated ? postProductAPI : postProductLocal,
    deleteProduct: isAuthenticated ? deleteProductAPI : deleteProductLocal,
  };
}
