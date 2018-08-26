import { Component} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {driver} from './drivercls';
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

  constructor() {
  // here name is group of first name and last name, formgroup may be nested in another form group.


  }

  

}
