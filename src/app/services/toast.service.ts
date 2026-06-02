import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast$ = new Subject<ToastData>();

  success(message: string): void {
    this.toast$.next({ message, type: 'success' });
  }

  error(message: string): void {
    this.toast$.next({ message, type: 'error' });
  }

  info(message: string): void {
    this.toast$.next({ message, type: 'info' });
  }

  warning(message: string): void {
    this.toast$.next({ message, type: 'warning' });
  }
}
