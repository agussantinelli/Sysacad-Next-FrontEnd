import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '@shared/components/theme-toggle.component';
import { HealthService } from '@core/services/health.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Sysacad-Next-FrontEnd';
  private healthService = inject(HealthService);
  private authService = inject(AuthService);

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
