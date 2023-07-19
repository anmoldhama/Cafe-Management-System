import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackerService } from '../services/snacker.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,private router:Router,
    private userService:UserService,
    private snackerService:SnackerService,
    private dialogRef:MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      password:[null,Validators.required]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token',response.token);
      this.router.navigate(['/cafe/dashboard']);
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackerService.openSnacker(this.responseMessage,GlobalConstant.error)
    })
  }

}
