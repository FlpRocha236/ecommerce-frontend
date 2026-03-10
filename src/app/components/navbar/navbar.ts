import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/products" class="nav-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="logo-text"> MyStore</span>
        </a>

        <div class="nav-links">
          <a routerLink="/products" routerLinkActive="active">Loja</a>
          <a routerLink="/cart" routerLinkActive="active">Carrinho</a>
          <a routerLink="/orders" routerLinkActive="active">Pedidos</a>
        </div>

        <div class="nav-icons">
          <a routerLink="/cart" class="icon-btn" title="Carrinho">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255,255,255,0.85);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      border-bottom: 1px solid rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 48px;
    }
    .nav-inner {
      max-width: 1024px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    .nav-logo {
      color: #1d1d1f;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
        }
    .logo-text {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .nav-links {
      display: flex;
      gap: 32px;
    }
    .nav-links a {
      color: #1d1d1f;
      font-size: 0.75rem;
      font-weight: 400;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      opacity: 1;
    }
    .nav-icons { display: flex; gap: 16px; }
    .icon-btn {
      color: #1d1d1f;
      opacity: 0.8;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;
    }
    .icon-btn:hover { opacity: 1; }
  `]
})
export class NavbarComponent {}
