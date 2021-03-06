import { Injectable , Output,EventEmitter} from '@angular/core';
import {HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { Config } from '../../../../../node_modules/protractor';
import { ConfigurationService } from '../../../services/configuration.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { encodeUriFragment } from '../../../../../node_modules/@angular/router/src/url_tree';
import { AppComponent } from '../../app.component';
import * as appmode from '../../../app.module';
import { driver } from '../../products/drivercls';
export class Qrystring{
  public Qry:string = encodeURI("SELECT * from driverinfo")
}

@Injectable({
  providedIn: 'root'
})
export class SharedMapServiceService {
  public DeviceId:any;
  public RngSimVal:any;

  public LngLat:any;
  public api_url: any;
  // = 'http://localhost:59548/api/map';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/html',
      'responseType': 'text'
    })
  };
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  @Output() SimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() PauseSimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() ResumeSimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() SimulateRouteEvnt: EventEmitter<number> = new EventEmitter();
  @Output() RangeSimEvnt: EventEmitter<number> = new EventEmitter();

  SimulateObsrv = this.SimulateEvnt.asObservable();
  PauseSimulateObsrv = this.PauseSimulateEvnt.asObservable();
  SimulateRouteObsrv = this.SimulateRouteEvnt.asObservable();
  ResumeimulateObsrv = this.ResumeSimulateEvnt.asObservable();
  RangeSimObsrv = this.RangeSimEvnt.asObservable();

  constructor(private http: HttpClient, private configurations: ConfigurationService) {
    this.api_url = appmode.getBaseUrl() + 'api/map';
  }

  public printdetail() {
    return this.http.get(this.api_url + "/PrintDtls?w_clause=" + encodeURI("where 1=1 "), { responseType: 'text' });
  }

  public getLatLng()
  {

     return this.http.get(this.api_url + "?w_clause=" + encodeURI("where 1=1 "), {responseType: 'text'});
   /*  return this.http.get(this.api_url, {responseType: 'text'})
    .pipe(
      tap( // Log the result or error
        error => console.log(error)
      )
    ); */


  }

  public Savedrivers(frm: driver) {
    console.log('savedrivers' + frm);
    return this.http.post(this.api_url + "/SaveDriverDtl", frm, { responseType: 'text' });
  }

  public getElasticQuery() {
    return this.http.get(this.api_url + "/DriverElastic?w_clause=" + encodeURI("where 1=1 "), { responseType: 'text' });
  }

  public UploadFiles(frm:FormData)
  {

    return this.http.post(this.api_url  ,frm, {responseType: 'text'});


  }


  public SimulateDevices(DeviceId: any) {
    this.DeviceId = DeviceId;
    console.log('Simulate Device Shared' + DeviceId);
    this.SimulateEvnt.emit(DeviceId)
}

public PausseSimulation(DeviceId: any) {
  this.DeviceId = DeviceId;
  console.log('Pause Device Shared ' + DeviceId);
  this.PauseSimulateEvnt.emit(DeviceId)
}

public ResumeSimulation(DeviceId: any) {
  this.DeviceId = DeviceId;
  console.log('Pause Device Shared ' + DeviceId);
  this.ResumeSimulateEvnt.emit(DeviceId)
}

public Simulate_By_Route_Device(DeviceId: any) {
  this.DeviceId = DeviceId;
  console.log('Pause Device Shared ' + DeviceId);
  this.SimulateRouteEvnt.emit(DeviceId)
}

public RngSlider_Simulate(RngSimVal: any) {
  this.RngSimVal = RngSimVal;
  console.log('Pause Device Shared ' + RngSimVal);
  this.RangeSimEvnt.emit(RngSimVal)
}



}
