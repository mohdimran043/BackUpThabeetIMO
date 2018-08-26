// ====================================================

// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input,ChangeDetectorRef  } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { SharedMapServiceService } from  '../../components/map/services/shared-map-service.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import {DriverdetailComponent} from './driverdetail.component';
import {driver} from './drivercls';

const URL = 'http://localhost:64430/api/map';
@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

    export class ProductsComponent implements OnInit {
    columns: any[] = [];
    rows: any[] = [];
    loadingIndicator: boolean;
    isConnected = false;
    imgsrc:any;
  status: string;

  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;

  @ViewChild('editorModal')
  editorModal: ModalDirective;


  @ViewChild('drvdtlpopup')
  drvdtlpopup: DriverdetailComponent;

  public driverobj:driver = new driver();

  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

    constructor(private alertService: AlertService,private someSharedService : SharedMapServiceService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {


      this.isConnected = false;

        this.columns = [
            { prop: 'name', name: 'Name', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'idnumber', name: 'idnumber', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'telnumber', name: 'telnumber', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
          { prop: 'empnumber', name: 'empnumber', width: 200, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
          { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];


        }
    public selectedfile:any;

    onSubmit() {


        this.loadData();
    }

    Fileuploadclick(e)
{
    console.log(e)
  //  this.selectedfile = e.target.files[0];
    this.selectedfile = e.target.files;
}

  editRole() {
    this.driverobj.name = 'Rameez2';
    //this.drvdtlpopup.myform.controls['email'].setValue('rameez');
    this.drvdtlpopup.driverobj = this.driverobj;
    this.editorModal.show();
  }

CallUpload()
{

// const frm =  new FormData();
  //frm.append("File",this.selectedfile,this.selectedfile.name)

 /* this.someSharedService.UploadFiles(frm).subscribe(resp =>
        {
          console.log('resp' + resp);
      },
        error => {

            this.alertService.showStickyMessage("Upload Error", `Errors: "${Utilities.getHttpResponseMessage(error)}"`,
                MessageSeverity.error, error);
        }); */

        const data:FormData = new FormData();
        for ( let i = 0 ; i !== this.selectedfile.length; i ++){
        data.append("files", this.selectedfile[i]);
        }
        //alert('values' + values);
        let dt:any;
                this.someSharedService.UploadFiles(data).subscribe( values => {
                    console.log("all values", values)
                  //  alert('values' + values);
                    this.imgsrc = values;
                },
                error => {
                   //alert('error');
                  //  this.alertService.showStickyMessage("Upload Error", `Errors: "${Utilities.getHttpResponseMessage(error)}"`,
                     //   MessageSeverity.error, error);
                });


  }


  onEditorModalHidden() {

  }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        /*this.someSharedService.getLatLng().subscribe(resp =>
            {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rows = JSON.parse(resp);
              console.log('resp' + resp);
          },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });


    }*/
    this.someSharedService.getElasticQuery().subscribe(resp => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.rows = JSON.parse(resp);
      console.log('resp' + resp);
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Load Error", `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
          MessageSeverity.error, error);
      });


  }

  public prntclick() {
    this.someSharedService.printdetail().subscribe(resp => {
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
