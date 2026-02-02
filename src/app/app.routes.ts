import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: [] // Guard handles redirect
    },
    {
        path: 'login',
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
    },
    {
        path: 'profile/change-password',
        loadComponent: () => import('@features/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent)
    },
    // Academic Modules
    {
        path: 'academic/inscription-course',
        loadComponent: () => import('@features/student/inscription-course/inscription-course.component').then(m => m.InscriptionCourseComponent)
    },
    {
        path: 'academic/inscription-exam',
        loadComponent: () => import('@features/student/inscription-exam/inscription-exam.component').then(m => m.InscriptionExamComponent)
    },
    {
        path: 'academic/my-inscriptions',
        loadComponent: () => import('@features/student/my-inscriptions/my-inscriptions.component').then(m => m.MyInscriptionsComponent)
    },
    {
        path: 'academic/status',
        loadComponent: () => import('@features/student/academic-status/academic-status.component').then(m => m.AcademicStatusComponent)
    },
    {
        path: 'academic/plan',
        loadComponent: () => import('@features/student/study-plan/study-plan.component').then(m => m.StudyPlanComponent)
    },
    {
        path: 'academic/current-enrollments',
        loadComponent: () => import('@features/student/current-enrollments/current-enrollments.component').then(m => m.CurrentEnrollmentsComponent)
    },
    // Placeholders temporales
    {
        path: 'academic/history',
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'academic/correlatives-course',
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'academic/correlatives-exam',
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'academic/calendar',
        loadComponent: () => import('@features/student/calendar/calendar.component').then(m => m.CalendarComponent)
    },
    {
        path: 'procedures/regular-cert',
        loadComponent: () => import('@features/student/regular-cert/regular-cert.component').then(m => m.RegularCertComponent)
    },
    {
        path: 'announcements',
        loadComponent: () => import('@features/announcements/announcements.component').then(m => m.AnnouncementsComponent)
    },
    {
        path: 'messages',
        loadComponent: () => import('@features/messages/messages.component').then(m => m.MessagesComponent)
    }
];
