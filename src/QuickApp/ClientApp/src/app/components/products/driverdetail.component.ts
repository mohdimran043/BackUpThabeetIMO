import { Component} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { driver } from './drivercls';
import { SharedMapServiceService } from '../../components/map/services/shared-map-service.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';

@Component({
  selector: 'app-driverdetail',
  templateUrl: './driverdetail.component.html',
  styleUrls: ['./driverdetail.component.css']
})

export class DriverdetailComponent{
   // Create array to populate language dropdown
   public driverobj:driver = new driver();
   langs: string[] = [
    'English',
    'French',
    'German',
  ];
  loadingIndicator: boolean;

  constructor(private alertService: AlertService,private someSharedService: SharedMapServiceService) {
  // here name is group of first name and last name, formgroup may be nested in another form group.


  }

  public savebtn() {
    console.log('respave' + this.driverobj.name);
    this.someSharedService.Savedrivers(this.driverobj).subscribe(resp => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      //this.rows = JSON.parse(resp);
      console.log('resp' + resp);
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Load Error", `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
          MessageSeverity.error, error);
      });
  }

}
