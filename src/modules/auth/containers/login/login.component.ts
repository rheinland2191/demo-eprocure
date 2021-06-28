import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import { FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'sb-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {

  formData: any;
	constructor(private localSt:LocalStorageService,private router:Router,
        private fb: FormBuilder) {
            this.formData = this.fb.group({
                email: [null, [Validators.required, Validators.email]],
                password: [null, [Validators.required]]
              });
        }
    ngOnInit() {
        if(this.localSt.retrieve('auth_token')){
            this.router.navigate(['tender']);
        }
    }
    doLogin(){
        console.log("test")
        if(this.formData.valid){
            const authToken = uuid.v4();
            console.log(authToken);
            this.localSt.store('auth_token',authToken);
            setTimeout(()=>{               
                this.router.navigate(['tender']);
           }, 2000);
        }
    }
}
