 import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- important!

@Component({
  selector: 'app-root',
  standalone: true,              // <-- make root standalone
  imports: [RouterModule],       // <-- include RouterModule for router-outlet
  template: `<router-outlet></router-outlet>`,
  // styleUrls: ['./app.component.css']  <-- remove if file doesn't exist
})
export class AppComponent { }