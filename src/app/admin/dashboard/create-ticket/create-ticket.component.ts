import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { UserService } from 'src/app/services/user/user.service';
import { BatchesService } from 'src/app/services/batches/batches.service';
import { UserCustomerShortcut } from 'src/app/models/user-customer-shortcut.model';
import { ShortcutedBatch } from 'src/app/models/batch-shortcut.model';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})

export class CreateTicketComponent implements OnInit {
  ticketForm!: FormGroup; 
  ticket: any = {}; // Créez une structure de données pour stocker les détails du ticket
  users: UserCustomerShortcut[] = []; // Créez une structure de données pour stocker les utilisateurs
  batches: ShortcutedBatch[] = []; // Créez une structure de données pour stocker les lots

  constructor(private ticketService: TicketService, 
              private userService: UserService,
              private batchService: BatchesService,
              private formBuilder: FormBuilder,) { }

  ngOnInit() {

    this.ticketForm = this.formBuilder.group({
      montantTicket: [null, [Validators.required, Validators.min(0)]],
      userId: [null, Validators.required],
      batchId: [null, Validators.required]
    });
    this.loadInitialData();
  }

  loadInitialData() {
    this.userService.getShortcutCustomerDetails().subscribe(
      (users: UserCustomerShortcut[]) => {
        this.users = users;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        // Gérez l'erreur selon vos besoins
      }
    );

    this.batchService.getShortcutedBatchs().subscribe(
      (batshs: ShortcutedBatch[]) => {
        this.batches = batshs;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        // Gérez l'erreur selon vos besoins
      }
    );

  }

  onSubmit() {
    if (this.ticketForm.valid) {
      // Si le formulaire est valide, effectuez le traitement
      const ticketData = this.ticketForm.value;
      this.ticketService.createTicket(ticketData).subscribe(
        (response) => {
          console.log('Ticket créé avec succès:', response);
        },
        (error) => {
          console.error('Erreur lors de la création du ticket:', error);
        }
      );
    } else {
      // Si le formulaire n'est pas valide, affichez un message ou effectuez d'autres actions nécessaires.
      console.log('Le formulaire n\'est pas valide');
    }
  }
}
