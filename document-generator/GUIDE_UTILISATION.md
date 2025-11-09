# 📘 Guide d'Utilisation - Générateur de Documents

## 🎯 Objectif

Cette application vous permet de créer rapidement des documents officiels professionnels au format PDF, avec en-tête, signature et cachet automatiquement intégrés.

## 🚀 Démarrage Rapide

### 1. Lancer l'Application

```bash
npm start
```

Ouvrez votre navigateur à l'adresse : **http://localhost:4200**

### 2. Interface de l'Application

L'application se compose de deux parties principales :

#### 📝 Formulaire (Gauche)
- **Numéro du Communiqué** : Saisissez le numéro de référence (ex: 001/2024, 002/2024, etc.)
- **Date** : La date du jour est pré-remplie, mais vous pouvez la modifier
- **Contenu du Document** : Rédigez votre document dans la zone de texte

#### 👀 Aperçu (Droite)
- Visualisation en temps réel de votre document
- Le document s'actualise automatiquement pendant que vous tapez
- Vous voyez exactement ce qui sera généré en PDF

### 3. Créer un Document

**Étape 1 : Remplir les informations**
```
Numéro du Communiqué : 001/2024
Date : 9 novembre 2025
```

**Étape 2 : Rédiger le contenu**
```
Objet : Demande de libération

Madame, Monsieur,

Nous avons l'honneur de porter à votre connaissance...

[Votre contenu]

Nous vous prions d'agréer, Madame, Monsieur, 
l'expression de nos salutations distinguées.
```

**Étape 3 : Vérifier l'aperçu**
- Regardez l'aperçu à droite
- Vérifiez que tout est correct
- L'en-tête, la signature et le cachet sont automatiquement ajoutés

**Étape 4 : Télécharger le PDF**
- Cliquez sur "📥 Télécharger le PDF"
- Le PDF est généré et téléchargé automatiquement
- Le fichier aura un nom comme : `Communique_001-2024_1699564800000.pdf`

## 🎨 Personnalisation

### Changer les Images

1. **Logo en-tête** : Remplacer `public/assets/images/justice-liberte.jpg`
2. **Signature** : Remplacer `public/assets/images/signature.jpg`
3. **Cachet** : Remplacer `public/assets/images/cachet.jpg`

> 💡 **Conseil** : Gardez les mêmes noms de fichiers pour que l'application les reconnaisse automatiquement.

### Format des Images Recommandé

- **Logo en-tête** : 800x800 pixels (PNG ou JPG)
- **Signature** : 600x200 pixels (PNG avec fond transparent de préférence)
- **Cachet** : 500x500 pixels (PNG avec fond transparent)

## 📋 Exemples d'Usage

### Communiqué Simple

```
N° : 001/2024
Date : 9 novembre 2025

Objet : Information générale

Le comité de Justice & Liberté - Voix Unies informe 
l'ensemble de ses membres que...
```

### Lettre Officielle

```
N° : 002/2024
Date : 9 novembre 2025

Objet : Demande officielle

Madame, Monsieur le Président,

Par la présente, nous avons l'honneur de solliciter...

Dans l'attente d'une réponse favorable, nous vous prions 
d'agréer, Madame, Monsieur le Président, l'expression 
de notre haute considération.
```

## 🔧 Astuces et Conseils

### ✅ Bonnes Pratiques

1. **Numérotation** : Utilisez une numérotation séquentielle (001/2024, 002/2024, etc.)
2. **Date** : Utilisez le bouton 📅 pour remettre la date du jour
3. **Mise en page** : Utilisez des sauts de ligne pour aérer le texte
4. **Relecture** : Vérifiez toujours l'aperçu avant de télécharger

### ⚠️ À Éviter

- ❌ Ne pas utiliser de caractères spéciaux dans le numéro (sauf /)
- ❌ Ne pas faire un document trop long (max 2 pages A4)
- ❌ Ne pas oublier de vérifier l'orthographe

## 🖨️ Imprimer le Document

Vous pouvez aussi imprimer directement depuis le navigateur :

1. Ouvrez l'aperçu du document
2. Faites `Ctrl + P` (ou `Cmd + P` sur Mac)
3. Sélectionnez votre imprimante ou "Enregistrer au format PDF"
4. Imprimez

## 📱 Utilisation Mobile

L'application est responsive et fonctionne sur mobile :

- Sur téléphone, les sections s'empilent verticalement
- L'aperçu est adapté à la taille de l'écran
- Toutes les fonctionnalités restent disponibles

## 🆘 Résolution de Problèmes

### Le PDF ne se télécharge pas
- Vérifiez que votre navigateur autorise les téléchargements
- Essayez avec un autre navigateur (Chrome, Firefox, Edge)
- Vérifiez que vous n'avez pas de bloqueur de pop-ups actif

### Les images ne s'affichent pas
- Vérifiez que les fichiers sont bien dans `public/assets/images/`
- Vérifiez les noms des fichiers (sensible à la casse)
- Rechargez la page (F5)

### L'application ne démarre pas
```bash
# Réinstallez les dépendances
npm install

# Relancez l'application
npm start
```

### Le document est coupé dans le PDF
- Réduisez la quantité de texte
- Utilisez des phrases plus courtes
- Vérifiez l'aperçu avant de générer

## 📞 Contact

Pour toute question ou assistance :
- Email : liberteiyac@gmail.com

## 🎓 Formation

### Premiers Pas (5 minutes)
1. Ouvrez l'application
2. Changez juste le numéro et la date
3. Téléchargez votre premier PDF

### Utilisation Avancée (15 minutes)
1. Personnalisez les images
2. Créez plusieurs types de documents
3. Testez l'impression directe

---

**Justice & Liberté - Voix Unies pour Ibrahim Yacouba** 🕊️

