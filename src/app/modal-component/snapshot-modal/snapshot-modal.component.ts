import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-snapshot-modal',
  templateUrl: './snapshot-modal.component.html',
  styleUrls: ['./snapshot-modal.component.scss']
})
export class SnapshotModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SnapshotModalComponent>,
  ) { }

  ngOnInit(): void {
  }

}
