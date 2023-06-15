import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/user.model';

const baseURL = 'http://localhost:3000/api/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${baseURL}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${baseURL}/register`, data);
  }
}
