import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <span>🛒 E-commerce</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/products" routerLinkActive="active-link">
        <mat-icon>inventory_2</mat-icon> Produtos
      </a>
      <a mat-button routerLink="/cart" routerLinkActive="active-link">
        <mat-icon>shopping_cart</mat-icon> Carrinho
      </a>
      <a mat-button routerLink="/orders" routerLinkActive="active-link">
        <mat-icon>receipt_long</mat-icon> Pedidos
      </a>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .active-link { background: rgba(255,255,255,0.2); border-radius: 4px; }
    mat-toolbar { position: sticky; top: 0; z-index: 100; }
  `]
})
export class NavbarComponent {}
