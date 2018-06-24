import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Ingrediant} from '../../sheard/ingrediant.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @Output() OnNewElement = new EventEmitter<Ingrediant>();
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('amountInput') amountInputRef: ElementRef;


  constructor() { }

  ngOnInit() {
  }

  onAddItem() {
    this.OnNewElement.emit(new Ingrediant(this.nameInputRef.nativeElement.value, this.amountInputRef.nativeElement.value));
  }
}
