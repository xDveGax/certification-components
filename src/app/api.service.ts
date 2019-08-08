import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountryInterface, CohortInterface } from './enumInterface';


@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getCountries(domain: string, countryName?: string): Observable<CountryInterface[]> {
    const apiUrl = `${domain}api/core/country/`;
    let params = new HttpParams();
    if (countryName) {
      params = params.set('search', countryName);
    }
    return this.http.get(apiUrl, {params: params}).pipe(map(res => this.parseCountry(res)));
  }

  getCohort(domain: string, level: string): Observable<CohortInterface[]> {
    const apiUrl = `${domain}api/exo-certification/cohort/`;
    let params = new HttpParams();
    params = params.set('level', level);
    return this.http.get(apiUrl, {params: params}).pipe(map(res => this.parseCohort(res)));
  }

  getContractingData(domain: string, data: any): Observable<any> {
    const apiUrl = `${domain}api/accounts/contracting-data/`;
    return this.http.post(apiUrl, data);
  }

  getCertified(domain: string, data: any): Observable<any> {
    const apiUrl = `${domain}api/accounts/get-certified/`;
    return this.http.post(apiUrl, data);
  }

  private parseCountry(res): CountryInterface[] {
    return res.map((c: { name: string, code2: string }) => <CountryInterface>{name: c.name, code: c.code2});
  }

  private parseCohort(res): CohortInterface[] {
    return res.map(c => ({
      title: c.title, pk: c.pk, currency: c.currency, price: c.price, date: new Date(c.date)
    }));
  }
}
