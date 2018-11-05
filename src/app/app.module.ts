import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FileuploaderComponent } from './fileuploader/fileuploader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileCustPickerComponent } from './file-cust-picker/file-cust-picker/file-cust-picker.component';

@NgModule({
  declarations: [
    FileuploaderComponent,
    FileCustPickerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  // An entry component is any component that Angular loads imperatively, (which means you're not referencing it in the template).
  //bootstrap: [FileuploaderComponent],
  entryComponents: [FileuploaderComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    // createCustomElement fromm angular elements package
    const customFileuploader = createCustomElement(FileuploaderComponent, { injector });
    // leverages browser DOM Api customElements function to define a CE.
    customElements.define('app-fileuploader', customFileuploader);
  }
  // bootstrap the ng module
  ngDoBootstrap() { }
}
