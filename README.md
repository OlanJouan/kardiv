# Site Kardiv — Paiement Stripe

Ce dossier contient le site Kardiv (mode femme & parfums) **avec un paiement en
ligne sécurisé via Stripe**. Quand un client clique sur **« Commander »** dans le
panier, il est redirigé vers une page de paiement hébergée par Stripe (carte
bancaire, etc.), puis renvoyé sur le site.

Rien de sensible n'est écrit dans le code : la clé secrète Stripe est lue depuis
une **variable d'environnement** appelée `STRIPE_SECRET_KEY`.

---

## 1. Comment ça marche (en bref)

- `api/create-checkout-session.js` : petite fonction serveur (sur Vercel) qui crée
  la session de paiement Stripe. Elle contient le **catalogue officiel des prix** :
  même si quelqu'un modifie un prix dans le navigateur, c'est toujours le prix du
  serveur qui est facturé.
- `cart.js` / `cart.min.js` : le panier du site. Le bouton « Commander » envoie le
  panier à la fonction serveur et redirige le client vers Stripe.
- `package.json` : indique à Vercel d'installer la librairie `stripe`.

---

## 2. Mettre sa clé Stripe sur Vercel (étape la plus importante)

1. Créez un compte gratuit sur **https://stripe.com** et connectez-vous.
2. En haut à droite, laissez le **Mode Test** activé (interrupteur « Test mode »).
3. Allez dans **Développeurs → Clés API** (Developers → API keys).
4. Copiez la **« Clé secrète »** (Secret key). En mode Test elle commence par
   `sk_test_...`.
5. Ouvrez votre projet sur **https://vercel.com** → onglet **Settings** →
   **Environment Variables**.
6. Ajoutez une variable :
   - **Name** (nom) : `STRIPE_SECRET_KEY`
   - **Value** (valeur) : collez votre clé `sk_test_...`
   - Cochez les 3 environnements (Production, Preview, Development).
7. Cliquez **Save**, puis **redéployez** le site (onglet Deployments → « Redeploy »)
   pour que la nouvelle variable soit prise en compte.

> ⚠️ Ne mettez JAMAIS votre clé secrète directement dans le code ou dans un fichier
> envoyé sur GitHub. Le fichier `.env` est déjà ignoré par Git (`.gitignore`).

---

## 3. Tester le paiement (fausse carte, aucun vrai débit)

Une fois le site déployé avec la clé `sk_test_...`, faites un achat test :

1. Ajoutez un article au panier, cliquez sur **« Commander »**.
2. Sur la page Stripe, utilisez cette **carte de test** :
   - Numéro : **4242 4242 4242 4242**
   - Date d'expiration : n'importe quelle date **future** (ex : `12 / 34`)
   - CVC : n'importe quels 3 chiffres (ex : `123`)
   - Code postal : n'importe lequel (ex : `75001`)
3. Validez : vous êtes redirigé vers le site avec un message de remerciement, et le
   panier se vide.

Aucune somme réelle n'est débitée en mode Test. D'autres cartes de test existent
(paiement refusé, etc.) : voir https://stripe.com/docs/testing.

---

## 4. Passer en mode réel (Live) plus tard

Quand vous êtes prêt à encaisser de **vrais** paiements :

1. Sur Stripe, complétez l'activation du compte (informations légales / bancaires).
2. Basculez l'interrupteur en haut à droite sur **Mode réel** (Live).
3. Dans **Développeurs → Clés API**, copiez la clé secrète **Live** (elle commence
   par `sk_live_...`).
4. Sur Vercel, remplacez la valeur de `STRIPE_SECRET_KEY` par cette clé `sk_live_...`,
   enregistrez, puis **redéployez**.

À partir de là, les paiements sont réels. La carte `4242...` ne fonctionne plus (elle
est réservée au mode Test).

---

## 5. Tester en local (facultatif)

Le paiement a besoin de la fonction serveur : il ne fonctionne donc **pas** en
ouvrant simplement `index.html` dans le navigateur. Pour tester en local :

```bash
npm install            # installe la librairie stripe
npm i -g vercel        # installe l'outil Vercel (une seule fois)
vercel dev             # lance le site en local avec les fonctions serveur
```

Créez à côté un fichier `.env` (copié depuis `.env.example`) contenant votre clé
`sk_test_...`. Ce fichier n'est jamais envoyé sur GitHub.

---

## 6. Modifier les prix

Les prix font foi **dans deux endroits** qui doivent rester cohérents :

- Les boutons « Ajouter au panier » dans les pages HTML (`data-price`, en euros).
- Le catalogue serveur dans `api/create-checkout-session.js` (en **centimes** :
  120 € s'écrit `12000`).

Si vous changez un prix, pensez à le mettre à jour aux deux endroits.
