import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { Cart } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule,
    MatSnackBarModule, MatDividerModule, MatListModule, RouterLink
  ],
  template: `
    <div class="page-header">
      <h1>🛒 Carrinho</h1>
    </div>

    <!-- Email do cliente -->
    <mat-card class="email-card">
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Seu e-mail</mat-label>
          <input matInput [(ngModel)]="customerEmail" placeholder="seu@email.com">
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="loadCart()">
          <mat-icon>search</mat-icon> Buscar Carrinho
        </button>
      </mat-card-content>
    </mat-card>

    <!-- Carrinho vazio -->
    <mat-card *ngIf="cart && cart.items.length === 0" class="empty-card">
      <mat-card-content>
        <mat-icon class="empty-icon">remove_shopping_cart</mat-icon>
        <p>Seu carrinho está vazio!</p>
        <a mat-raised-button color="primary" routerLink="/products">
          Ver Produtos
        </a>
      </mat-card-content>
    </mat-card>

    <!-- Itens do carrinho -->
    <div *ngIf="cart && cart.items.length > 0">
      <mat-card *ngFor="let item of cart.items" class="item-card">
        <mat-card-content>
          <div class="item-row">
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p>Unitário: R$ {{ item.unitPrice | number:'1.2-2' }}</p>
              <p>Quantidade: {{ item.quantity }}</p>
            </div>
            <div class="item-actions">
              <p class="subtotal">R$ {{ item.subtotal | number:'1.2-2' }}</p>
              <button mat-icon-button color="warn" (click)="removeItem(item.productId)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Total e finalizar -->
      <mat-card class="total-card">
        <mat-card-content>
          <div class="total-row">
            <h2>Total: R$ {{ cart.totalAmount | number:'1.2-2' }}</h2>
            <p>{{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'itens' }}</p>
          </div>
          <mat-divider></mat-divider>

          <div class="checkout-form">
            <mat-form-field appearance="outline">
              <mat-label>Endereço de entrega</mat-label>
              <input matInput [(ngModel)]="shippingAddress" placeholder="Rua, número, cidade">
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Observações</mat-label>
              <input matInput [(ngModel)]="notes" placeholder="Opcional">
            </mat-form-field>
          </div>

          <div class="cart-actions">
            <button mat-raised-button color="primary" (click)="checkout()">
              <mat-icon>check_circle</mat-icon> Finalizar Pedido
            </button>
            <button mat-button color="warn" (click)="clearCart()">
              <mat-icon>delete_sweep</mat-icon> Limpar Carrinho
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .email-card { margin-bottom: 16px; }
    mat-form-field { width: 100%; margin-bottom: 8px; }
    .empty-card { text-align: center; padding: 48px; }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .item-card { margin-bottom: 12px; }
    .item-row { display: flex; justify-content: space-between; align-items: center; }
    .item-info h3 { margin: 0 0 4px; }
    .item-info p { margin: 0; color: #666; }
    .item-actions { text-align: right; }
    .subtotal { font-size: 1.2rem; font-weight: bold; color: #3f51b5; margin: 0; }
    .total-card { margin-top: 16px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .total-row h2 { margin: 0; color: #3f51b5; }
    .checkout-form { margin-top: 16px; }
    .cart-actions { display: flex; gap: 12px; margin-top: 16px; }
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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.cartService.getCart(this.customerEmail).subscribe({
      next: (cart) => this.cart = cart,
      error: () => this.cart = { id: 0, customerEmail: this.customerEmail, items: [], totalAmount: 0, totalItems: 0 }
    });
  }

  removeItem(productId: number) {
    this.cartService.removeItem(this.customerEmail, productId).subscribe({
      next: (cart) => { this.cart = cart; this.snackBar.open('Item removido!', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Erro ao remover item', 'OK', { duration: 3000 })
    });
  }

  clearCart() {
    this.cartService.clearCart(this.customerEmail).subscribe({
      next: () => { this.loadCart(); this.snackBar.open('Carrinho limpo!', 'OK', { duration: 3000 }); },
      error: () => this.snackBar.open('Erro ao limpar carrinho', 'OK', { duration: 3000 })
    });
  }

  checkout() {
    if (!this.shippingAddress) {
      this.snackBar.open('Informe o endereço de entrega!', 'OK', { duration: 3000 });
      return;
    }
    this.orderService.create(this.customerEmail, this.shippingAddress, this.notes).subscribe({
      next: (order) => {
        this.snackBar.open(`Pedido #${order.id} criado com sucesso!`, 'OK', { duration: 4000 });
        this.loadCart();
      },
      error: () => this.snackBar.open('Erro ao criar pedido', 'OK', { duration: 3000 })
    });
  }
}
