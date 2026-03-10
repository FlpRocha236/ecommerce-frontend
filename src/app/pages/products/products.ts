import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product, ProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <!-- Hero -->
    <section class="hero">
      <p class="hero-eyebrow">Loja</p>
      <h1 class="hero-title">O melhor jeito de<br>comprar o que você ama.</h1>
    </section>

    <!-- Formulário -->
    <section class="form-section" *ngIf="showForm">
      <div class="form-card">
        <h2>{{ editingId ? 'Editar Produto' : 'Novo Produto' }}</h2>
        <div class="form-grid">
          <div class="field">
            <label>Nome</label>
            <input [(ngModel)]="form.name" placeholder="Nome do produto" />
          </div>
          <div class="field">
            <label>Descrição</label>
            <input [(ngModel)]="form.description" placeholder="Descrição" />
          </div>
          <div class="field">
            <label>Preço (R$)</label>
            <input type="number" [(ngModel)]="form.price" placeholder="0,00" />
          </div>
          <div class="field">
            <label>Estoque</label>
            <input type="number" [(ngModel)]="form.stockQuantity" placeholder="0" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-primary" (click)="save()">Salvar</button>
          <button class="btn-ghost" (click)="closeForm()">Cancelar</button>
        </div>
      </div>
    </section>

    <!-- Barra de ações -->
    <section class="toolbar">
      <div class="toolbar-inner">
        <span class="results">{{ products.length }} produtos</span>
        <button class="btn-primary small" (click)="openForm()">+ Adicionar</button>
      </div>
    </section>

    <!-- Grid de produtos -->
    <section class="products-section">
      <div class="products-grid">
        <div class="product-card" *ngFor="let product of products">
          <div class="product-image">
            <div class="product-icon">{{ getEmoji(product.name) }}</div>
          </div>
          <div class="product-info">
            <p class="product-category">Produto</p>
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <p class="product-price">R$ {{ product.price | number:'1.2-2' }}</p>
            <p class="product-stock" [class.low]="product.stockQuantity < 5">
              {{ product.stockQuantity > 0 ? product.stockQuantity + ' em estoque' : 'Esgotado' }}
            </p>
          </div>
          <div class="product-actions">
            <button class="btn-buy" (click)="addToCart(product)"
              [disabled]="product.stockQuantity === 0">
              {{ product.stockQuantity === 0 ? 'Esgotado' : 'Adicionar ao Carrinho' }}
            </button>
            <div class="secondary-actions">
              <button class="link-btn" (click)="edit(product)">Editar</button>
              <button class="link-btn danger" (click)="delete(product.id)">Remover</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 80px 24px 48px;
      background: #f5f5f7;
    }
    .hero-eyebrow {
      font-size: 0.9rem;
      color: #6e6e73;
      margin-bottom: 12px;
      font-weight: 400;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #1d1d1f;
      line-height: 1.1;
    }
    .form-section {
      max-width: 800px;
      margin: 0 auto 32px;
      padding: 0 24px;
    }
    .form-card {
      background: white;
      border-radius: 20px;
      padding: 32px;
    }
    .form-card h2 {
      font-size: 1.3rem;
      margin-bottom: 24px;
      color: #1d1d1f;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: 0.8rem; color: #6e6e73; font-weight: 500; }
    .field input {
      padding: 10px 14px;
      border: 1px solid #d2d2d7;
      border-radius: 10px;
      font-size: 0.95rem;
      outline: none;
      transition: border 0.2s;
      font-family: inherit;
    }
    .field input:focus { border-color: #0071e3; }
    .form-actions { display: flex; gap: 12px; }
    .toolbar {
      border-top: 1px solid #d2d2d7;
      border-bottom: 1px solid #d2d2d7;
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 48px;
      z-index: 90;
    }
    .toolbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .results { font-size: 0.85rem; color: #6e6e73; }
    .products-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2px;
      background: #d2d2d7;
      border-radius: 20px;
      overflow: hidden;
    }
    .product-card {
      background: white;
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: background 0.2s;
    }
    .product-card:hover { background: #fafafa; }
    .product-image {
      display: flex;
      justify-content: center;
      padding: 24px 0;
    }
    .product-icon { font-size: 80px; line-height: 1; }
    .product-info { flex: 1; }
    .product-category {
      font-size: 0.75rem;
      color: #6e6e73;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .product-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1d1d1f;
      margin-bottom: 8px;
    }
    .product-desc {
      font-size: 0.875rem;
      color: #6e6e73;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .product-price {
      font-size: 1.1rem;
      color: #1d1d1f;
      font-weight: 500;
    }
    .product-stock {
      font-size: 0.8rem;
      color: #34c759;
      margin-top: 4px;
    }
    .product-stock.low { color: #ff3b30; }
    .btn-buy {
      width: 100%;
      padding: 12px;
      background: #0071e3;
      color: white;
      border: none;
      border-radius: 980px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .btn-buy:hover { background: #0077ed; }
    .btn-buy:disabled { background: #d2d2d7; cursor: not-allowed; }
    .secondary-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 8px;
    }
    .link-btn {
      background: none;
      border: none;
      color: #0071e3;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
    }
    .link-btn.danger { color: #ff3b30; }
    .btn-primary {
      padding: 10px 20px;
      background: #0071e3;
      color: white;
      border: none;
      border-radius: 980px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-primary.small { padding: 7px 16px; font-size: 0.8rem; }
    .btn-ghost {
      padding: 10px 20px;
      background: none;
      color: #0071e3;
      border: none;
      border-radius: 980px;
      font-size: 0.9rem;
      cursor: pointer;
      font-family: inherit;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  editingId: number | null = null;
  customerEmail = 'cliente@email.com';

  form: ProductRequest = {
    name: '', description: '', price: 0, stockQuantity: 0
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.products = res.content || res;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Erro ao carregar produtos', 'OK', { duration: 3000 })
    });
  }

  openForm() { this.showForm = true; }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.form = { name: '', description: '', price: 0, stockQuantity: 0 };
  }

  save() {
    if (this.editingId) {
      this.productService.update(this.editingId, this.form).subscribe({
        next: () => { this.snackBar.open('Produto atualizado!', 'OK', { duration: 3000 }); this.load(); this.closeForm(); },
        error: () => this.snackBar.open('Erro ao atualizar', 'OK', { duration: 3000 })
      });
    } else {
      this.productService.create(this.form).subscribe({
        next: () => { this.snackBar.open('Produto criado!', 'OK', { duration: 3000 }); this.load(); this.closeForm(); },
        error: () => this.snackBar.open('Erro ao criar produto', 'OK', { duration: 3000 })
      });
    }
  }

  edit(product: Product) {
    this.editingId = product.id;
    this.form = { name: product.name, description: product.description, price: product.price, stockQuantity: product.stockQuantity };
    this.showForm = true;
  }

  delete(id: number) {
    this.productService.delete(id).subscribe({
      next: () => { this.snackBar.open('Produto removido!', 'OK', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao remover', 'OK', { duration: 3000 })
    });
  }

  addToCart(product: Product) {
    this.cartService.addItem(this.customerEmail, product.id, 1).subscribe({
      next: () => this.snackBar.open(`${product.name} adicionado!`, 'OK', { duration: 3000 }),
      error: () => this.snackBar.open('Erro ao adicionar ao carrinho', 'OK', { duration: 3000 })
    });
  }

  getEmoji(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('notebook') || n.includes('mac') || n.includes('laptop')) return '💻';
    if (n.includes('iphone') || n.includes('celular') || n.includes('phone')) return '📱';
    if (n.includes('teclado')) return '⌨️';
    if (n.includes('mouse')) return '🖱️';
    if (n.includes('fone') || n.includes('headphone') || n.includes('airpod')) return '🎧';
    if (n.includes('tv') || n.includes('monitor')) return '🖥️';
    if (n.includes('tablet') || n.includes('ipad')) return '📲';
    if (n.includes('watch') || n.includes('relogio')) return '⌚';
    return '📦';
  }
}
