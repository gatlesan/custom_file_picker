import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FileuploaderComponent } from './fileuploader/fileuploader.component';
//import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './directives/model.component';
import { ModalService } from './services/modal.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { AngularFileUploaderComponent } from "angular-file-uploader";
import { FileCustPickerComponent } from './file-cust-picker/file-cust-picker/file-cust-picker.component';

export const greet = "Good Morning!";


@NgModule({
  declarations: [
    FileuploaderComponent,
    ModalComponent,
    FileCustPickerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    //MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFileUploaderModule
  ],
  // An entry component is any component that Angular loads imperatively, (which means you're not referencing it in the template).
  //bootstrap: [FileuploaderComponent],
  entryComponents: [FileuploaderComponent,FileCustPickerComponent],
  providers: [ModalService]
})
export class AppModule {
  constructor(private injector: Injector) {
    // createCustomElement form angular elements package
    const customFileuploader = createCustomElement(FileuploaderComponent, { injector });
    // const fileuploader = createCustomElement(FileCustPickerComponent, { injector });
    // leverages browser DOM Api customElements function to define a CE.
    customElements.define('app-fileuploader', customFileuploader);
    // customElements.define('app-file-cust-picker', fileuploader);
    console.log(customElements.get('app-fileuploader'));
  }
  // bootstrap the ng module
  ngDoBootstrap() { }
}
