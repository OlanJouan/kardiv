// Fonction serveur (serverless) pour Vercel.
// Elle crée une session de paiement Stripe Checkout et renvoie l'URL
// vers laquelle rediriger le client. La clé secrète Stripe est TOUJOURS
// lue depuis les variables d'environnement, jamais écrite en dur.

const Stripe = require('stripe');

// --- Catalogue officiel des prix (source de vérité) ---------------------
// Les prix sont définis ICI, côté serveur, et exprimés en centimes d'euro.
// On ne fait jamais confiance au prix envoyé par le navigateur : on prend
// toujours le prix de ce catalogue à partir du nom du produit. Cela empêche
// un visiteur malveillant de modifier les prix depuis la console.
const CATALOG = {
  'Ambre Sacré': 23000,
  'Blazer Noa': 76000,
  "Bois d'Orient": 16500,
  'Bottines Jade': 82000,
  'Cuir Intense': 19500,
  'Escarpins Aria': 65000,
  'Fleur de Néroli': 12500,
  'Foulard Soie Kardiv': 18000,
  'Jupe Eline': 54000,
  "Lumière d'Iris": 15500,
  'Manteau Iconique': 189000,
  "Nuit d'Or": 17500,
  'Pantalon Lya': 48000,
  'Pull Céleste': 28000,
  'Robe Dalia': 89000,
  "Rose d'Ivoire": 12000,
  'Sac Eclipse': 145000,
  'Sac Lune': 125000,
  'Top Sienna': 32000,
  Velours: 14500,
  'Éclat de Rose': 13500,
};

// Détermine l'adresse de base du site (https://mon-site.com) à partir de
// la requête, pour construire les URL de retour après paiement.
function getBaseUrl(req) {
  const origin = req.headers.origin;
  if (origin) return origin;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // La clé n'est pas configurée sur Vercel : message clair pour le débogage.
    return res.status(500).json({
      error:
        "Configuration manquante : la variable d'environnement STRIPE_SECRET_KEY n'est pas définie sur Vercel.",
    });
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : null;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide.' });
    }

    // Construit les lignes de commande à partir du catalogue serveur.
    const line_items = [];
    for (const item of items) {
      const name = typeof item.name === 'string' ? item.name.trim() : '';
      const amount = CATALOG[name];
      if (!amount) {
        return res
          .status(400)
          .json({ error: `Produit inconnu ou indisponible : ${name || '(sans nom)'}.` });
      }
      const quantity =
        Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;

      line_items.push({
        quantity,
        price_data: {
          currency: 'eur',
          unit_amount: amount,
          product_data: { name },
        },
      });
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      // On NE précise PAS payment_method_types : Stripe affiche
      // automatiquement les moyens de paiement les plus pertinents.
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      phone_number_collection: { enabled: true },
      success_url: `${baseUrl}/?paiement=reussi`,
      cancel_url: `${baseUrl}/?paiement=annule`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Erreur Stripe :', err);
    return res
      .status(500)
      .json({ error: "Le paiement n'a pas pu être initialisé. Réessayez plus tard.", debug: err.message });
  }
};
