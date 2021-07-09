import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction } from '@app/model/transaction';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TransactionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
  ) { }

  ngOnInit(): void {
  }

}
