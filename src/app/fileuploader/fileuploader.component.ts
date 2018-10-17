import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//import { MatDialog } from '@angular/material';
import { ModalService } from '../services/modal.service';

import '../css/modal.less'

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.css']
})
export class FileuploaderComponent implements OnInit {

  public bodyText: string;

  constructor(private modalService: ModalService) {
    console.log("loaded");
  }

  ngOnInit() {
    this.bodyText = 'This text can be updated in modal 1';
  }

  public btnLable = 'Upload new file';

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
