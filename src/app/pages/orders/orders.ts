import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderService } from '../../services/order';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule,
    MatSnackBarModule, MatChipsModule, MatDividerModule, MatExpansionModule
  ],
  template: `
    <div class="page-header">
      <h1>📦 Meus Pedidos</h1>
    </div>

    <!-- Busca por email -->
    <mat-card class="email-card">
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Seu e-mail</mat-label>
          <input matInput [(ngModel)]="customerEmail" placeholder="seu@email.com">
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="loadOrders()">
          <mat-icon>search</mat-icon> Buscar Pedidos
        </button>
      </mat-card-content>
    </mat-card>

    <!-- Sem pedidos -->
    <mat-card *ngIf="orders.length === 0" class="empty-card">
      <mat-card-content>
        <mat-icon class="empty-icon">receipt_long</mat-icon>
        <p>Nenhum pedido encontrado!</p>
      </mat-card-content>
    </mat-card>

    <!-- Lista de pedidos -->
    <mat-accordion *ngIf="orders.length > 0">
      <mat-expansion-panel *ngFor="let order of orders" class="order-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <strong>Pedido #{{ order.id }}</strong>
          </mat-panel-title>
          <mat-panel-description>
            <span [class]="'status-badge ' + order.status.toLowerCase()">
              {{ getStatusLabel(order.status) }}
            </span>
            <span [class]="'payment-badge ' + order.paymentStatus.toLowerCase()">
              {{ getPaymentLabel(order.paymentStatus) }}
            </span>
            <strong class="total">R$ {{ order.totalAmount | number:'1.2-2' }}</strong>
          </mat-panel-description>
        </mat-expansion-panel-header>

        <!-- Itens do pedido -->
        <div class="order-details">
          <p *ngIf="order.shippingAddress">
            <mat-icon>location_on</mat-icon> {{ order.shippingAddress }}
          </p>
          <p *ngIf="order.notes">
            <mat-icon>note</mat-icon> {{ order.notes }}
          </p>

          <mat-divider></mat-divider>

          <div *ngFor="let item of order.items" class="order-item">
            <span>{{ item.productName }}</span>
            <span>{{ item.quantity }}x R$ {{ item.unitPrice | number:'1.2-2' }}</span>
            <span class="item-subtotal">R$ {{ item.subtotal | number:'1.2-2' }}</span>
          </div>

          <mat-divider></mat-divider>

          <div class="order-actions">
            <button
              mat-raised-button color="primary"
              *ngIf="order.paymentStatus === 'PENDING'"
              (click)="pay(order.id)">
              <mat-icon>payment</mat-icon> Pagar
            </button>
            <button
              mat-button color="warn"
              *ngIf="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'"
              (click)="cancel(order.id)">
              <mat-icon>cancel</mat-icon> Cancelar
            </button>
          </div>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .email-card { margin-bottom: 16px; }
    mat-form-field { width: 100%; margin-bottom: 8px; }
    .empty-card { text-align: center; padding: 48px; }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .order-panel { margin-bottom: 8px; }
    .status-badge, .payment-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      margin-right: 8px;
    }
    .status-badge.pending { background: #fff3e0; color: #e65100; }
    .status-badge.confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-badge.shipped { background: #e3f2fd; color: #1565c0; }
    .status-badge.delivered { background: #e8f5e9; color: #1b5e20; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }
    .payment-badge.pending { background: #fff3e0; color: #e65100; }
    .payment-badge.paid { background: #e8f5e9; color: #2e7d32; }
    .payment-badge.failed { background: #ffebee; color: #c62828; }
    .total { margin-left: auto; color: #3f51b5; }
    .order-details { padding: 16px 0; }
    .order-details p { display: flex; align-items: center; gap: 8px; color: #666; }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .item-subtotal { font-weight: bold; color: #3f51b5; }
    .order-actions { display: flex; gap: 12px; margin-top: 16px; }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  customerEmail = 'cliente@email.com';

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.orderService.getByCustomer(this.customerEmail).subscribe({
      next: (res: any) => this.orders = res.content || res,
      error: () => this.orders = []
    });
  }

  pay(id: number) {
    this.orderService.processPayment(id).subscribe({
      next: () => {
        this.snackBar.open('Pagamento realizado!', 'OK', { duration: 3000 });
        this.loadOrders();
      },
      error: () => this.snackBar.open('Erro ao processar pagamento', 'OK', { duration: 3000 })
    });
  }

  cancel(id: number) {
    this.orderService.cancel(id).subscribe({
      next: () => {
        this.snackBar.open('Pedido cancelado!', 'OK', { duration: 3000 });
        this.loadOrders();
      },
      error: () => this.snackBar.open('Erro ao cancelar pedido', 'OK', { duration: 3000 })
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      PENDING: '⏳ Pendente',
      CONFIRMED: '✅ Confirmado',
      SHIPPED: '🚚 Enviado',
      DELIVERED: '📦 Entregue',
      CANCELLED: '❌ Cancelado'
    };
    return labels[status] || status;
  }

  getPaymentLabel(status: string): string {
    const labels: any = {
      PENDING: '💳 Aguardando',
      PAID: '✅ Pago',
      FAILED: '❌ Falhou',
      REFUNDED: '↩️ Estornado'
    };
    return labels[status] || status;
  }
}

