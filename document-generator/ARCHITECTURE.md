# 🏗️ Architecture de l'Application

## 📐 Vue d'Ensemble

L'application est construite avec **Angular 20** en utilisant l'approche **Standalone Components** (sans NgModules). Elle utilise **Signals** pour la gestion d'état réactive.

```
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              App Component                      │   │
│  │                                                 │   │
│  │  ┌──────────────┐      ┌──────────────────┐   │   │
│  │  │   Formulaire │ ←──→ │  Prévisualisation│   │   │
│  │  │   de saisie  │      │   du document    │   │   │
│  │  └──────────────┘      └──────────────────┘   │   │
│  │         ↓                       ↓              │   │
│  │  ┌─────────────────────────────────────┐      │   │
│  │  │    Génération PDF (jsPDF)           │      │   │
│  │  └─────────────────────────────────────┘      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Assets (Images)                    │   │
│  │  • Logo en-tête • Signature • Cachet           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ Structure des Fichiers

```
document-generator/
│
├── public/                          # Fichiers publics statiques
│   ├── favicon.ico                  # Icône du site
│   └── assets/
│       └── images/                  # Images du document
│           ├── justice-liberte.jpg  # Logo en-tête
│           ├── signature.jpg        # Image signature
│           └── cachet.jpg           # Image cachet
│
├── src/
│   ├── app/
│   │   ├── app.ts                   # Composant principal (logique)
│   │   ├── app.html                 # Template HTML
│   │   ├── app.css                  # Styles du composant
│   │   ├── app.config.ts            # Configuration de l'app
│   │   └── app.spec.ts              # Tests unitaires
│   │
│   ├── index.html                   # Point d'entrée HTML
│   ├── main.ts                      # Point d'entrée TypeScript
│   └── styles.css                   # Styles globaux
│
├── angular.json                     # Configuration Angular
├── tsconfig.json                    # Configuration TypeScript
├── package.json                     # Dépendances et scripts
│
└── Documentation/
    ├── README.md                    # Documentation principale
    ├── GUIDE_UTILISATION.md         # Guide utilisateur
    ├── DEPLOIEMENT.md               # Guide de déploiement
    └── ARCHITECTURE.md              # Ce fichier
```

## 🔧 Composants Techniques

### 1. App Component (`app.ts`)

**Responsabilités :**
- Gestion de l'état du document (Signals)
- Gestion du formulaire
- Génération du PDF
- Interaction utilisateur

**Signals utilisés :**
```typescript
documentData = signal<DocumentData>({
  communiqueNumber: string,
  date: string,
  content: string
})

isGenerating = signal<boolean>(false)
showPreview = signal<boolean>(true)
```

**Méthodes principales :**
- `updateCommuniqueNumber()` : Met à jour le numéro
- `updateDate()` : Met à jour la date
- `updateContent()` : Met à jour le contenu
- `generatePDF()` : Génère et télécharge le PDF
- `getCurrentDate()` : Obtient la date du jour

### 2. Template HTML (`app.html`)

**Structure :**
```html
<div class="app-container">
  <header>              <!-- En-tête de l'app -->
  <div class="main-content">
    <div class="form-section">        <!-- Formulaire -->
    <div class="preview-section">     <!-- Prévisualisation -->
      <div #documentPreview>          <!-- Zone capturée pour PDF -->
  </div>
  <footer>              <!-- Pied de page -->
</div>
```

### 3. Styles CSS (`app.css`)

**Organisation :**
- Variables CSS (couleurs, ombres)
- Styles globaux
- Styles du formulaire
- Styles de la prévisualisation
- Styles du document
- Responsive design
- Animations

## 🔌 Dépendances Principales

### Angular (v20)
```json
{
  "@angular/core": "^20.3.0",
  "@angular/common": "^20.3.0",
  "@angular/forms": "^20.3.0"
}
```

**Utilisation :**
- Standalone Components
- Signals pour la réactivité
- FormsModule pour les formulaires
- CommonModule pour les directives

### jsPDF (v3.0.3)
```typescript
import jsPDF from 'jspdf';
```

**Utilisation :**
- Création de documents PDF
- Format A4 (210 x 297 mm)
- Export en format portrait

### html2canvas (v1.4.1)
```typescript
import html2canvas from 'html2canvas';
```

**Utilisation :**
- Capture du DOM HTML en image
- Conversion en canvas
- Haute résolution (scale: 2)

## 🔄 Flux de Données

### 1. Saisie Utilisateur

```
Utilisateur tape → Input Event → Update Signal → Re-render Template
```

```typescript
// Exemple pour le contenu
<textarea (input)="updateContent($any($event.target).value)">

updateContent(value: string) {
  this.documentData.update(data => ({ ...data, content: value }));
}
```

### 2. Génération PDF

```
Clic Bouton → generatePDF() → html2canvas → jsPDF → Téléchargement
```

**Étapes détaillées :**
```typescript
async generatePDF() {
  // 1. Activer le flag de génération
  this.isGenerating.set(true);
  
  // 2. Capturer le DOM en canvas
  const canvas = await html2canvas(element, {
    scale: 2,              // Haute résolution
    useCORS: true,         // Charger les images externes
    backgroundColor: '#fff'
  });
  
  // 3. Convertir en image
  const imgData = canvas.toDataURL('image/png');
  
  // 4. Créer le PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // 5. Ajouter l'image au PDF
  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  
  // 6. Télécharger
  pdf.save(fileName);
  
  // 7. Désactiver le flag
  this.isGenerating.set(false);
}
```

## 🎨 Gestion des Styles

### Variables CSS
```css
:host {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  --success-color: #27ae60;
  --bg-light: #f8f9fa;
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Grid Layout
```css
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2 colonnes égales */
  gap: 2rem;
}
```

### Responsive
```css
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;  /* 1 colonne */
  }
}
```

## 📊 Gestion d'État avec Signals

### Pourquoi les Signals ?

**Avantages :**
- ✅ Réactivité fine-grained
- ✅ Performance optimale (pas de Zone.js nécessaire)
- ✅ Code plus simple et lisible
- ✅ Meilleur support TypeScript

### Exemple d'utilisation

```typescript
// Déclaration
documentData = signal<DocumentData>({
  communiqueNumber: '001/2024',
  date: this.getCurrentDate(),
  content: '...'
});

// Lecture
const currentData = this.documentData();

// Mise à jour
this.documentData.update(data => ({ 
  ...data, 
  communiqueNumber: newValue 
}));

// Dans le template
{{ documentData().communiqueNumber }}
```

## 🔐 Sécurité

### Pas de Backend
- ✅ Toutes les opérations sont côté client
- ✅ Aucune donnée n'est envoyée à un serveur
- ✅ Confidentialité totale

### Images
- ✅ Images stockées localement
- ✅ Pas de CDN externe
- ✅ Configuration CORS pour html2canvas

## ⚡ Performance

### Optimisations

1. **Lazy Loading** : Les composants sont chargés à la demande
2. **OnPush Change Detection** : Détection de changement optimisée avec Signals
3. **Build Production** : Minification et tree-shaking automatiques
4. **Images** : Format optimisé JPG pour les images

### Métriques Cibles

- **FCP (First Contentful Paint)** : < 1.5s
- **LCP (Largest Contentful Paint)** : < 2.5s
- **TTI (Time to Interactive)** : < 3.5s
- **Bundle Size** : < 500KB (gzipped)

## 🧪 Tests

### Structure de Test
```typescript
describe('App', () => {
  it('should create the app', () => {
    // Test de création
  });
  
  it('should update document data', () => {
    // Test de mise à jour
  });
  
  it('should generate PDF', async () => {
    // Test de génération PDF
  });
});
```

### Lancer les Tests
```bash
npm test
```

## 🔄 Cycle de Vie

```
1. Bootstrap (main.ts)
   ↓
2. App Component Init
   ↓
3. Render Template
   ↓
4. User Interaction
   ↓
5. Signal Update → Re-render
   ↓
6. PDF Generation (on demand)
```

## 🚀 Build et Déploiement

### Development Build
```bash
npm start
# Génère : development build avec source maps
# Mode : JIT compilation
# Watch : Oui
```

### Production Build
```bash
npm run build:prod
# Génère : dist/document-generator/browser/
# Optimisations : AOT, minification, tree-shaking
# Source maps : Non
# Taille : ~300KB (gzipped)
```

## 📈 Évolutions Futures

### Fonctionnalités Possibles

1. **Sauvegarde Locale**
   - localStorage pour sauvegarder les brouillons
   - IndexedDB pour l'historique

2. **Templates Multiples**
   - Différents types de documents
   - Templates personnalisables

3. **Export Multiple**
   - Export Word (.docx)
   - Export Image (.png, .jpg)

4. **Éditeur Enrichi**
   - Mise en forme du texte (gras, italique)
   - Insertion de tableaux
   - Insertion d'images

5. **Multi-langue**
   - i18n Angular
   - Support français/anglais

## 📚 Ressources

### Documentation Angular
- [Angular Docs](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)

### Documentation Bibliothèques
- [jsPDF](https://github.com/parallax/jsPDF)
- [html2canvas](https://html2canvas.hertzen.com/)

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amélioration`)
3. Commit les changements (`git commit -am 'Ajout fonctionnalité'`)
4. Push la branche (`git push origin feature/amélioration`)
5. Créer une Pull Request

---

**Développé avec ❤️ pour Justice & Liberté**

