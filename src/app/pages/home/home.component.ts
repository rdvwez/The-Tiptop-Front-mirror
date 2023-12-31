import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title= 'Accueil | Thé Tiptop | Jeu concours';

  constructor(private titleService : Title, private metaService: Meta){
    this.titleService.setTitle(this.title);
    this.addTag();
  }

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "Thé Tiptop, site de jeu concours de thé pour les 10 ans et l'ouverture de la boutique à Nice" }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ name: 'keywords', content: 'jeu concours Nice' }); //Add keyword
    this.metaService.addTag({ property: 'og:title', content: "Thé Tiptop | Jeu concours" }) // Titre pour l'encadré dans les recherches
  }

  images: string[] = [
    '/assets/images/home/logo-1-thetiptop.png',
    '/assets/images/home/logo-2-thetiptop.png',
    '/assets/images/home/logo-3-thetiptop.png',
    '/assets/images/home/logo-4-thetiptop.png',
    '/assets/images/home/logo-5-thetiptop.png'
  ];
}
