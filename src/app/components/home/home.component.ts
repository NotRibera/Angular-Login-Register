import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from "@angular/forms";

import {AuthService} from "../../services/auth-service/auth.service";
import {MessageService} from "primeng/api";
import {IUser} from "../../interfaces/IUser";
import {UserService} from "../../services/userservice/user.service";
import {tap} from "rxjs";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  modifyForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
  })
  lUserService: UserService;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {
    this.lUserService = userService;
    let email = sessionStorage.getItem('email');
    if (email === null) {
      this.logOut()
    } else {
      const user = userService.getUserByEmail(email)
      user.subscribe((subscription) => {
        this.modifyForm.patchValue({fullName: subscription.fullName})
        this.modifyForm.patchValue({email: subscription.email})
      })

    }

  }

  get fullName() {
    return this.modifyForm.controls['fullName'];
  }

  get email() {
    return this.modifyForm.controls['email'];
  }


  submitDetails() {
    const postData = {...this.modifyForm.value};
    let sessionEmail = sessionStorage.getItem('email');
    if (sessionEmail === null) {
      this.logOut()
    } else {
      this.lUserService.getUserByEmail(sessionEmail).pipe(
        tap(r => {
          let formEmail = this.email.getRawValue();
          let formFullName = this.fullName.getRawValue();
          if (formEmail != null) {
            r.email = formEmail
          }
          if (formFullName != null) {
            r.fullName = formFullName;
          }
          if (sessionEmail!=null){
            this.lUserService.modifyUser(r,sessionEmail).subscribe(
              response => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updation successfull.Please log in agina.' });
                this.router.navigate(['login'])
              },
              error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
              }
            )
          }

        })
      ).subscribe()
    }

  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
