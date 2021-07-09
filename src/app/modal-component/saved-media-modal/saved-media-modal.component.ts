import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-saved-media-modal',
  templateUrl: './saved-media-modal.component.html',
  styleUrls: ['./saved-media-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SavedMediaModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SavedMediaModalComponent>,
  ) { }

  ngOnInit(): void {
  }

}
