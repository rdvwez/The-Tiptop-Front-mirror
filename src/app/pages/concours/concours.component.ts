import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { GainsDetailleComponent } from './gains-detaille/gains-detaille.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-concours',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, GainsDetailleComponent],
  templateUrl: './concours.component.html',
  styleUrls: ['./concours.component.scss']
})
export class ConcoursComponent {
  title= 'Thé Tiptop | Jeu concours';

  constructor(private titleService : Title, private metaService: Meta){
    this.titleService.setTitle(this.title);
    this.addTag();
  }

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "Thé Tiptop, participez au jeu concours de thé pour les 10 ans et l'ouverture de la boutique à Nice" }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ name: 'keywords', content: 'jeu concours Nice' }); //Add keyword
    this.metaService.addTag({ property: 'og:title', content: "Thé Tiptop | Jeu concours" }) // Titre pour l'encadré dans les recherches
  }

  // enableHorizontalScroll = false;

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   // Détectez le défilement vertical ici
  //   const scrollTop = window.scrollY;    
  //   console.log(scrollTop);
    
    
  //   // Utilisez une ancre HTML pour déterminer quand activer le défilement horizontal
  //   const anchorElement = document.getElementById('horizontal-scroll-anchor');
    
  //   if (anchorElement) {
  //     const anchorRect = anchorElement.getBoundingClientRect();
  //     const anchorOffsetTop = anchorRect.top + scrollTop;
  //     console.log(anchorRect.top);
  //     console.log(anchorOffsetTop);
      
  //     this.enableHorizontalScroll = scrollTop >= anchorOffsetTop;
  //   }
  // }
  
}
