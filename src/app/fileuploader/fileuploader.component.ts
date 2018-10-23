import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//import { MatDialog } from '@angular/material';
import { ModalService } from '../services/modal.service';
import { HttpClient } from '@angular/common/http';

import '../css/modal.less'

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.css']
})
export class FileuploaderComponent implements OnInit {

  constructor(private modalService: ModalService, private http: HttpClient) {
    console.log("loaded");
  }

  ngOnInit() {
  }

  public btnLable = 'Upload this file';
  public selectedFile: File;

  onFileSelect(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
  }

  onFileUpload(event) {
    console.log(event);
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post('', uploadData)
      .subscribe();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
