import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FileuploaderComponent } from './fileuploader/fileuploader.component';
//import { MatDialogModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalComponent} from './directives/model.component';
import { ModalService } from './services/modal.service';


@NgModule({
  declarations: [
    FileuploaderComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    //MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  // An entry component is any component that Angular loads imperatively, (which means you're not referencing it in the template).
  entryComponents: [FileuploaderComponent],
  providers: [ModalService]
})
export class AppModule {
  constructor(private injector: Injector) {
    // createCustomElement form angular elements package
    const customFileuploader = createCustomElement(FileuploaderComponent, { injector });
    // leverages browser DOM Api customElements function to define a CE.
    customElements.define('app-fileuploader', customFileuploader);
  }
  // bootstrap the ng module
  ngDoBootstrap() {}
 }
