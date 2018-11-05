import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-cust-picker',
  templateUrl: './file-cust-picker.component.html',
  styleUrls: ['./file-cust-picker.component.css']
})
export class FileCustPickerComponent implements OnInit {


  @Input() config: any;
  @Input() resetUpload;
  @Input() previewWidth: number = 50;
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
  public percentComplete: Number;
  public theme: String;
  // refactor id
  id;
  public uploadMsgClass = "";
  public uploadMsgText: String;
  public uploadAPI: any;
  public headers: any;
  public uploadBtnText = "upload";
  public showNameInput: Boolean;
  public showUpload: Boolean;
  public showSearch: Boolean;

  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private elementRef: ElementRef) { }

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
    console.log("config: ", this.config);
    this.findTheme();
  }

  findTheme() {
    let theme = this.config.theme && this.config.theme.toLowerCase() || "uploadtheme";
    if (theme === 'uploadtheme')
      this.showUpload = true;
    else
      if (theme === 'searchtheme')
        this.showSearch = true;
      else
        if (theme === 'both') {
          this.showUpload = true;
          this.showSearch = true;
        }
  }

  onChange(event) {

    //this.notAllowedList = [];
    if (this.afterUpload || !this.multiple) {
      this.selectedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }
    //FORMATS ALLOWED LIST
    //console.log("FORMATS ALLOWED LIST= "+this.formatsAllowed);

    let formatsCount;
    formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
    formatsCount = formatsCount.length;

    let files;
    if (event.type == "drop") {
      files = event.dataTransfer.files;
      //console.log("type: drop");
    }
    else {
      files = event.target.files || event.srcElement.files;
      //console.log("type: change");
    }
    //console.log(file);

    let currentFileExt;
    let ext;
    let frmtAllowed;

    for (let i = 0; i < files.length; i++) {

      currentFileExt = this.reg.exec(files[i].name);
      currentFileExt = currentFileExt[1];
      frmtAllowed = false;
      //FORMAT ALLOWED LIST ITERATE
      for (let j = formatsCount; j > 0; j--) {
        ext = this.formatsAllowed.split(".")[j];
        //console.log("FORMAT LIST ("+j+")= "+ext.split(",")[0]);
        if (j == formatsCount) {
          ext = this.formatsAllowed.split(".")[j] + ",";
        } //check format
        if (currentFileExt.toLowerCase() == ext.split(",")[0]) {
          frmtAllowed = true;
        }
      }
      if (frmtAllowed) {
        //console.log("FORMAT ALLOWED");
        //CHECK SIZE
        if (files[i].size > this.maxSize * 1024000) {
          //console.log("SIZE NOT ALLOWED ("+file[i].size+")");
          this.notAllowedList.push({
            fileName: files[i].name,
            fileSize: this.convertSize(files[i].size),
            errorMsg: "Invalid size"
          });
        }
        else {
          //format allowed and size allowed then add file to selectedFile array,  add objectURL before adding
          if (this.isImage(files[i])) {
            files[i].objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
          }
          // As we can't change the name of already created file, creating a new property fileName
          if (files[i].name) {
            files[i].fileName = files[i].name;
          }
          this.selectedFiles.push(files[i]);
          console.log("file got added " + this.selectedFiles);
          console.warn("file got added " + this.selectedFiles);
        }
      }
      else {
        //console.log("FORMAT NOT ALLOWED");
        this.notAllowedList.push({
          fileName: files[i].name,
          fileSize: this.convertSize(files[i].size),
          errorMsg: "Invalid format"
        });
      }
    }
    if (this.selectedFiles.length !== 0) {
      this.uploadBtn = true;
    }
    else {
      this.uploadBtn = false;
    }
    this.uploadMsg = false;
    this.uploadClick = true;
    this.percentComplete = 0;
    event.target.value = null;
    this.manuallyDetectChanges();
  }

  resetFileUpload() {
    this.selectedFiles = [];
    this.Caption = [];
    this.notAllowedList = [];
    this.uploadMsg = false;
    this.uploadBtn = false;
    this.manuallyDetectChanges();
  }

  convertSize(fileSize) {
    //console.log(fileSize + " - "+ str);
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + " KB"
      : (fileSize / 1024000).toFixed(2) + " MB";
  }

  removeFile(i, sf_na) {
    //console.log("remove file clicked " + i)
    if (sf_na == "sf") {
      this.selectedFiles.splice(i, 1);
      this.Caption.splice(i, 1);
    }
    else {
      this.notAllowedList.splice(i, 1);
    }
    if (this.selectedFiles.length == 0) {
      this.uploadBtn = false;
    }
  }

  attachpinOnclick() {
    //console.log("ID: ", this.id);
    (/** @type {?} */ (document.getElementById("sel" + this.id))).click();
    //$("#"+"sel"+this.id).click();
  }

  drop(event) {
    event.stopPropagation();
    event.preventDefault();
    //console.log("drop: ", event);
    //console.log("drop: ", event.dataTransfer.files);
    this.onChange(event);
  }

  allowDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    //console.log("allowDrop: ",event)
  }


  uploadFiles() {
    //console.log(this.selectedFiles);
    //console.log(this.selectedFiles);

    let i;
    this.uploadClick = false;
    this.notAllowedList = [];

    let isError = false;

    let xhr = new XMLHttpRequest();

    let formData = new FormData();
    console.log("Selected files ");
    console.log(this.selectedFiles[i]);
    for (i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] == undefined)
        this.Caption[i] = "file" + i;
      //Add DATA TO BE SENT
      // formData.append(this.Caption[i], this.selectedFiles[i], this.selectedFiles[i].fileName);
      console.log(this.selectedFiles[i]+"{"+this.Caption[i]+" (Caption)}");
      formData.append("files",this.selectedFiles[i]);
    }
    xhr.onreadystatechange = evnt => {
      //console.log("onready");
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          isError = true;
          this.uploadBtn = false;
          this.uploadMsg = true;
          this.afterUpload = true;
          this.uploadMsgText = "Upload Failed !";
          this.uploadMsgClass = "text-danger lead";
          //console.log(this.uploadMsgText);
          //console.log(evnt);
        }
        this.ApiResponse.emit(xhr);
      }
      this.manuallyDetectChanges();
    };
    xhr.upload.onprogress = evnt => {
      this.uploadBtn = false; // button should be disabled by process uploading
      if (evnt.lengthComputable) {
        this.percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
      }
      //console.log("Progress..."/*+this.percentComplete+" %"*/);
    };
    xhr.onload = evnt => {
      //console.log("onload");
      //console.log(evnt);
      this.uploadBtn = false;
      this.uploadMsg = true;
      this.afterUpload = true;
      if (!isError) {
        this.uploadMsgText = "Successfully Uploaded !";
        this.uploadMsgClass = "text-success lead";
        //console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
      }
      this.manuallyDetectChanges();
    };
    xhr.onerror = evnt => {
      //console.log("onerror");
      //console.log(evnt);
    };
    xhr.open("POST", this.uploadAPI.url);
   // for (const key of Object.keys(this.headers)) {
      // Object.keys will give an Array of keys
     // xhr.setRequestHeader(key, this.headers[key]);
    //}
    //let token = sessionStorage.getItem("token");
    //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    console.log("From Data");
    console.log(formData);
    xhr.send(formData);
  }

  onRemoveFile(index) {
    console.log(this.selectedFiles[index]);
    const file = this.selectedFiles[index];
    this.selectedFiles = this.selectedFiles.filter(e => e !== file);
    if (this.selectedFiles && this.selectedFiles.length == 0) {
      this.uploadMsg = false;
      this.uploadBtn = false;
    }
    this.manuallyDetectChanges();
    console.log(`after : ${this.selectedFiles}`);
  }

  onEditFile(index) {
    this.selectedFiles[index].showNameInput = true;
    this.manuallyDetectChanges();
  }

  saveEditedFile(index) {
    this.selectedFiles[index].showNameInput = false;
    this.manuallyDetectChanges();
  }

  showNameInputbox(index) {
    this.selectedFiles[index].showNameInput = true;
    this.manuallyDetectChanges();
  }

  hideNameInputbox(index) {
    this.selectedFiles[index].showNameInput = false;
    this.manuallyDetectChanges();
  }

  changeInputVal(event, index) {
    console.log(event.target.value);
    let newFileName = event.target.value;
    this.selectedFiles[index].fileName = newFileName;
    console.log(this.selectedFiles[index]);
    this.selectedFiles[index].showNameInput = false;
    this.manuallyDetectChanges();
  }

  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }
  /* Zone.js is not able to detect the change in MZNG but works fine in standalone, 
           therefore required to manually fire change detection */
  manuallyDetectChanges() {
    this.ref.detectChanges();
  }


}
