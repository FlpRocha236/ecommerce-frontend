import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <section class="hero">
      <p class="hero-eyebrow">Pedidos</p>
      <h1 class="hero-title">Seus pedidos.</h1>
    </section>

    <section class="email-section">
      <div class="email-card">
        <div class="field">
          <label>Seu e-mail</label>
          <div class="input-row">
            <input [(ngModel)]="customerEmail" placeholder="seu@email.com" />
            <button class="btn-primary" (click)="loadOrders()">Buscar</button>
          </div>
        </div>
      </div>
    </section>

    <section class="empty-section" *ngIf="orders.length === 0">
      <div class="empty-card">
        <p class="empty-icon">📦</p>
        <h2>Nenhum pedido encontrado.</h2>
        <p>Seus pedidos aparecerão aqui.</p>
      </div>
    </section>

    <section class="orders-section" *ngIf="orders.length > 0">
      <div class="orders-inner">
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header" (click)="toggle(order.id)">
            <div class="order-meta">
              <div class="order-badges">
                <span class="badge" [class]="'status-' + order.status.toLowerCase()">{{ getStatusLabel(order.status) }}</span>
                <span class="badge" [class]="'payment-' + order.paymentStatus.toLowerCase()">{{ getPaymentLabel(order.paymentStatus) }}</span>
              </div>
              <p class="order-id">Pedido #{{ order.id }}</p>
              <p class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <div class="order-total">
              <p class="total-amount">R$ {{ order.totalAmount | number:'1.2-2' }}</p>
              <span class="chevron" [class.open]="isOpen(order.id)">›</span>
            </div>
          </div>

          <div class="order-details" *ngIf="isOpen(order.id)">
            <div class="order-info" *ngIf="order.shippingAddress || order.notes">
              <p *ngIf="order.shippingAddress"><span class="info-label">Entrega</span>{{ order.shippingAddress }}</p>
              <p *ngIf="order.notes"><span class="info-label">Obs</span>{{ order.notes }}</p>
            </div>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of order.items">
                <span class="item-emoji">{{ getEmoji(item.productName) }}</span>
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-qty">{{ item.quantity }}x</span>
                <span class="item-price">R$ {{ item.subtotal | number:'1.2-2' }}</span>
              </div>
            </div>
            <div class="order-actions">
              <button class="btn-primary" *ngIf="order.paymentStatus === 'PENDING'" (click)="pay(order.id)">Pagar Agora</button>
              <button class="btn-danger" *ngIf="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'" (click)="cancel(order.id)">Cancelar Pedido</button>
            </div>
          </div>
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
    .empty-card h2 { font-size: 1.5rem; margin-bottom: 8px; }
    .empty-card p { color: #6e6e73; }
    .orders-section { max-width: 900px; margin: 0 auto; padding: 0 24px 64px; }
    .orders-inner { display: flex; flex-direction: column; gap: 12px; }
    .order-card { background: white; border-radius: 20px; overflow: hidden; }
    .order-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 28px; cursor: pointer; transition: background 0.2s; }
    .order-header:hover { background: #fafafa; }
    .order-badges { display: flex; gap: 8px; margin-bottom: 8px; }
    .badge { padding: 3px 10px; border-radius: 980px; font-size: 0.75rem; font-weight: 500; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-shipped { background: #e3f2fd; color: #1565c0; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
    .payment-pending { background: #fff3e0; color: #e65100; }
    .payment-paid { background: #e8f5e9; color: #2e7d32; }
    .payment-failed { background: #ffebee; color: #c62828; }
    .order-id { font-size: 1rem; font-weight: 600; color: #1d1d1f; }
    .order-date { font-size: 0.8rem; color: #6e6e73; margin-top: 2px; }
    .order-total { display: flex; align-items: center; gap: 16px; }
    .total-amount { font-size: 1.1rem; font-weight: 600; color: #1d1d1f; }
    .chevron { font-size: 1.5rem; color: #6e6e73; transform: rotate(90deg); transition: transform 0.2s; display: inline-block; }
    .chevron.open { transform: rotate(-90deg); }
    .order-details { border-top: 1px solid #f5f5f7; padding: 24px 28px; }
    .order-info { margin-bottom: 20px; }
    .order-info p { font-size: 0.875rem; color: #6e6e73; margin-bottom: 4px; display: flex; gap: 8px; }
    .info-label { font-weight: 600; color: #1d1d1f; }
    .order-items { margin-bottom: 20px; }
    .order-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f7; }
    .item-emoji { font-size: 24px; }
    .item-name { flex: 1; font-size: 0.9rem; font-weight: 500; }
    .item-qty { font-size: 0.85rem; color: #6e6e73; }
    .item-price { font-size: 0.9rem; font-weight: 600; color: #1d1d1f; }
    .order-actions { display: flex; gap: 12px; margin-top: 4px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: 0.8rem; color: #6e6e73; font-weight: 500; }
    .field input { padding: 10px 14px; border: 1px solid #d2d2d7; border-radius: 10px; font-size: 0.9rem; outline: none; font-family: inherit; }
    .field input:focus { border-color: #0071e3; }
    .btn-primary { padding: 10px 24px; background: #0071e3; color: white; border: none; border-radius: 980px; font-size: 0.9rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.2s; }
    .btn-primary:hover { background: #0077ed; }
    .btn-danger { padding: 10px 24px; background: none; color: #ff3b30; border: none; border-radius: 980px; font-size: 0.9rem; cursor: pointer; font-family: inherit; }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  customerEmail = 'cliente@email.com';
  openOrders: Set<number> = new Set();

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.orderService.getByCustomer(this.customerEmail).subscribe({
      next: (res: any) => {
        this.orders = res.content || res;
        if (this.orders.length > 0) this.openOrders.add(this.orders[0].id);
        this.cdr.detectChanges();
      },
      error: () => { this.orders = []; this.cdr.detectChanges(); }
    });
  }

  toggle(id: number) {
    if (this.openOrders.has(id)) this.openOrders.delete(id);
    else this.openOrders.add(id);
  }

  isOpen(id: number): boolean { return this.openOrders.has(id); }

  pay(id: number) {
    this.orderService.processPayment(id).subscribe({
      next: () => { this.snackBar.open('Pagamento realizado!', 'OK', { duration: 3000 }); this.loadOrders(); },
      error: () => this.snackBar.open('Erro ao pagar', 'OK', { duration: 3000 })
    });
  }

  cancel(id: number) {
    this.orderService.cancel(id).subscribe({
      next: () => { this.snackBar.open('Pedido cancelado!', 'OK', { duration: 3000 }); this.loadOrders(); },
      error: () => this.snackBar.open('Erro ao cancelar', 'OK', { duration: 3000 })
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = { PENDING: '⏳ Pendente', CONFIRMED: '✅ Confirmado', SHIPPED: '🚚 Enviado', DELIVERED: '📦 Entregue', CANCELLED: '❌ Cancelado' };
    return labels[status] || status;
  }

  getPaymentLabel(status: string): string {
    const labels: any = { PENDING: '💳 Aguardando', PAID: '✅ Pago', FAILED: '❌ Falhou', REFUNDED: '↩️ Estornado' };
    return labels[status] || status;
  }

  getEmoji(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('notebook') || n.includes('mac')) return '💻';
    if (n.includes('iphone') || n.includes('celular')) return '📱';
    if (n.includes('teclado')) return '⌨️';
    if (n.includes('mouse')) return '🖱️';
    if (n.includes('fone') || n.includes('airpod')) return '🎧';
    if (n.includes('tv') || n.includes('monitor')) return '🖥️';
    if (n.includes('watch')) return '⌚';
    return '📦';
  }
}
