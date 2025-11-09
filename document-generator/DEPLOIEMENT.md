# 🚀 Guide de Déploiement

Ce guide vous explique comment déployer votre application de génération de documents.

## 📦 Compilation pour la Production

### 1. Compiler l'Application

```bash
npm run build:prod
```

Cette commande crée un dossier `dist/` contenant tous les fichiers optimisés pour la production.

### 2. Fichiers Générés

```
dist/document-generator/
├── browser/
│   ├── index.html
│   ├── main-[hash].js
│   ├── polyfills-[hash].js
│   ├── styles-[hash].css
│   └── assets/
│       └── images/
```

## 🌐 Options de Déploiement

### Option 1 : Déploiement Local (Serveur Simple)

**Pour Windows :**
```bash
# Installer http-server globalement
npm install -g http-server

# Se déplacer dans le dossier de build
cd dist/document-generator/browser

# Démarrer le serveur
http-server -p 8080
```

**Pour Linux/Mac :**
```bash
# Installer http-server
npm install -g http-server

# Démarrer depuis le dossier de build
cd dist/document-generator/browser
http-server -p 8080
```

Accédez à : `http://localhost:8080`

### Option 2 : Netlify (Gratuit et Simple)

1. **Créer un compte sur [Netlify](https://www.netlify.com/)**

2. **Installer Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Se connecter**
```bash
netlify login
```

4. **Déployer**
```bash
# Compiler
npm run build:prod

# Déployer
netlify deploy --dir=dist/document-generator/browser --prod
```

5. **Votre site est en ligne !** 🎉

### Option 3 : Vercel (Gratuit et Rapide)

1. **Installer Vercel CLI**
```bash
npm install -g vercel
```

2. **Se connecter**
```bash
vercel login
```

3. **Déployer**
```bash
# Depuis la racine du projet
vercel --prod
```

4. **Configuration automatique** - Vercel détecte Angular automatiquement

### Option 4 : GitHub Pages

1. **Installer angular-cli-ghpages**
```bash
npm install -g angular-cli-ghpages
```

2. **Compiler avec la base URL**
```bash
ng build --configuration production --base-href /document-generator/
```

3. **Déployer**
```bash
npx angular-cli-ghpages --dir=dist/document-generator/browser
```

### Option 5 : Serveur Apache/Nginx

#### Apache

1. **Compiler l'application**
```bash
npm run build:prod
```

2. **Copier les fichiers**
```bash
# Copier tout le contenu de dist/document-generator/browser vers votre dossier web
cp -r dist/document-generator/browser/* /var/www/html/
```

3. **Configuration .htaccess** (créer dans le dossier web)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

1. **Compiler l'application**
```bash
npm run build:prod
```

2. **Configuration Nginx**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/document-generator;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **Copier les fichiers**
```bash
cp -r dist/document-generator/browser/* /var/www/document-generator/
```

4. **Redémarrer Nginx**
```bash
sudo systemctl restart nginx
```

## 🔒 Déploiement Sécurisé (HTTPS)

### Avec Let's Encrypt (Gratuit)

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Le certificat se renouvelle automatiquement
```

## 📱 Déploiement sur un Serveur Windows (IIS)

1. **Installer IIS** via le Panneau de configuration

2. **Compiler l'application**
```powershell
npm run build:prod
```

3. **Créer un nouveau site dans IIS**
   - Chemin physique : `C:\inetpub\wwwroot\document-generator`
   - Port : 80 ou votre choix

4. **Copier les fichiers**
```powershell
Copy-Item -Path "dist\document-generator\browser\*" -Destination "C:\inetpub\wwwroot\document-generator" -Recurse
```

5. **Configuration web.config**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## 🎯 Optimisations de Production

### Réduire la Taille du Build

Dans `angular.json`, assurez-vous que ces options sont activées :

```json
"optimization": true,
"outputHashing": "all",
"sourceMap": false,
"namedChunks": false,
"extractLicenses": true,
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "2mb",
    "maximumError": "5mb"
  }
]
```

### Configuration du Cache

Ajoutez des en-têtes de cache pour les ressources statiques :

```nginx
# Nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🧪 Test de Production en Local

Avant de déployer, testez en local :

```bash
# Compiler
npm run build:prod

# Servir avec http-server
cd dist/document-generator/browser
http-server -p 8080

# Ou avec serve
npx serve dist/document-generator/browser
```

## 📊 Monitoring et Analytics

### Ajouter Google Analytics (Optionnel)

Dans `src/index.html`, ajoutez avant `</head>` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXX-X');
</script>
```

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Tester l'application en local
- [ ] Compiler avec `npm run build:prod`
- [ ] Vérifier que toutes les images sont présentes
- [ ] Tester la génération de PDF
- [ ] Vérifier sur différents navigateurs
- [ ] Tester sur mobile
- [ ] Configurer HTTPS
- [ ] Configurer le cache
- [ ] Ajouter des sauvegardes régulières

## 🆘 Dépannage

### Le site ne s'affiche pas
- Vérifiez les permissions des fichiers
- Vérifiez les logs du serveur web
- Vérifiez que le port est ouvert

### Les images ne s'affichent pas
- Vérifiez que le dossier `assets/images/` a été copié
- Vérifiez les chemins dans le code
- Vérifiez les permissions des fichiers

### Erreur 404 lors du rafraîchissement
- Configurez la réécriture d'URL (voir configurations ci-dessus)
- Vérifiez la configuration du serveur web

## 📞 Support

Pour toute question sur le déploiement :
- Email : liberteiyac@gmail.com

---

**Bon déploiement ! 🚀**

