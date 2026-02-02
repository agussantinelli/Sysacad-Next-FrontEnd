import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '@shared/components/theme-toggle.component';
import { HealthService } from '@core/services/health.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ThemeToggleComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Sysacad-Next-FrontEnd';
  private healthService = inject(HealthService);
  public authService = inject(AuthService);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.healthService.startMonitoring();
      } else {
        this.healthService.stopMonitoring();
      }
    });
  }
}
