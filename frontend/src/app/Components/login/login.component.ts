import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../../services';
import { AlertService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Display form values on succes
    this.loading = true;
    const data = {
      //email: this.f.email.value,
      login: this.f.emailOrUsername.value,
      password: this.f.password.value
    };
    this.userService
      .login(data)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log(response);
          this.submitted = true;
          this.router.navigate(['/myaccount']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
