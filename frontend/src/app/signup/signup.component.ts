import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackerService } from '../services/snacker.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,private router:Router,
    private userService:UserService,
    private snackerService:SnackerService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstant.contactNumberRegex)]],
      password:[null,[Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackerService.openSnacker(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstant.genericError;

      }
      this.snackerService.openSnacker(this.responseMessage,GlobalConstant.error);
    }
    )
  }

}
