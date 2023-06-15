import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../../helpers';
import { first } from 'rxjs/operators';
import { UserService, AlertService } from '../../services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  // getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // Sucess
    const data = {
      username: this.f.username.value,
      password: this.f.password.value,
      email: this.f.email.value,
      firstname: this.f.firstname.value,
      lastname: this.f.lastname.value
    };

    this.loading = true;
    this.userService
      .register(data)
      .pipe(first())
      .subscribe(
        (response) => {
          this.alertService.success('Inscription réussie', true);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
          console.log(error);
        }
      );
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
