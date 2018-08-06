import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.css']
})
export class ReactiveFormsComponent implements OnInit {
  statuses = ['Stable', 'Critical', 'Finished'];
  projectForm: FormGroup;
  excludeProjectName = ['test'];

  constructor() { }

  ngOnInit() {
    this.projectForm = new FormGroup({
      'userData' : new FormGroup({
        'projectName' : new FormControl(
          null,
          [],//this.allowedEmails.bind(this),
          this.allowedEmailsAsync),
        'email' : new FormControl(null, [Validators.required, Validators.email])
      }),
      'status': new FormControl('Stable')
    })
  }

  onSubmit() {
    console.log(this.projectForm)
  }

  allowedEmails(control: FormControl): {[s: string]: boolean} {
    if(this.excludeProjectName.indexOf(control.value) !== -1) {
      return {'excludeProjectName': true}
    } else {
      return null;
    }
  }

  allowedEmailsAsync(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if(control.value === 'test') {
          resolve({'excludeProjectName': true})
        } else {
          resolve(null);
        }
      },2000)
    })
  }
}
