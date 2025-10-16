# TQAN (FR) — Site statique

Ce dossier contient le **site vitrine** TQAN, prêt à être déployé sur **Vercel** (ou tout hébergeur statique).

## Déploiement rapide (Vercel + GitHub)
1. Créez un dépôt GitHub nommé `tqan` et **uploadez** ces fichiers.
2. Sur [Vercel](https://vercel.com) → **New Project** → sélectionnez le dépôt `tqan` → **Deploy**.
3. Le site sera disponible sur une URL du type `https://tqan.vercel.app`.

## Domaine `tqan.ma`
- Achetez le domaine chez Heberjahiz / Domains.ma, puis sur Vercel → *Project Settings → Domains* → ajoutez `tqan.ma` et suivez les instructions DNS.
- La propagation DNS peut prendre jusqu’à 24h.

## Formulaire de contact
- Le formulaire utilise **FormSubmit** pour envoyer les messages à **contact.sm2engineering@gmail.com**.
- Au **premier envoi**, vous recevrez un e‑mail de confirmation de FormSubmit : cliquez pour **valider** l’adresse puis les envois suivants arriveront directement.
- Vous pourrez ensuite remplacer par une adresse `contact@tqan.ma` si vous la créez.

## Modifier le contenu
- Éditez `index.html` (textes, sections) et `styles.css` (couleurs, styles).

## Ajouter l’arabe plus tard
Deux options :
- **Multilingue sur le même site** (bouton FR/AR) et gestion RTL dans le CSS.
- **Sous‑domaine** `ar.tqan.ma` avec une version HTML en arabe.

## Licence
Usage interne TQAN (© 2025).
