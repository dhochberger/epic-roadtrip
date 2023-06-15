import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { RequestOptions } from '@angular/http';
import { environment } from 'src/environments/environment';

const baseURL = environment.apiUrl + '/users';
//Si tu veut l'api en ligne décommente ça sinon c'est en localhost de base
//const baseURL = 'https://api-epic-road-trip.herokuapp.com/api/v1/ursers';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getAll() {
    return this.http.get<User[]>(`${baseURL}`);
  }

  login(data: any) {
    return this.http.post<any>(`${baseURL}/login`, data).pipe(
      map((user) => {
        //login successful if there's a jwt token in the reponse
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.data));
          localStorage.setItem('isLogged', 'true');
          this.currentUserSubject.next(user.data);
        }
        return user;
      })
    );
  }

  register(data: any) {
    return this.http.post(`${baseURL}/register`, data);
  }

  delete(data: any) {
    return this.http.delete(`${baseURL}/me`, data);
  }

  logout() {
    //remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLogged');
    this.currentUserSubject.next(null);
  }
}
