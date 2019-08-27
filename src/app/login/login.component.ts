import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() {
    let username: String = '';
    let password: String = '';
   }

  ngOnInit() {
  }
  validateLogin(){
    console.log('Input element : ', this.username )
  }

}
