import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.css']
})
export class FileuploaderComponent implements OnInit {

  @Input() config: any;
  public afuConfig: any;

  constructor(private http: HttpClient) {
    console.log("on intit component");
  }

  ngOnInit() {
    if (this.config != undefined) {
      console.log("Passed Configuration "+this.config);
      let configObj = JSON.parse(this.config);
      this.afuConfig = configObj;
    }
  }
}
