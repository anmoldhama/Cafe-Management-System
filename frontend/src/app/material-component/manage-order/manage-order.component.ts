import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { from } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackerService } from 'src/app/services/snacker.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayedColumns:string[] = ['name','category','price','quantity','total','edit'];
  dataSource:any= [];
  manageOrderForm:any=FormGroup;
  categorys:any=[];
  products:any = [];
  price:any;
  totalAmount:number=0;
  responseMessage:any;


  constructor(private formBuilder:FormBuilder,
    private billService:BillService,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog,
    private snackerService:SnackerService,
    private router:Router,
    private categoryService:CategoryService,
    private productService:ProductService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstant.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      quantity:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[null,[Validators.required]]
    })
  }

  getCategorys(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.ngxService.stop();
      this.categorys = response;
    },(error:any)=>{
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

  getProductsByCategory(value:any){
    
    this.productService.getProductByCategory(value.id).subscribe((response:any)=>{
   
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    },(error:any)=>{
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

  getProductDetails(value:any){
    
    this.productService.getById(value.id).subscribe((response:any)=>{
   
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price*1);
    },(error:any)=>{
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

  setQuantity(value:any){
    var temp = this.manageOrderForm.controls['quantity'].value;
    if(temp > 0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }else if(temp !=''){
    this.manageOrderForm.controls['quantity'].setValue('1');
    this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0){
      return true;
    }
      else{
      return false;
      }
  }

  validateSubmit(){
    if(this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
     this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null || 
     this.manageOrderForm.controls['paymentMethod'].value === null || !(this.manageOrderForm.controls['contactNumber'].valid) || !(this.manageOrderForm.controls['email'].valid))
    return true;

    else
    return false;
  }

  add(){
    
    var formData = this.manageOrderForm.value;
    var productName=this.dataSource.find((e: {id:number; })=> e.id === formData.product.id);
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity:formData.quantity,price:formData.price,total:formData.total});
        this.dataSource = [...this.dataSource];
        this.snackerService.openSnacker(GlobalConstant.productAdded,"success");
    }
    else{
      this.snackerService.openSnacker(GlobalConstant.productExistError,GlobalConstant.error);
    }
  }

  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    debugger;
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data ={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      total: this.totalAmount,
      pruductDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;

    },(error:any)=>{
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
   
  downloadFile(fileName:any){
   var data = {
    uuid:fileName
   }
   this.billService.getPDF(data).subscribe((response:any)=>{
    saveAs(response,fileName+'.pdf');
    this.ngxService.stop();
   })
  }


}
