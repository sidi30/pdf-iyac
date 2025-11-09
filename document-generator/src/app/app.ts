import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DocumentData {
  communiqueNumber: string;
  date: string;
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('documentPreview', { static: false }) documentPreview!: ElementRef;

  // Données du document
  documentData = signal<DocumentData>({
    communiqueNumber: '001/2024',
    date: this.getCurrentDate(),
    content: `Objet : Communiqué officiel

Madame, Monsieur,

Nous avons l'honneur de porter à votre connaissance...

[Votre contenu ici]

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`
  });

  isGenerating = signal(false);
  showPreview = signal(true);
  currentYear = new Date().getFullYear();
  customPhotoUrl = signal<string>('/assets/images/iyac.jpg');
  maxCharacters = 2500;

  // Obtenir la date actuelle au format français
  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('fr-FR', options);
  }

  // Obtenir le nombre de caractères et calculer le restant
  getCharacterCount(): string {
    const current = this.documentData().content.length;
    const remaining = this.maxCharacters - current;
    const percentage = (current / this.maxCharacters) * 100;

    if (remaining < 0) {
      return `⚠️ ${Math.abs(remaining)} caractères en trop`;
    } else if (percentage > 90) {
      return `⚠️ ${remaining} caractères restants`;
    } else if (percentage > 75) {
      return `${remaining} caractères restants`;
    }
    return `${current} / ${this.maxCharacters} caractères`;
  }

  // Vérifier si la limite est dépassée
  isOverLimit(): boolean {
    return this.documentData().content.length > this.maxCharacters;
  }

  // Mettre à jour les données du document
  updateCommuniqueNumber(value: string) {
    this.documentData.update(data => ({ ...data, communiqueNumber: value }));
  }

  updateDate(value: string) {
    this.documentData.update(data => ({ ...data, date: value }));
  }

  updateContent(value: string) {
    this.documentData.update(data => ({ ...data, content: value }));
  }

  // Réinitialiser la date à aujourd'hui
  resetDate() {
    this.updateDate(this.getCurrentDate());
  }

  // Gérer l'upload de photo
  onPhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.customPhotoUrl.set(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  // Réinitialiser la photo par défaut
  resetPhoto() {
    this.customPhotoUrl.set('/assets/images/iyac.jpg');
  }

  // Attendre que toutes les images soient chargées
  private async waitForImages(): Promise<void> {
    const element = this.documentPreview.nativeElement;
    const images = element.getElementsByTagName('img');
    const promises: Promise<void>[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.complete) {
        promises.push(
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
        );
      }
    }

    await Promise.all(promises);
    // Attendre un peu plus pour être sûr
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Capturer le document en haute qualité
  private async captureDocument(): Promise<HTMLCanvasElement> {
    const element = this.documentPreview.nativeElement;

    // Scroller en haut de la zone de prévisualisation
    const container = element.closest('.document-preview');
    if (container) {
      container.scrollTop = 0;
    }

    // Trouver la page du document
    const documentPage = element.querySelector('.document-page');
    if (!documentPage) {
      throw new Error('Élément document-page introuvable');
    }

    return await html2canvas(documentPage as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      removeContainer: false,
      scrollY: 0,
      scrollX: 0,
      windowWidth: documentPage.scrollWidth || 794, // 21cm = 794px à 96dpi
      windowHeight: documentPage.scrollHeight || 1123, // 29.7cm = 1123px à 96dpi
      onclone: (clonedDoc: Document) => {
        // Dans le document cloné, corriger les éléments problématiques
        const clonedPage = clonedDoc.querySelector('.document-page') as HTMLElement;
        if (clonedPage) {
          // Forcer les dimensions minimales pour éviter les erreurs
          clonedPage.style.minWidth = '794px';
          clonedPage.style.minHeight = '1123px';

          // Corriger les séparateurs qui ont height: 1px
          const separators = clonedDoc.querySelectorAll('.doc-separator');
          separators.forEach((sep: any) => {
            sep.style.minHeight = '2px';
            sep.style.height = '2px';
          });

          // Simplifier les backgrounds gradients qui peuvent causer des problèmes
          const title = clonedDoc.querySelector('.doc-title') as HTMLElement;
          if (title) {
            title.style.background = 'rgba(102, 126, 234, 0.1)';
          }
        }
      }
    });
  }

  // Générer et télécharger une image PNG
  async generateImage() {
    this.isGenerating.set(true);

    try {
      console.log('Début de la génération d\'image...');

      // Attendre que toutes les images soient chargées
      console.log('Attente du chargement des images...');
      await this.waitForImages();
      console.log('Images chargées');

      console.log('Capture du document...');
      const canvas = await this.captureDocument();
      console.log('Document capturé, dimensions:', canvas.width, 'x', canvas.height);

      // Convertir en image PNG de haute qualité
      console.log('Conversion en PNG...');
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (blob) {
        console.log('PNG généré, taille:', blob.size, 'bytes');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = `Communique_Officiel_N${this.documentData().communiqueNumber.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.png`;

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        console.log('Image téléchargée avec succès');
      } else {
        throw new Error('Impossible de créer le blob PNG');
      }

    } catch (error: any) {
      console.error('Erreur détaillée lors de la génération de l\'image:', error);
      console.error('Stack trace:', error.stack);
      alert(`Erreur lors de la génération de l\'image: ${error.message || error}\n\nVeuillez vérifier la console (F12) pour plus de détails.`);
    } finally {
      this.isGenerating.set(false);
    }
  }

  // Générer et télécharger le PDF
  async generatePDF() {
    this.isGenerating.set(true);

    try {
      console.log('Début de la génération du PDF...');

      // Attendre que toutes les images soient chargées
      console.log('Attente du chargement des images...');
      await this.waitForImages();
      console.log('Images chargées');

      console.log('Capture du document...');
      const canvas = await this.captureDocument();
      console.log('Document capturé, dimensions:', canvas.width, 'x', canvas.height);

      console.log('Conversion en JPEG...');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      console.log('JPEG généré');

      // Créer le PDF avec format A4
      console.log('Création du PDF...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Calculer les dimensions pour remplir la page A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Si l'image est plus haute que A4, l'adapter
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      let yPosition = 0;

      if (imgHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = (canvas.width * pdfHeight) / canvas.height;
        // Centrer horizontalement si nécessaire
        if (finalWidth < pdfWidth) {
          yPosition = 0;
        }
      } else {
        // Centrer verticalement si l'image est plus petite
        yPosition = (pdfHeight - imgHeight) / 2;
      }

      console.log('Ajout de l\'image au PDF...');
      pdf.addImage(imgData, 'JPEG', 0, yPosition, finalWidth, finalHeight, undefined, 'FAST');

      // Télécharger le PDF avec un nom descriptif
      const fileName = `Communique_Officiel_N${this.documentData().communiqueNumber.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Téléchargement du PDF:', fileName);
      pdf.save(fileName);
      console.log('PDF téléchargé avec succès');

    } catch (error: any) {
      console.error('Erreur détaillée lors de la génération du PDF:', error);
      console.error('Stack trace:', error.stack);
      alert(`Erreur lors de la génération du PDF: ${error.message || error}\n\nVeuillez vérifier la console (F12) pour plus de détails.`);
    } finally {
      this.isGenerating.set(false);
    }
  }

  // Basculer l'affichage de la prévisualisation
  togglePreview() {
    this.showPreview.update(value => !value);
  }
}
