import { Component, OnInit, ViewEncapsulation, Injector, AfterViewInit } from '@angular/core';
//import { MatDialog } from '@angular/material';
import { ModalService } from '../services/modal.service';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AngularFileUploaderComponent } from "angular-file-uploader";
import { FileCustPickerComponent } from '../file-cust-picker/file-cust-picker/file-cust-picker.component';

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.css']
})
export class FileuploaderComponent implements OnInit, AfterViewInit {

  @Input() config: any;
  afuConfig: any;

  //  afuConfig = {
  //   multiple: true,
  //   formatsAllowed: ".jpg,.png",
  //   maxSize: "1",
  //   uploadAPI: {
  //     url: "https://example-file-upload-api",
  //     headers: {
  //       "Content-Type": "text/plain;charset=UTF-8"
  //     }
  //   },
  //   theme: "dragNDrop",
  //   hideProgressBar: true,
  //   hideResetBtn: false,
  //   hideSelectBtn: false,
  //   attachPinText: "select files"
  // };

  constructor(private modalService: ModalService, private http: HttpClient, private injector: Injector) {
    // this.afuConfig = {
    //   multiple: true,
    //   formatsAllowed: ".jpg,.png",
    //   maxSize: "1",
    //   uploadAPI: {
    //     url: "https://example-file-upload-api",
    //     headers: {
    //       "Content-Type": "text/plain;charset=UTF-8"
    //     }
    //   },
    //   theme: "dragNDrop",
    //   hideProgressBar: true,
    //   hideResetBtn: false,
    //   hideSelectBtn: false,
    //   attachPinText: "select files"
    // };
    //let injector = this.injector;
    console.log("on intit component");
  }

  ngOnInit() {
    // const injector = this.injector;
    // const fileuploader = createCustomElement(AngularFileUploaderComponent, { injector });
    // customElements.define('angular-file-uploader', fileuploader);
    if (this.config != undefined) {
      let configObj = JSON.parse(this.config);
      this.afuConfig = configObj;
    }
    // console.log("Passed Configuration "+configObj.maxSize);
  }

  ngAfterViewInit() {
    // const fileuploader = createCustomElement(AngularFileUploaderComponent, { injector : this.injector });
    // customElements.define('angular-file-uploader', fileuploader);
  }

  public btnLable = 'Upload this file';
  public selectedFile: File;
  public uploadBtn: Boolean;

  onFileSelect(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile.name);
    this.uploadBtn = true;
  }

  onFileUpload(event) {
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    console.log(uploadData);
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
