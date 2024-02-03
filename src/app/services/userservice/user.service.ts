import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IUser } from 'src/app/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  Users: IUser[];
  constructor() {
    this.Users =[{
      id: '1',
      fullName: 'Saurabh',
      email: 'abc@g.com',
      password: 'abc'
    }]
  }

  getUserByEmail(email:string):Observable<IUser>{
    const userObserv=new Observable<IUser>((sub)=>{
      let u=this.Users.filter(u=>u.email==email);
      if(u.length==0){
        sub.error("No User Found");
      }
      sub.next(u[0])
      sub.complete()
    })
    return userObserv
  }

  registerUser(user:IUser):Observable<IUser>{

      const userObserv=new Observable<IUser>(
        (sub)=>{
          let u=this.Users.filter(u=>u.email==user.email);
          if(u.length>0){
            sub.error("User already exists");
          }
          this.Users.push(user)
          sub.next(user)
          sub.complete()
        }
      )
      return userObserv;

  }

  modifyUser(user:IUser,email:string):Observable<IUser>{
    const indexId=this.Users.findIndex(u=>u.email==email)
    const userObserv=new Observable<IUser>(
      (sub)=>{
        if (user.fullName===null){
          sub.error("FullName cant be null")
        }
        if(user.email===null){
          sub.error("Email cant be null")
        }
        this.Users[indexId]=user;
        sub.next(user)
        sub.complete()
      }
    )
    return userObserv;
  }



}
