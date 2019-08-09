import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatStepperModule,
  MatSelectModule,
  MatIconModule,
  MatAutocompleteModule,
  MatCheckboxModule,
} from '@angular/material';

import { NgxCaptchaModule } from 'ngx-captcha';

import { CertificationFormComponent } from './certification-form/certification-form.component';
import { HumanizeFormErrorsPipe } from './pipes/humanize-form-errors.pipe';
import { ApiService } from './api.service';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  imports: [
    NgxCaptchaModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  declarations: [
    CertificationFormComponent,
    HumanizeFormErrorsPipe,
    AlertComponent
  ],
  providers: [
    ApiService
  ],
  entryComponents: [
    CertificationFormComponent
  ],
  bootstrap: []
})
export class AppModule {
  constructor(
    private injector: Injector
  ) {}

  ngDoBootstrap() {
    const el = createCustomElement(CertificationFormComponent, { injector: this.injector });
    customElements.define('app-certification-form', el);
  }
}

