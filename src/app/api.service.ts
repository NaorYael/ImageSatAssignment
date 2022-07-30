import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../environments/environment";
import {DataObject, DataObjects} from "./data";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = `${environment.apiUrl}/response.json`;

  constructor(private http: HttpClient) {
  }

  public getDataObjects(): Observable<DataObject[]> {
    return this.http.get<DataObjects>(this.baseUrl)
      .pipe(
        map((dataObjs) => {
          return dataObjs.records;
        }));
  }
}

