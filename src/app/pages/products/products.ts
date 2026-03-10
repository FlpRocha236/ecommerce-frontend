import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product, ProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatInputModule, MatFormFieldModule,
    MatSnackBarModule, MatChipsModule
  ],
  template: `
    <div class="page-header">
      <h1>Produtos</h1>
      <button mat-raised-button color="primary" (click)="openForm()">
        <mat-icon>add</mat-icon> Novo Produto
      </button>
    </div>

    <!-- Formulário -->
    <mat-card *ngIf="showForm" class="form-card">
      <mat-card-title>{{ editingId ? 'Editar' : 'Novo' }} Produto</mat-card-title>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput [(ngModel)]="form.name" placeholder="Nome do produto">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descrição</mat-label>
          <input matInput [(ngModel)]="form.description" placeholder="Descrição">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preço</mat-label>
          <input matInput type="number" [(ngModel)]="form.price" placeholder="0.00">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estoque</mat-label>
          <input matInput type="number" [(ngModel)]="form.stockQuantity" placeholder="0">
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="save()">Salvar</button>
        <button mat-button (click)="closeForm()">Cancelar</button>
      </mat-card-actions>
    </mat-card>

    <!-- Lista de produtos -->
    <div class="products-grid">
      <mat-card *ngFor="let product of products" class="product-card">
        <mat-card-header>
          <mat-card-title>{{ product.name }}</mat-card-title>
          <mat-card-subtitle>{{ product.description }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p class="price">R$ {{ product.price | number:'1.2-2' }}</p>
          <p class="stock" [class.low-stock]="product.stockQuantity < 5">
            <mat-icon>inventory</mat-icon>
            Estoque: {{ product.stockQuantity }}
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" (click)="addToCart(product)">
            <mat-icon>add_shopping_cart</mat-icon> Carrinho
          </button>
          <button mat-button (click)="edit(product)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-button color="warn" (click)="delete(product.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .form-card {
      margin-bottom: 24px;
      padding: 16px;
    }
    mat-form-field { width: 100%; margin-bottom: 8px; }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .product-card { height: 100%; }
    .price { font-size: 1.5rem; font-weight: bold; color: #3f51b5; }
    .stock { display: flex; align-items: center; gap: 4px; color: #666; }
    .low-stock { color: #f44336; }
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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.productService.getAll().subscribe({
      next: (res: any) => this.products = res.content || res,
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
      next: () => this.snackBar.open(`${product.name} adicionado ao carrinho!`, 'OK', { duration: 3000 }),
      error: () => this.snackBar.open('Erro ao adicionar ao carrinho', 'OK', { duration: 3000 })
    });
  }
}
