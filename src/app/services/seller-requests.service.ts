// src/app/services/seller-requests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SellerRequest {
  id: number;
  userId: number;
  curp: string;
  ineFrontUrl: string;
  ineBackUrl?: string;
  ineFrontPublicId: string;
  ineBackPublicId?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: number;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}

export interface SellerRequestsResponse {
  success: boolean;
  count: number;
  requests: SellerRequest[];
}

export interface ReviewRequestData {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface ReviewRequestResponse {
  success: boolean;
  message: string;
  request: SellerRequest;
}

export interface DeleteRequestResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsService {
  private apiUrl = `${environment.apiUrl}/seller-requests`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las solicitudes (con filtro opcional)
   * GET /seller-requests?status=pending
   */
  getRequests(
    status?: 'pending' | 'approved' | 'rejected' | 'all',
  ): Observable<SellerRequestsResponse> {
    const params: any = {};

    if (status && status !== 'all') {
      params.status = status;
    }

    return this.http.get<SellerRequestsResponse>(this.apiUrl, {
      params,
      withCredentials: true,
    });
  }

  /**
   * Aprobar o rechazar una solicitud
   * PATCH /seller-requests/:id/review
   */
  reviewRequest(id: number, data: ReviewRequestData): Observable<ReviewRequestResponse> {
    return this.http.patch<ReviewRequestResponse>(`${this.apiUrl}/${id}/review`, data, {
      withCredentials: true,
    });
  }

  /**
   * Eliminar una solicitud
   * DELETE /seller-requests/:id
   */
  deleteRequest(id: number): Observable<DeleteRequestResponse> {
    return this.http.delete<DeleteRequestResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
