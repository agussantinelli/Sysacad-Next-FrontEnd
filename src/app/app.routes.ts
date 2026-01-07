import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('@features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('@features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('@features/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'profile/edit',
        loadComponent: () => import('@features/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
    }
];
