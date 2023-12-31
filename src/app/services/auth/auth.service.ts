import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response';
import { jwtDecode } from "jwt-decode";
import { CookieService, SameSite } from 'ngx-cookie-service'; // Importez CookieService
import { tap } from 'rxjs';

interface JwtPayload { // Utilisation d'une interface Payload pour indiquer les informations qui seront stockés
  id?: string;
  email?: string;
  role?: string;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiUrl = 'https://api.dsp-archiwebo22b-ji-rw-ah.fr';
  // On ajout les options cookies pour sécuriser notre utilisation des cookies
  private cookieOptions = {
    expires: 1, // Fais que le cookie expire au bout de 1 jour
    secure: true, // Assurez-vous que le cookie est envoyé uniquement sur HTTPS
    httpOnly: true, // Rend le cookie inaccessible au JavaScript côté client
    sameSite: 'Strict' as const  // Limite l'envoi du cookie aux requêtes same-site
  };

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private route: ActivatedRoute) {
    // Vérifiez si un token est déjà présent lors de l'initialisation du service
    const token = this.getToken();
    //console.log('Token actuel dans le constructeur:', token);
    const isAuthenticatedValue = token !== null;
    //console.log('Valeur de isAuthenticated.next:', isAuthenticatedValue);
    this.isAuthenticated.next(isAuthenticatedValue);
  }



  setToken(token: string) {
    this.cookieService.set('token', token, this.cookieOptions); // enregistrez le jeton dans cookieService
    this.isAuthenticated.next(true); // Émet un signal que l'utilisateur est maintenant authentifié
  }

  getToken(): string | null {
    const token = this.cookieService.get('token');
    return token ? token : null; // Renvoie null si le token est une chaîne vide ou undefined
  }

    handleAuthentication(): void {
    this.route.queryParams.subscribe(params => {
      const jwt = params['jwt'];
      if (jwt) {
        // Stockez le JWT de manière appropriée
        
        const tokenDecoded = jwtDecode<JwtPayload>(jwt);
          const roleUser = tokenDecoded.role as string;
          const roleId = tokenDecoded.id as string;
          this.setToken(jwt);
          this.setRoleUser(roleUser);
          this.setIdUser(roleId);
        // Redirigez l'utilisateur vers une page protégée ou la page d'accueil
        this.router.navigate(['/concours']);
      }
    });
  }

  // Vérifie si l'user est vérifié ou pas
  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<{ user: { isVerify: boolean }}>(url) // On récupère isVerify qui est un objet d'user dans la réponse API
      .pipe(
        map(response => response.user.isVerify),
        catchError(error => {
          console.error('Une erreur s\'est produite lors de la récupération des données de lutilisateur:', error);
          return throwError(error);
        })
      );
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  // Appelé lors de la connexion pour stocker le rôle dans depuis les cookies
  setRoleUser(userRole: string) {
    this.cookieService.set('userRole', userRole, this.cookieOptions); // Stocke le rôle dans le cookieService
  }

  // Méthode pour récupérer le rôle de l'utilisateur connecté depuis les cookies
  getRoleUser(): string | null {
    return this.cookieService.get('userRole'); 
  }

  // Appelé lors de la connexion pour stocker l'id du user dans les cookies
  setIdUser(userId: string) {
    this.cookieService.set('userId', userId, this.cookieOptions); 
  }

  // Méthode pour récupérer l'id de l'utilisateur connecté dans les cookies
  getIdUser(): string | null {
    return this.cookieService.get('userId'); 
  }

  logout() {
    this.cookieService.delete('token');
    this.cookieService.delete('userRole');
    this.cookieService.delete('userId');
    this.isAuthenticated.next(false); // Émet un signal que l'utilisateur n'est plus authentifié
    this.router.navigate(['']);
  }

  login({ email, password }: any): Observable<any> {
    const credentials = { email, password };

    return this.http.post<AuthResponse>(this.apiUrl + '/user/login', credentials).pipe(
      switchMap((response) => {
        if (!response.error) {
          const tokenDecoded = jwtDecode<JwtPayload>(response.jwt);
          const roleUser = tokenDecoded.role as string;
          const roleId = tokenDecoded.id as string;
          this.setToken(response.jwt);
          this.setRoleUser(roleUser);
          this.setIdUser(roleId);

          // Au lieu de naviguer ici, retournez un nouvel Observable qui décide où naviguer.
          return of(roleUser); // Ici, 'of' est utilisé pour transformer la valeur en Observable.
        } else {
          return throwError(() => new Error(response.message[0]));
        }
      }),
      map(roleUser => {
        if (roleUser === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (roleUser === 'employee') {
          this.router.navigate(['/admin/dashboard']);
        } else if (roleUser === 'customer') {
          this.router.navigate(['/concours']);
        } else {

        }
        return roleUser; // Vous pouvez toujours renvoyer le rôle si nécessaire pour la suite du traitement.
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  //Methode pour l'inscription
  signup({ firstname, lastname, phone, email, password, address, birthDate, newsletter , role }: any): Observable<any> {
    return this.http.post(this.apiUrl + '/user', {
      firstname,
      lastname,
      address,
      birthDate,
      phone,
      email,
      password,
      newsletter,
      role
    }).pipe(
      catchError((error) => {
        // if (error.status === 409) {
        //   // Gérez l'erreur spécifique ici, par exemple en informant l'utilisateur
        //   alert('Un conflit est survenu : ' + error.error.message);
        // }
        // Vous pouvez aussi retransmettre l'erreur si vous voulez la gérer ailleurs
        return throwError(() => new Error('Une erreur est survenue lors de l\'inscription : ' + error.error.message));
      })
    );
  }

  redirectToGoogleAuth(): void {
    window.location.href = this.apiUrl + '/user/auth/google';
  }

}
