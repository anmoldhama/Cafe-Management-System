import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackerService } from 'src/app/services/snacker.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService: UserService,
    public dialogRef:MatDialogRef<ChangepasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackerService:SnackerService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    }
    else{
      return false;
    }
  }

  handleChangePasswordSubmit(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword:formData.oldPassword,
      newPassword:formData.newPassword,
      confirmPassword:formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackerService.openSnacker(this.responseMessage,"success");
    },(error)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackerService.openSnacker(this.responseMessage,GlobalConstant.error);
    })
  }

}
