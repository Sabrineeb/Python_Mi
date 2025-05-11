import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminComponent } from "./admin/admin.component";


@Component({
  selector: 'app-root',
 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [AdminComponent]
})
export class AppComponent {
  title = 'angular-admin';
}
