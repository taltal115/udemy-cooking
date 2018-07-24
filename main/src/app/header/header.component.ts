import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataStorageService} from '../sheard/data-storage.service';
import {Response} from '@angular/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private dataStorage: DataStorageService) { }

  ngOnInit() {
  }
  onSelect(selection: string) {
    console.log(selection);
  }
  onSaveData() {
    this.dataStorage.storeRecipe()
      .subscribe(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          return data;
        },
        (error: Response) => console.log(error)
      );
  }
}
