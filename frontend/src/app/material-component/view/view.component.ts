import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackerService } from 'src/app/services/snacker.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  displayedColumns:string[] = ['name','email','contactNumber','paymentMethod','total','view'];
  dataSource:any= [];
  // manageOrderForm:any=FormGroup;

  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private billService:BillService,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog,
    private snackerService:SnackerService,
    private router:Router,
    private categoryService:CategoryService,
    private productService:ProductService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
    tableData(){
      this.billService.getBills().subscribe((response:any)=>{
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
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

    applyFilter(event:Event){
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    handleViewAction(values:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data ={
        data:values
      };
      dialogConfig.width = "100%";
      const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
    }
    downloadReportAction(values:any){
      this.ngxService.start();
      var data ={
        name:values.name,
        email:values.email,
        uuid:values.uuid,
        contactNumber:values.contactNumber,
        paymentMethod:values.paymentMethod,
        total:values.total,
        pruductDetails:values.pruductDetails
      }
      this.billService.getPDF(data).subscribe((response)=>{
        saveAs(response,values.uuid+'.pdf');
        this.ngxService.stop();
      })
    }
    handleDeleteAction(values:any){
         const dialogConfig = new MatDialogConfig();
         dialogConfig.data ={
          message: 'delete' +values.name+'bill'
         };
         const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
         const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
              this.ngxService.start();
              this.deleteProduct(values.id);
              dialogRef.close();
         })
    }

    deleteProduct(id:any){
     this.billService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackerService.openSnacker(this.responseMessage,"success");
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
}
