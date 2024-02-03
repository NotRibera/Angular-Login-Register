import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../interfaces/IUser';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../userservice/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient,private userService:UserService) { }

  registerUser(userDetails: IUser):Observable<IUser> {
    return this.userService.registerUser(userDetails)

  }

  getUserByEmail(email: string): Observable<IUser> {
     return this.userService.getUserByEmail(email);
  }


}
