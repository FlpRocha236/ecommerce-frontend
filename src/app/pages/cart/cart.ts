import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { Cart } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, RouterLink],
  template: `
    <section class="hero">
      <p class="hero-eyebrow">Carrinho</p>
      <h1 class="hero-title">Seu carrinho.</h1>
    </section>

    <section class="email-section">
      <div class="email-card">
        <div class="field">
          <label>Seu e-mail</label>
          <div class="input-row">
            <input [(ngModel)]="customerEmail" placeholder="seu@email.com" />
            <button class="btn-primary" (click)="loadCart()">Buscar</button>
          </div>
        </div>
      </div>
    </section>

    <section class="empty-section" *ngIf="cart && cart.items.length === 0">
      <div class="empty-card">
        <p class="empty-icon">🛒</p>
        <h2>Seu carrinho está vazio.</h2>
        <p>Adicione produtos para continuar.</p>
        <a class="btn-primary" routerLink="/products">Ver Produtos</a>
      </div>
    </section>

    <section class="cart-section" *ngIf="cart && cart.items.length > 0">
      <div class="cart-inner">
        <div class="items-list">
          <h2 class="section-title">{{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'itens' }}</h2>
          <div class="cart-item" *ngFor="let item of cart.items">
            <div class="item-icon">{{ getEmoji(item.productName) }}</div>
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p>Quantidade: {{ item.quantity }}</p>
              <p>R$ {{ item.unitPrice | number:'1.2-2' }} por unidade</p>
            </div>
            <div class="item-right">
              <p class="item-price">R$ {{ item.subtotal | number:'1.2-2' }}</p>
              <button class="remove-btn" (click)="removeItem(item.productId)">Remover</button>
            </div>
          </div>
        </div>

        <div class="summary-card">
          <h2>Resumo</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ {{ cart.totalAmount | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row">
            <span>Frete</span>
            <span class="free">Grátis</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total">
            <span>Total</span>
            <span>R$ {{ cart.totalAmount | number:'1.2-2' }}</span>
          </div>
          <div class="field" style="margin-top: 20px;">
            <label>Endereço de entrega</label>
            <input [(ngModel)]="shippingAddress" placeholder="Rua, número, cidade" />
          </div>
          <div class="field">
            <label>Observações</label>
            <input [(ngModel)]="notes" placeholder="Opcional" />
          </div>
          <button class="btn-buy" (click)="checkout()">Finalizar Pedido</button>
          <button class="btn-ghost" (click)="clearCart()">Limpar Carrinho</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { text-align: center; padding: 80px 24px 48px; background: #f5f5f7; }
    .hero-eyebrow { font-size: 0.9rem; color: #6e6e73; margin-bottom: 12px; }
    .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; letter-spacing: -0.03em; color: #1d1d1f; }
    .email-section { max-width: 800px; margin: 0 auto 32px; padding: 0 24px; }
    .email-card { background: white; border-radius: 20px; padding: 24px 32px; }
    .input-row { display: flex; gap: 12px; }
    .input-row input { flex: 1; }
    .empty-section { max-width: 600px; margin: 0 auto; padding: 48px 24px; text-align: center; }
    .empty-card { background: white; border-radius: 20px; padding: 64px 32px; }
    .empty-icon { font-size: 64px; margin-bottom: 16px; }
    .empty-card h2 { font-size: 1.5rem; margin-bottom: 8px; color: #1d1d1f; }
    .empty-card p { color: #6e6e73; margin-bottom: 24px; }
    .cart-section { max-width: 1100px; margin: 0 auto; padding: 0 24px 64px; }
    .cart-inner { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
    .section-title { font-size: 1.1rem; color: #6e6e73; font-weight: 400; margin-bottom: 16px; }
    .cart-item { background: white; border-radius: 16px; padding: 24px; display: flex; gap: 20px; align-items: center; margin-bottom: 12px; }
    .item-icon { font-size: 48px; }
    .item-info { flex: 1; }
    .item-info h3 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
    .item-info p { font-size: 0.85rem; color: #6e6e73; }
    .item-right { text-align: right; }
    .item-price { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
    .remove-btn { background: none; border: none; color: #0071e3; font-size: 0.8rem; cursor: pointer; font-family: inherit; }
    .summary-card { background: white; border-radius: 20px; padding: 28px; position: sticky; top: 80px; }
    .summary-card h2 { font-size: 1.2rem; margin-bottom: 20px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 12px; color: #1d1d1f; }
    .free { color: #34c759; }
    .summary-divider { border-top: 1px solid #d2d2d7; margin: 16px 0; }
    .summary-row.total { font-weight: 600; font-size: 1rem; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .field label { font-size: 0.8rem; color: #6e6e73; font-weight: 500; }
    .field input { padding: 10px 14px; border: 1px solid #d2d2d7; border-radius: 10px; font-size: 0.9rem; outline: none; font-family: inherit; }
    .field input:focus { border-color: #0071e3; }
    .btn-buy { width: 100%; padding: 14px; background: #0071e3; color: white; border: none; border-radius: 980px; font-size: 0.95rem; font-weight: 500; cursor: pointer; font-family: inherit; margin-top: 8px; transition: background 0.2s; }
    .btn-buy:hover { background: #0077ed; }
    .btn-ghost { width: 100%; padding: 12px; background: none; color: #0071e3; border: none; border-radius: 980px; font-size: 0.9rem; cursor: pointer; font-family: inherit; margin-top: 4px; }
    .btn-primary { padding: 10px 20px; background: #0071e3; color: white; border: none; border-radius: 980px; font-size: 0.9rem; font-weight: 500; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-block; }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  customerEmail = 'cliente@email.com';
  shippingAddress = '';
  notes = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.cartService.getCart(this.customerEmail).subscribe({
      next: (cart) => { this.cart = cart; this.cdr.detectChanges(); },
      error: () => {
        this.cart = { id: 0, customerEmail: this.customerEmail, items: [], totalAmount: 0, totalItems: 0 };
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(productId: number) {
    this.cartService.removeItem(this.customerEmail, productId).subscribe({
      next: (cart) => { this.cart = cart; this.cdr.detectChanges(); this.snackBar.open('Item removido!', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Erro ao remover', 'OK', { duration: 3000 })
    });
  }

  clearCart() {
    this.cartService.clearCart(this.customerEmail).subscribe({
      next: () => { this.loadCart(); this.snackBar.open('Carrinho limpo!', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Erro ao limpar', 'OK', { duration: 3000 })
    });
  }

  checkout() {
    if (!this.shippingAddress) { this.snackBar.open('Informe o endereço!', 'OK', { duration: 3000 }); return; }
    this.orderService.create(this.customerEmail, this.shippingAddress, this.notes).subscribe({
      next: (order) => { this.snackBar.open(`Pedido #${order.id} criado!`, 'OK', { duration: 4000 }); this.loadCart(); },
      error: () => this.snackBar.open('Erro ao criar pedido', 'OK', { duration: 3000 })
    });
  }

  getEmoji(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('notebook') || n.includes('mac') || n.includes('laptop')) return '💻';
    if (n.includes('iphone') || n.includes('celular')) return '📱';
    if (n.includes('teclado')) return '⌨️';
    if (n.includes('mouse')) return '🖱️';
    if (n.includes('fone') || n.includes('airpod')) return '🎧';
    if (n.includes('tv') || n.includes('monitor')) return '🖥️';
    if (n.includes('watch')) return '⌚';
    return '📦';
  }
}
