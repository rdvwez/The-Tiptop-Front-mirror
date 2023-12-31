import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AllTickets } from 'src/app/models/all-ticket.model';
import { AdminService } from 'src/app/services/admin/admin.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.scss']
})
export class DetailTicketComponent implements OnInit {
  title= 'Détails tickets - Dashboard | Thé Tiptop | Jeu concours';

  public numTicket!: string;
  public dataTicket!: any;


  // Utilisation d'ActiveRoute pour récupérer le paramètre (ici on récupère le paramètre en fonction de sa clé)
  constructor(private route: ActivatedRoute, private adminService: AdminService, private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.addTag();
  }

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
  }


  ngOnInit() {
    const ticketId = this.route.snapshot.paramMap.get('id');

    if (ticketId !== null) {
      this.numTicket = ticketId;
      // Faites quelque chose avec this.numTicket
    }

    console.log(this.numTicket);

    this.adminService.getTicketDetails(this.numTicket).subscribe(
      (response: any) => {
        const { id, numTicket, montantAchat, dateAchat, statusGain, user, batch } = response.data.ticket;
        
        console.log(response);
        
        if (id !== null) {
          this.dataTicket = {
            id,
            numTicket,
            montantAchat,
            dateAchat,
            statusGain,
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              address: user.address
            },
            batch: {
              id: batch.id,
              type_lot: batch.type_lot,
              valeur: batch.valeur,
              description: batch.description
            }
          };
  
          console.log(this.dataTicket);
        }
      },
      error => {
        console.error('Error ticket :', error);
      }
    )

    console.log(this.dataTicket); // return undefined

  }


  pathTicket() {
    console.log(this.dataTicket.id); // return undefined
    const ticketAttribue = {
      statusGain: "assigned",
      gainAttribue: true
    };

    // Appel de la méthode de mise à jour partielle
    this.adminService.patchTicketStatus(this.dataTicket.id, ticketAttribue).subscribe(
      (response) => {
        console.log('Ticket mis à jour avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du ticket', error);
      }
    );
  }

}
