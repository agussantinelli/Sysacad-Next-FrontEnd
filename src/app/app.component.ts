import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { ThemeToggleComponent } from '@shared/components/theme-toggle.component';
import { NavbarComponent } from '@layout/navbar/navbar.component';
import { HealthService } from '@core/services/health.service';
import { AuthService } from '@core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ThemeToggleComponent, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Sysacad-Next-FrontEnd';
  private healthService = inject(HealthService);
  public authService = inject(AuthService);
  private router = inject(Router);

  showNavbar = false;
  private excludedRoutes = ['/login', '/forgot-password', '/profile/change-password'];

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.healthService.startMonitoring();
      } else {
        this.healthService.stopMonitoring();
      }
    });

    // Update navbar visibility on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateNavbarVisibility();
    });

    // Initial check
    this.updateNavbarVisibility();
  }

  private updateNavbarVisibility(): void {
    const currentUrl = this.router.url;
    this.showNavbar = !this.excludedRoutes.some(route => currentUrl.startsWith(route));
  }
}
