import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>) { }
  freshnessList = ["Brand New", "Second Hand", "Refurbished"]

  actionBtn: string = "Save";

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        console.log(this.productForm.value);
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert("Product added successfully")
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            alert("Some Error Occured While Adding the Product")
          }
        })
      }
    }
    else {
      this.updateProduct()
    }
  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert("Product updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
        console.log(res)

      },
      error: () => {
        alert("Some Error Occured While Updating the Product")
      }
    })
  }


  productForm !: FormGroup;

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: [''],
      file: [''],
      date: ['', Validators.required],
    })

    // console.log(this.editData);
    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['file'].setValue(this.editData.file);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  // imageUrl: string = "../assets/img/img1.png"

  //   onSelectedFile(event){
  // if(event.target.files.length > 0){
  //   const file = event.target.files[0];
  //   this.productForm.get('image').setValue(file);
  // }
  //}

  url = "C:\Users\admin\Desktop\Angular\Angular CRUD\src\assets\img\img1.png";


  onSelectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    }
  }


}
