import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { InvisibleReCaptchaComponent } from 'ngx-captcha';

import { LevelEnum, CountryInterface, CohortLevelEnum, CohortInterface} from '../enumInterface';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss']
})
export class CertificationFormComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('captchaElem') captcha: InvisibleReCaptchaComponent;
  @Input() domain: string;
  @Input() level: string;
  @Input() coupon = null;

  public readonly siteKey = '6LcXJa0UAAAAAEWUOTbPKb9_JAh0-l8kwLKCbR_i';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  loginFormGroup: FormGroup;
  isNewUser = false;
  showAlertGoToLevel2 = false;
  filteredCountries$: Observable<CountryInterface>;
  cohorts$: Observable<any>;
  constructor(
    private fb: FormBuilder,
    private service: ApiService
  ) { }

  ngOnInit() {
    this.getCohorts();
    this.initializeFormStep1();
    this.initializeFormStep2();
  }

  initializeFormStep1() {
    this.firstFormGroup = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, Validators.required],
      firstName: [null]
    });
  }

  initializeFormStep2() {
    this.secondFormGroup = this.fb.group({
      cohort: [null, [Validators.required]],
      billingName: [null, [Validators.required]],
      taxId: [null, [Validators.required]],
      billingAddress: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      coupon: [this.coupon],
      country: [null, [Validators.required]],
      recaptcha: [null],
      policy: [false]
    });

    this.filteredCountries$ = this.secondFormGroup.get('country').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      flatMap(countryName => countryName ? this.service.getCountries(this.domain, countryName) : [])
    );
  }

  getCohorts() {
    let levelForCohort;
    switch (this.level) {
      case LevelEnum.LEVEL2:
        levelForCohort = CohortLevelEnum.LEVEL2;
        break;
      case LevelEnum.LEVEL3:
        levelForCohort = CohortLevelEnum.LEVEL3;
        break;
      case LevelEnum.LEVELFT:
        levelForCohort = CohortLevelEnum.LEVELFT;
        break;
    }
    this.cohorts$ = this.service.getCohort(this.domain, levelForCohort);
  }

  showLoginForm () {
    this.isNewUser = false;
    this.firstFormGroup.get('firstName').setValidators(null);
    this.firstFormGroup.get('firstName').updateValueAndValidity();
  }

  showRegisterForm() {
    if (this.level === LevelEnum.LEVEL3) {
      this.showAlertGoToLevel2 = true;
    } else {
      this.isNewUser = true;
      this.firstFormGroup.get('firstName').setValidators(Validators.required);
      this.firstFormGroup.get('firstName').updateValueAndValidity();
    }
  }

  goToLevel2 () {
    window.open('https://www.openexo.com/exo-consultant-certification', '_self');
  }

  displayForCountries(country: CountryInterface): string {
    return country ? country.name : '';
  }

  displayForCohorts(cohort: CohortInterface): string {
    return `${cohort.title} -
      ${cohort.date.getFullYear()}/${cohort.date.getMonth() + 1}/${cohort.date.getDate()} -
      ${cohort.price} ${cohort.currency}`;
  }

  getDataFirstFormGroup() {
    return this.removeNullValues(this.firstFormGroup);
  }
  getDataSecondFormGroup() {
    const data = this.removeNullValues(this.secondFormGroup);
    data['country'] = data.country.code;
    data['cohort'] = data.cohort.pk;
    delete data['policy'];
    return data;
  }

  removeNullValues(formGroup: FormGroup) {
    const data = formGroup.getRawValue();
    Object.keys(data).map(key => {
      if (data[key] === null) {
        delete data[key];
      }
    });
    return data;
  }

  onNextStep($event) {
    Object.keys(this.firstFormGroup.controls).forEach(field => this.firstFormGroup.get(field).markAsTouched({ onlySelf: true }));
    if (!this.isNewUser) {
      if (this.firstFormGroup.valid) {
        this.getContractingData();
      }
    } else {
      this.stepper.next();
    }
  }

  getContractingData() {
    const firstFormData = this.getDataFirstFormGroup();
    firstFormData['username'] = firstFormData['email'];
    this.service.getContractingData(this.domain, firstFormData).subscribe(
      (res: {
        email: string,
        fullName: string,
        contractingData: {address: string, companyName: string, name: string, taxId: string}
      }) => {
        this.secondFormGroup.get('billingAddress').setValue(res.contractingData.address);
        this.secondFormGroup.get('taxId').setValue(res.contractingData.taxId);
        this.secondFormGroup.get('companyName').setValue(res.contractingData.companyName);
        this.secondFormGroup.get('billingName').setValue(res.contractingData.name);
        this.firstFormGroup.get('email').setValue(res.email);
        this.firstFormGroup.get('firstName').setValue(res.fullName);
        this.stepper.next();
      },
      err => {
        'username' in err.error ?
          this.firstFormGroup.get('email').setErrors({'custom': err.error.username}) :
          this.firstFormGroup.get('password').setErrors({'custom': err.error.non_field_errors});
      }
    );
  }

  onPay() {
    if (this.secondFormGroup.get('policy').value === false) {
      this.secondFormGroup.get('policy').setErrors({'custom': 'You need to accept the privacy policy'});
    }
    if (this.secondFormGroup.valid) {
      const dataToSend = {
        ...this.getDataFirstFormGroup(),
        ...this.getDataSecondFormGroup(),
        ... {entryPoint: {name: this.level}}
      };
      this.service.getCertified(this.domain, dataToSend).subscribe(
        res => window.open(res.nextUrl),
        err => this.setErrorsInForm(err)
      );
    }
  }

  setErrorsInForm(response) {
    const errorMessage = response.error;
    for (const key in errorMessage) {
      if (errorMessage.hasOwnProperty(key)) {
        if (key === 'country') {
          this.secondFormGroup.get('country').setErrors({'autoCompleteValidator': true});
        } else {
          const value = errorMessage[key];
          this.firstFormGroup.get(key) ?
            this.firstFormGroup.get(key).setErrors({ 'custom': value[0] }) :
            this.secondFormGroup.get(key).setErrors({ 'custom': value[0] });
        }
      }
    }
  }

  handleCaptchaError() {
    this.captcha.execute();
  }
}
