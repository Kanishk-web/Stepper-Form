import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  postUserData(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/recruitmentForm`, userData);
  }
}
