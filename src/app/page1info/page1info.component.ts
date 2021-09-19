import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
      imports: [
         FormsModule
      ]

@Component({
  selector: 'app-page1info',
  templateUrl: './page1info.component.html',
  styleUrls: ['./page1info.component.css']
})
export class Page1infoComponent implements OnInit {
  pageString = 'Info';
  status = false;
  i: number = 0;
  clickable = false;

  constructor() {
    setInterval(() => {
      this.i += .5;
      if (this.clickable == false) {
      this.clickable = true;
      }
      else {
        this.clickable = false;
      }
    }, 500)
   }

  onCreateInfo() {
    if(this.status == false){
    this.status = true;
  }
  else {
    this.status = false;
  }
  }

  onUpdateStuff(event: Event) {
    this.pageString = (<HTMLInputElement>event.target).value;
  }

  getColor() {
    return this.status == true ? 'green': 'red';
  }

  ngOnInit(): void {
  }
}
