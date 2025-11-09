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

  // Capturer le document en haute qualité
  private async captureDocument(): Promise<HTMLCanvasElement> {
    const element = this.documentPreview.nativeElement;
    
    return await html2canvas(element, {
      scale: 4, // Très haute résolution
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      removeContainer: true,
      scrollY: 0,
      scrollX: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
  }

  // Générer et télécharger une image PNG
  async generateImage() {
    this.isGenerating.set(true);
    
    try {
      const canvas = await this.captureDocument();
      
      // Convertir en image PNG de haute qualité
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = `Communique_Officiel_N${this.documentData().communiqueNumber.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.png`;
          
          link.href = url;
          link.download = fileName;
          link.click();
          
          URL.revokeObjectURL(url);
        }
        this.isGenerating.set(false);
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error);
      alert('Une erreur est survenue lors de la génération de l\'image. Veuillez réessayer.');
      this.isGenerating.set(false);
    }
  }

  // Générer et télécharger le PDF
  async generatePDF() {
    this.isGenerating.set(true);
    
    try {
      const canvas = await this.captureDocument();
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // Créer le PDF avec format A4
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
      
      pdf.addImage(imgData, 'JPEG', 0, yPosition, finalWidth, finalHeight, undefined, 'FAST');
      
      // Télécharger le PDF avec un nom descriptif
      const fileName = `Communique_Officiel_N${this.documentData().communiqueNumber.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  // Basculer l'affichage de la prévisualisation
  togglePreview() {
    this.showPreview.update(value => !value);
  }
}
