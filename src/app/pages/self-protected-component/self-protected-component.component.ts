import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-protected-component',
  templateUrl: './self-protected-component.component.html',
  styleUrls: ['./self-protected-component.component.scss']
})
export class SelfProtectedComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
