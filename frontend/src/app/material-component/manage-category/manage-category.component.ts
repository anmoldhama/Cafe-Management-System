import { Component, OnInit } from '@angular/core';
import { SanityChecks } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackerService } from 'src/app/services/snacker.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumn:string[] = ['name','edit'];
  dataSource:any;
  responseMessage:any;


  constructor(private categoryService:CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog,
    private snackerService:SnackerService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
   tableData(){
    this.categoryService.getCategory().subscribe((response:any)=>{
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
   handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
   }

   handleEditAction(values:any){
   
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response)=>{
      this.tableData(); 
    })
   }
}
