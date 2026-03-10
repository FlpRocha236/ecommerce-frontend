import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products';
import { CartComponent } from './pages/cart/cart';
import { OrdersComponent } from './pages/orders/orders';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent }
];
