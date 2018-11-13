import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


// declare let uuid = require('uuid/v1');

@Component({
  selector: 'app-file-cust-picker',
  templateUrl: './file-cust-picker.component.html',
  styleUrls: ['./file-cust-picker.component.css']
})
export class FileCustPickerComponent implements OnInit {


  @Input() config: any;
  @Input() resetUpload;
  @Input() previewWidth: Number = 50;
  @Output() ApiResponse = new EventEmitter<any>();
  public idDate: Number;
  public reg: any;
  public notAllowedList: any[];
  public Caption = [];
  public uploadBtn: Boolean;
  public uploadMsg: Boolean;
  public afterUpload: Boolean;
  public uploadClick: Boolean;
  public selectedFiles = [];
  public multiple: Boolean;
  public formatsAllowed: String;
  public maxSize: any;
  public theme: String;
  // refactor id
  id;
  public uploadMsgClass = '';
  public uploadMsgText: String;
  public uploadAPI: any;
  public headers: any;
  public uploadBtnText = 'upload';
  public showNameInput: Boolean;
  public showUpload: Boolean;
  public showUploadStatus: Boolean;
  public showSearch: Boolean;

  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    // console.log(this.uuidv1());
  }

  ngOnInit() {
    this.resetUpload = false;
    this.ApiResponse = new EventEmitter();
    this.idDate = +new Date();
    this.reg = /(?:\.([^.]+))?$/;
    // this.selectedFiles = [];
    this.notAllowedList = [];
    this.Caption = [];
    this.uploadBtn = false;
    this.uploadMsg = false;
    this.afterUpload = false;
    this.uploadClick = true;
    this.formatsAllowed = this.config.formatsAllowed;
    this.maxSize = this.config.maxSize;
    this.multiple = this.config.multiple;
    this.theme = this.config.theme;
    this.uploadAPI = this.config.uploadAPI;
    this.headers = this.config.uploadAPI.headers;
    console.log('config: ', this.config);
    this.findTheme();
  }

  findTheme() {
    const theme = this.config.theme && this.config.theme.toLowerCase() || 'uploadtheme';
    if (theme === 'uploadtheme') {
      this.showUpload = true;
    } else if (theme === 'searchtheme') {
      this.showSearch = true;
    } else if (theme === 'both') {
      this.showUpload = true;
      this.showSearch = true;
    }
  }

  onChange(event) {

    if (this.afterUpload || !this.multiple) {
      this.selectedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }

    let files;
    if (event.type === 'drop') {
      files = event.dataTransfer.files;
    } else {
      files = event.target.files || event.srcElement.files;
    }

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      const frmtAllowed = this.checkFileFormat(currentFile);
      // As we can't change the name of already created file, creating a new property fileName
      if (currentFile.name) {
        currentFile.fileName = currentFile.name;
      }
      if (frmtAllowed) {
        const sizeAllowed = this.checkFileSize(currentFile);
        if (sizeAllowed) {
          const duplicate = this.checkDuplicate(currentFile);
          if (!duplicate) {
            if (this.isImage(currentFile)) {
              currentFile.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(currentFile));
            }
            this.selectedFiles.push(currentFile);
            console.log('file got added to selected files' + this.selectedFiles);
          } else {
            if (this.isImage(currentFile)) {
              currentFile.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(currentFile));
            }
            this.addTONotAllowedList(currentFile, 'Duplicate File', true);
          }
        } else {
          this.addTONotAllowedList(currentFile, 'Invalid Size', false);
        }
      } else {
        this.addTONotAllowedList(currentFile, 'Invalid Format', false);
      }
    }
    if (this.selectedFiles.length !== 0) {
      this.uploadBtn = true;
    } else {
      this.uploadBtn = false;
    }
    this.uploadMsg = false;
    this.uploadClick = true;
    event.target.value = null;
    this.manuallyDetectChanges();
  }

  // Add file to the not allowed list if it fails any of the validations with respective error message
  addTONotAllowedList(file, errorMsg, showEditNSave) {
    const currentFile = file;
    currentFile.fileName = currentFile.name;
    currentFile.fileSize = this.convertSize(currentFile.size);
    currentFile.errorMsg = errorMsg;
    currentFile.showEditNSave = showEditNSave;
    this.notAllowedList.push(currentFile);
    console.log('file got added to notAllowedList files' + this.notAllowedList);
  }
  // Duplicate file name check
  checkDuplicate(currFile) {
    return this.selectedFiles.find(file => file.fileName.trim().toLowerCase() === currFile.fileName.trim().toLowerCase()) !== undefined;
  }
  // check format
  checkFileFormat(currFile) {
    let ext;
    const formats = this.formatsAllowed.match(new RegExp('\\.', 'g'));
    const formatsCount = formats.length;
    let currentFileExt = this.reg.exec(currFile.name);
    currentFileExt = currentFileExt[1];
    let frmtAllowed = false;
    for (let j = formatsCount; j > 0; j--) {
      ext = this.formatsAllowed.split('.')[j];
      if (j === formatsCount) {
        ext = this.formatsAllowed.split('.')[j] + ',';
      }
      if (currentFileExt.toLowerCase() === ext.split(',')[0]) {
        frmtAllowed = true;
      }
    }
    return frmtAllowed;
  }
  // check file size
  checkFileSize(currFile) {
    return currFile.size < this.maxSize * 1024000;
  }
  resetFileUpload() {
    this.selectedFiles = [];
    this.Caption = [];
    this.notAllowedList = [];
    this.uploadMsg = false;
    this.uploadBtn = false;
    this.showUploadStatus = false;
    this.manuallyDetectChanges();
  }

  convertSize(fileSize) {
    // console.log(fileSize + ' - '+ str);
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }

  drop(event) {
    event.stopPropagation();
    event.preventDefault();
    this.onChange(event);
  }

  allowDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }


  uploadFiles() {

    let i;
    this.uploadClick = false;
    this.notAllowedList = [];

    let isError = false;

    const xhr = new XMLHttpRequest();

    const formData = new FormData();
    console.log(this.selectedFiles[i]);
    for (i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] === undefined) {
        this.Caption[i] = 'file' + i;
      }
      // Add DATA TO BE SENT
      // formData.append(this.Caption[i], this.selectedFiles[i], this.selectedFiles[i].fileName);
      console.log(this.selectedFiles[i]);
      formData.append('files', this.selectedFiles[i]);
    }
    xhr.onreadystatechange = evnt => {
      // console.log('onready');
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          isError = true;
          this.uploadBtn = false;
          this.uploadMsg = true;
          this.afterUpload = true;
          this.uploadMsgText = 'Upload Failed !';
          this.uploadMsgClass = 'text-danger lead';
          this.showUploadStatus = true;
          // console.log(this.uploadMsgText);
          // console.log(evnt);
        }
        this.ApiResponse.emit(xhr);
      }
      this.manuallyDetectChanges();
    };
    xhr.upload.onprogress = evnt => {
      this.uploadBtn = false; // button should be disabled by process uploading
    };
    xhr.onload = evnt => {
      // console.log('onload');
      // console.log(evnt);
      this.uploadBtn = false;
      this.uploadMsg = true;
      this.afterUpload = true;
      if (!isError) {
        this.uploadMsgText = 'Successfully Uploaded !';
        this.uploadMsgClass = 'text-success lead';
        this.showUploadStatus = true;
        // console.log(this.uploadMsgText + ' ' + this.selectedFiles.length + ' file');
      }
      this.manuallyDetectChanges();
    };
    xhr.onerror = evnt => {
    };
    xhr.open('POST', this.uploadAPI.url);
    // for (const key of Object.keys(this.headers)) {
    // Object.keys will give an Array of keys
    // xhr.setRequestHeader(key, this.headers[key]);
    // }
    // let token = sessionStorage.getItem('token');
    // xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    // xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    console.log(formData);
    xhr.send(formData);
  }

  onRemoveFile(index, listType) {
    console.log(this.selectedFiles[index]);
    if (listType === 'valid') {
      const file = this.selectedFiles[index];
      this.selectedFiles = this.selectedFiles.filter(e => e !== file);
    } else if (listType === 'inValid') {
      const file = this.notAllowedList[index];
      this.notAllowedList = this.notAllowedList.filter(e => e !== file);
    }
    if (this.selectedFiles && this.selectedFiles.length === 0) {
      this.uploadMsg = false;
      this.uploadBtn = false;
    }
    this.manuallyDetectChanges();
    console.log(`after selectedFiles : ${this.selectedFiles}`);
    console.log(`after notAllowedList : ${this.notAllowedList}`);
  }

  onEditFile(index, listType) {
    document.getElementById(index).focus();
    if (listType === 'valid') {
      this.selectedFiles[index].showNameInput = true;
    } else if (listType === 'inValid') {
      this.notAllowedList[index].showNameInput = true;
    }
    this.manuallyDetectChanges();
  }

  saveEditedFile(index, listType) {
    if (listType === 'valid') {
      this.selectedFiles[index].showNameInput = false;
    } else if (listType === 'inValid') {
      this.notAllowedList[index].showNameInput = false;
    }
    this.manuallyDetectChanges();
  }

  showErrorMsg(event, index) {
    const errorMsg = this.notAllowedList[index].errorMsg;
    console.log(`*** ${errorMsg}`);
    event.target.title = errorMsg;
    this.manuallyDetectChanges();
  }

  showNameInputbox(index, listType) {
    if (listType === 'valid') {
      this.selectedFiles[index].showNameInput = true;
    } else if (listType === 'inValid') {
      this.notAllowedList[index].showNameInput = true;
    }
    this.manuallyDetectChanges();
  }

  hideNameInputbox(index, listType) {
    if (listType === 'valid') {
      this.selectedFiles[index].showNameInput = false;
    } else if (listType === 'inValid') {
      this.notAllowedList[index].showNameInput = false;
    }
    this.manuallyDetectChanges();
  }

  changeInputVal(event, index) {
    console.log(event.target.value);
    const newFileName = event.target.value;
    this.selectedFiles[index].fileName = newFileName;
    console.log(this.selectedFiles[index]);
    this.selectedFiles[index].showNameInput = false;
    this.manuallyDetectChanges();
  }

  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }
  /* Zone.js is not able to detect the change in MZNG but works fine in standalone therefore required to manually fire change detection */
  manuallyDetectChanges() {
    this.ref.detectChanges();
  }
}
