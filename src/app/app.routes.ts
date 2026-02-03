import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { requireAuthGuard } from '@core/guards/require-auth.guard';

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
        path: 'forgot-password',
        loadComponent: () => import('@features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'dashboard',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'profile',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'profile/edit',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
    },
    {
        path: 'profile/change-password',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent)
    },
    // Academic Modules
    {
        path: 'academic/inscription-course',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/inscription-course/inscription-course.component').then(m => m.InscriptionCourseComponent)
    },
    {
        path: 'academic/inscription-exam',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/inscription-exam/inscription-exam.component').then(m => m.InscriptionExamComponent)
    },
    {
        path: 'academic/my-inscriptions',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/my-inscriptions/my-inscriptions.component').then(m => m.MyInscriptionsComponent)
    },
    {
        path: 'academic/status',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/academic-status/academic-status.component').then(m => m.AcademicStatusComponent)
    },
    {
        path: 'academic/plan',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/study-plan/study-plan.component').then(m => m.StudyPlanComponent)
    },
    {
        path: 'academic/current-enrollments',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/current-enrollments/current-enrollments.component').then(m => m.CurrentEnrollmentsComponent)
    },
    // Placeholders temporales
    {
        path: 'academic/history',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'academic/correlatives-course',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'academic/correlatives-exam',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'academic/calendar',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/calendar/calendar.component').then(m => m.CalendarComponent)
    },
    {
        path: 'procedures/regular-cert',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/regular-cert/regular-cert.component').then(m => m.RegularCertComponent)
    },
    {
        path: 'announcements',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/announcements/announcements.component').then(m => m.AnnouncementsComponent)
    },
    {
        path: 'messages',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/messages/messages.component').then(m => m.MessagesComponent)
    },
    // Professor Modules
    {
        path: 'professor/subjects',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/subjects/professor-subjects.component').then(m => m.ProfessorSubjectsComponent)
    },
    {
        path: 'professor/commissions/:idMateria',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/subject-commissions/subject-commissions.component').then(m => m.SubjectCommissionsComponent)
    },
    {
        path: 'professor/commissions/:idComision/subjects/:idMateria/grading',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/grade-commission/professor-grade-commission.component').then(m => m.ProfessorGradeCommissionComponent)
    },

    {
        path: 'professor/my-commissions',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/my-commissions/my-commissions.component').then(m => m.MyCommissionsComponent)
    },
    {
        path: 'professor/exams',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/exams/professor-exams.component').then(m => m.ProfessorExamsComponent)
    },
    {
        path: 'professor/exams/:idMesa',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/exam-details/professor-exam-details.component').then(m => m.ProfessorExamDetailsComponent)
    },
    {
        path: 'professor/exams/:idMesa/grading/:nroDetalle',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/grade-exam/professor-grade-exam.component').then(m => m.ProfessorGradeExamComponent)
    },
    {
        path: 'professor/exam-statistics',
        loadComponent: () => import('@features/professor/exam-statistics/professor-exam-statistics.component').then(m => m.ProfessorExamStatisticsComponent)
    },
    {
        path: 'professor/professor-cert',
        loadComponent: () => import('@features/professor/professor-cert/professor-cert.component').then(m => m.ProfessorCertComponent)
    }
];
