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
    },
    // Admin Modules
    {
        path: 'admin/certificate-requests',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/reports/reports.component').then(m => m.ReportsComponent)
    },
    {
        path: 'admin/announcements',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/announcements/announcements.component').then(m => m.AnnouncementsComponent)
    },
    {
        path: 'admin/announcements/create',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/announcements/create-announcement/create-announcement.component').then(m => m.CreateAnnouncementComponent)
    },
    {
        path: 'admin/enroll-student',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/enroll-student/enroll-student.component').then(m => m.EnrollStudentComponent)
    },
    {
        path: 'admin/exam-statistics',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/professor/exam-statistics/professor-exam-statistics.component').then(m => m.ProfessorExamStatisticsComponent)
    },
    {
        path: 'admin/careers',
        loadComponent: () => import('@features/admin/careers/admin-careers.component').then(m => m.AdminCareersComponent)
    },
    {
        path: 'admin/carreras/:carreraId/plan/:anio',
        loadComponent: () => import('@features/admin/plan-detail/plan-detail.component').then(m => m.AdminPlanDetailComponent)
    },
    {
        path: 'admin/universities',
        loadComponent: () => import('@features/admin/universities/admin-universities.component').then(m => m.AdminUniversitiesComponent)
    },
    {
        path: 'admin/study-plans',
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'admin/commissions',
        loadComponent: () => import('@features/admin/commissions/admin-commissions.component').then(m => m.AdminCommissionsComponent)
    },
    {
        path: 'admin/subjects',
        loadComponent: () => import('@shared/components/construction/construction.component').then(m => m.ConstructionComponent)
    },
    {
        path: 'admin/users',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/users/users.component').then(m => m.UsersComponent)
    },
    {
        path: 'admin/users/create',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
    },
    {
        path: 'admin/users/edit/:id',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
    },
    {
        path: 'admin/profile/:id',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/user-profile/admin-user-profile.component').then(m => m.AdminUserProfileComponent)
    },
    {
        path: 'admin/inscriptions',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/inscriptions/admin-inscriptions.component').then(m => m.AdminInscriptionsComponent)
    },
    {
        path: 'admin/inscriptions/create',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/inscriptions/inscription-form/inscription-form.component').then(m => m.InscriptionFormComponent)
    },
    {
        path: 'admin/statistics',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/admin/statistics/admin-statistics.component').then(m => m.AdminStatisticsComponent)
    },
    {
        path: 'admin/exam-tables',
        loadComponent: () => import('@features/admin/exam-tables/admin-exam-tables.component').then(m => m.AdminExamTablesComponent)
    },
    {
        path: 'admin/exam-tables/:id',
        loadComponent: () => import('@features/admin/exam-tables/exam-turn-detail/admin-detail-exam-tables.component').then(m => m.AdminDetailExamTablesComponent)
    },
    {
        path: 'admin/calendar',
        canActivate: [requireAuthGuard],
        loadComponent: () => import('@features/student/calendar/calendar.component').then(m => m.CalendarComponent)
    },
];
