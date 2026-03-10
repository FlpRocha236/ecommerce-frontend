import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <div class="container">
      <router-outlet />
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
    }
  `]
})
export class AppComponent {}
