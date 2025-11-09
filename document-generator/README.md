# 📄 Générateur de Documents Officiels

Application Angular pour générer facilement des documents officiels au format PDF avec en-tête, signature et cachet.

## ✨ Fonctionnalités

- ✅ **Interface moderne et intuitive** - Formulaire simple pour saisir les informations
- ✅ **Prévisualisation en temps réel** - Voir le document avant de le générer
- ✅ **Génération PDF** - Téléchargement du document au format PDF
- ✅ **Personnalisable** - Modifier le numéro, la date et le contenu
- ✅ **Design professionnel** - Mise en page élégante avec en-tête, signature et cachet
- ✅ **Responsive** - Fonctionne sur tous les appareils

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm (installé avec Node.js)

### Installation

```bash
# Installer les dépendances
npm install
```

### Démarrage du serveur de développement

```bash
# Démarrer l'application
npm start
```

L'application sera accessible à l'adresse : **http://localhost:4200**

## 📖 Utilisation

1. **Ouvrir l'application** dans votre navigateur
2. **Remplir le formulaire** :
   - Numéro du communiqué (ex: 001/2024)
   - Date (la date du jour est proposée par défaut)
   - Contenu du document
3. **Prévisualiser** le document dans la section de droite
4. **Télécharger le PDF** en cliquant sur le bouton "Télécharger le PDF"

## 🎨 Personnalisation

### Modifier les images

Les images sont situées dans le dossier `public/assets/images/` :
- `justice-liberte.jpg` - Logo de l'en-tête
- `signature.jpg` - Image de la signature
- `cachet.jpg` - Image du cachet

Remplacez ces fichiers par vos propres images pour personnaliser le document.

### Modifier le style

Le style de l'application peut être modifié dans :
- `src/app/app.css` - Styles du composant principal
- `src/styles.css` - Styles globaux

### Modifier le contenu par défaut

Dans le fichier `src/app/app.ts`, vous pouvez modifier :
- Le numéro de communiqué par défaut
- Le contenu du document par défaut
- Le format de la date

## 🏗️ Structure du Projet

```
document-generator/
├── public/
│   └── assets/
│       └── images/          # Images (logo, signature, cachet)
├── src/
│   ├── app/
│   │   ├── app.ts          # Composant principal
│   │   ├── app.html        # Template HTML
│   │   └── app.css         # Styles du composant
│   ├── styles.css          # Styles globaux
│   └── index.html          # Page HTML principale
├── package.json            # Dépendances npm
└── README.md              # Ce fichier
```

## 📦 Technologies Utilisées

- **Angular 19** - Framework web
- **TypeScript** - Langage de programmation
- **jsPDF** - Génération de PDF
- **html2canvas** - Capture d'écran HTML vers image
- **CSS3** - Styles modernes

## 🛠️ Commandes Utiles

```bash
# Démarrer le serveur de développement
npm start

# Compiler pour la production
npm run build

# Lancer les tests
npm test

# Linter le code
npm run lint
```

## 📝 Notes

- Les documents sont générés côté client (dans le navigateur)
- Aucune donnée n'est envoyée à un serveur
- Les PDF sont générés à partir du HTML visible
- La qualité du PDF dépend de la résolution de l'écran

## 🤝 Support

Pour toute question ou problème, contactez : liberteiyac@gmail.com

## 📜 Licence

Justice & Liberté - Voix Unies pour Ibrahim Yacouba © 2024

---

**Fait avec ❤️ pour la Justice et la Liberté**
