import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/v1/cart';

  constructor(private http: HttpClient) {}

  addItem(customerEmail: string, productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, {
      customerEmail, productId, quantity
    });
  }

  getCart(email: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${email}`);
  }

  removeItem(email: string, productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${email}/item/${productId}`);
  }

  clearCart(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}/clear`);
  }
}
