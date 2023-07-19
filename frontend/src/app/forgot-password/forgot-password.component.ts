import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackerService } from '../services/snacker.service';
import { SignupComponent } from '../signup/signup.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,private router:Router,
    private userService:UserService,
    private snackerService:SnackerService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]]
    })
  }

  handleSubmit(){
    debugger;
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }
    this.userService.forgotPassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage= response?.message;
      this.dialogRef.close();
      this.snackerService.openSnacker(this.responseMessage,"");
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage =GlobalConstant.genericError;
      }
      this.snackerService.openSnacker(this.responseMessage,GlobalConstant.error);
    })
    
  }

}
