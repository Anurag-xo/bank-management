import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastData } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  visible = false;
  message = '';
  type: 'success' | 'error' | 'info' | 'warning' = 'success';
  private sub!: Subscription;
  private timer: any;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe((data: ToastData) => {
      this.message = data.message;
      this.type = data.type;
      this.visible = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.visible = false, 3500);
    });
  }

  close(): void {
    this.visible = false;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearTimeout(this.timer);
  }
}
