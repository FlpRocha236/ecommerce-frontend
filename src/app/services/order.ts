import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/v1/orders';

  constructor(private http: HttpClient) {}

  create(customerEmail: string, shippingAddress: string, notes: string): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, {
      customerEmail, shippingAddress, notes
    });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getByCustomer(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/customer/${email}`);
  }

  processPayment(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/pay`, {});
  }

  cancel(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
