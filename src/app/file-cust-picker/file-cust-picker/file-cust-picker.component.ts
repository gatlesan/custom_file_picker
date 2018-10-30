import { Component, Input, Output, EventEmitter, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';

@Component({
  selector: 'app-file-cust-picker',
  templateUrl: './file-cust-picker.component.html',
  styles: [`.constraints-info{margin-top:10px;font-style:italic}.padMarg{padding:0;margin-bottom:0}.caption{margin-right:5px}.textOverflow{white-space:nowrap;padding-right:0;overflow:hidden;text-overflow:ellipsis}.up_btn{color:#000;background-color:transparent;border:2px solid #5c5b5b;border-radius:22px}.delFileIcon{text-decoration:none;color:#ce0909}.dragNDrop .div1{display:border-box;border:2px dashed #5c5b5b;height:6rem;width:20rem}.dragNDrop .div1>p{text-align:center;font-weight:700;color:#5c5b5b;margin-top:1.4em}.dragNDropBtmPad{padding-bottom:2rem}@media screen and (max-width:620px){.caption{padding:0}}@media screen and (max-width:510px){.sizeC{width:25%}}@media screen and (max-width:260px){.caption,.sizeC{font-size:10px}}.resetBtn{margin-left:3px}`]
})
export class FileCustPickerComponent implements OnInit {


  @Input() config: any;
  @Input() resetUpload;
  @Output() ApiResponse = new EventEmitter<any>();
  public idDate: Number;
  public reg: any;
  public notAllowedList: any[];
  public Caption = [];
  public singleFile: Boolean;
  public progressBarShow: Boolean;
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
  public hideSelectBtn: Boolean;
  public hideResetBtn: Boolean;
  public attachPinText: String;
  public uploadMsgClass = "";
  public uploadMsgText: String;
  public uploadAPI: any;
  public headers: any;
  public uploadBtnText = "upload";
  public hideProgressBar = false;
  public previewWidth: number = 50;


  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.resetUpload = false;
    this.ApiResponse = new EventEmitter();
    this.idDate = +new Date();
    this.reg = /(?:\.([^.]+))?$/;
    // this.selectedFiles = [];
    this.notAllowedList = [];
    this.Caption = [];
    this.singleFile = true;
    this.progressBarShow = false;
    this.uploadBtn = false;
    this.uploadMsg = false;
    this.afterUpload = false;
    this.uploadClick = true;
    this.attachPinText = this.config.attachPinText;
    this.hideProgressBar = this.config.hideProgressBar;
    this.formatsAllowed = this.config.formatsAllowed;
    this.hideResetBtn = this.config.hideResetBtn;
    this.hideSelectBtn = this.config.hideSelectBtn;
    this.maxSize = this.config.maxSize;
    this.multiple = this.config.multiple;
    this.theme = this.config.theme;
    this.uploadAPI = this.config.uploadAPI;
    this.headers = this.config.uploadAPI.headers;
    console.log("config: ", this.config);
  }

  onChange(event) {
    //console.log(this.maxSize + this.formatsAllowed + this.multiple);
    this.notAllowedList = [];
    console.log("onchange hit");
    if (this.afterUpload || !this.multiple) {
      this.selectedFiles = [];
      this.Caption = [];
      this.afterUpload = false;
    }
    //FORMATS ALLOWED LIST
    //console.log("FORMATS ALLOWED LIST= "+this.formatsAllowed);
    //NO OF FORMATS ALLOWED

    let formatsCount;
    formatsCount = this.formatsAllowed.match(new RegExp("\\.", "g"));
    formatsCount = formatsCount.length;
    //console.log("NO OF FORMATS ALLOWED= "+formatsCount);
    //console.log("-------------------------------");
    //ITERATE SELECTED FILES

    let file;
    if (event.type == "drop") {
      file = event.dataTransfer.files;
      //console.log("type: drop");
    }
    else {
      file = event.target.files || event.srcElement.files;
      //console.log("type: change");
    }
    //console.log(file);

    let currentFileExt;

    let ext;

    let frmtAllowed;
    for (let i = 0; i < file.length; i++) {
      //CHECK FORMAT
      //CURRENT FILE EXTENSION
      currentFileExt = this.reg.exec(file[i].name);
      currentFileExt = currentFileExt[1];
      //console.log(file[i].name);
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
        if (file[i].size > this.maxSize * 1024000) {
          //console.log("SIZE NOT ALLOWED ("+file[i].size+")");
          this.notAllowedList.push({
            fileName: file[i].name,
            fileSize: this.convertSize(file[i].size),
            errorMsg: "Invalid size"
          });
          continue;
        }
        else {
          //format allowed and size allowed then add file to selectedFile array
          this.selectedFiles.push(file[i]);
          console.log("file got added " + this.selectedFiles);
          console.warn("file got added " + this.selectedFiles);
        }
      }
      else {
        //console.log("FORMAT NOT ALLOWED");
        this.notAllowedList.push({
          fileName: file[i].name,
          fileSize: this.convertSize(file[i].size),
          errorMsg: "Invalid format"
        });
        continue;
      }
    }
    if (this.selectedFiles.length !== 0) {
      this.uploadBtn = true;
      // if (this.theme == "attachPin")
      //     this.uploadFiles();
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
    this.progressBarShow = true;
    this.uploadClick = false;
    this.notAllowedList = [];

    let isError = false;

    let xhr = new XMLHttpRequest();

    let formData = new FormData();
    for (i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] == undefined)
        this.Caption[i] = "file" + i;
      //Add DATA TO BE SENT
      formData.append(this.Caption[i], this.selectedFiles[i] /*, this.selectedFiles[i].name*/);
      //console.log(this.selectedFiles[i]+"{"+this.Caption[i]+" (Caption)}");
    }
    if (i > 1) {
      this.singleFile = false;
    }
    else {
      this.singleFile = true;
    }
    xhr.onreadystatechange = evnt => {
      //console.log("onready");
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          isError = true;
          this.progressBarShow = false;
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
      this.progressBarShow = false;
      this.uploadBtn = false;
      this.uploadMsg = true;
      this.afterUpload = true;
      if (!isError) {
        this.uploadMsgText = "Successfully Uploaded !";
        this.uploadMsgClass = "text-success lead";
        //console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
      }
    };
    xhr.onerror = evnt => {
      //console.log("onerror");
      //console.log(evnt);
    };
    xhr.open("POST", this.uploadAPI, true);
    for (const key of Object.keys(this.headers)) {
      // Object.keys will give an Array of keys
      xhr.setRequestHeader(key, this.headers[key]);
    }
    //let token = sessionStorage.getItem("token");
    //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
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
    console.log(this.selectedFiles[index]);
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
