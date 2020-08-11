// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';
import { TrainerGuard } from './core/auth/_guards/trainer.guard';
import { AdminGuard } from './core/auth/_guards/admin.guard';

const routes: Routes = [
	{ path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
	{
		canActivate: [TrainerGuard],
		path: 'trainergroups',
		loadChildren: () => import('./views/pages/trainergroups/trainergroups.module').then(m => m.TrainergroupsModule)
	},

	{
		path: '',
		component: BaseComponent,
        canActivate: [AuthGuard],
		children: [

			{
				path: 'vacations',
				loadChildren: () => import('./views/pages/vacations/vacations.module').then(m => m.VacationsModule),
				canActivate:[AdminGuard]
			},
			{

				path: 'providers',
				loadChildren: () => import('./views/pages/providers/providers.module').then(m => m.ProvidersModule)
			},
			{

				path: 'courses',
				loadChildren: () => import('./views/pages/courses/courses.module').then(m => m.CoursesModule)
			},
			{

				path: 'assignStudents',
				loadChildren: () => import('./views/pages/assign-student/assign-student.module').then(m => m.AssignStudentModule)
			},
			{

				path: 'payment',
				loadChildren: () => import('./views/pages/payment/payment.module').then(m => m.PaymentModule)
			},
			{

				path: 'allpayment',
				loadChildren: () => import('./views/pages/all-payment/all-payment.module').then(m => m.AllPaymentModule),
				canActivate:[AdminGuard]
			},

			{

				path: 'transfer',
				loadChildren: () => import('./views/pages/transfer/transfer.module').then(m => m.TransferModule)
			},
			{

				path: 'terms',
				loadChildren: () => import('./views/pages/conditions-terms/conditions-terms.module').then(m => m.ConditionsTermsModule),
				canActivate:[AdminGuard]
			},

			{

				path: 'refund',
				loadChildren: () => import('./views/pages/refund/refund.module').then(m => m.RefundModule)
			},

			{

				path: 'attendance',
				loadChildren: () => import('./views/pages/attendance/attendance.module').then(m => m.AttendanceModule)
			},
			{

				path: 'groups',
				loadChildren: () => import('./views/pages/groups/groups.module').then(m => m.GroupsModule)
			},
			{

				path: 'tracks',
				loadChildren: () => import('./views/pages/tracks/tracks.module').then(m => m.TracksModule)
			},
			{

				path: 'trainers',
				loadChildren: () => import('./views/pages/trainers/trainers.module').then(m => m.TrainersModule)
			},

			{

				path: 'branches',
				loadChildren: () => import('./views/pages/Branches/branches.module').then(m => m.BranchesModule),
				canActivate:[AdminGuard]
			},
			{

				path: 'exams',
				loadChildren: () => import('./views/pages/exams/exams.module').then(m =>m.ExamsModule)
			},
			{

				path: 'publicPayment',
				loadChildren: () => import('./views/pages/public-payment/public-payment.module').then(m =>m.PublicPaymentModule)
			},
			{

				path: 'categories',
				loadChildren: () => import('./views/pages/categories/categories.module').then(m =>m.CategoriesModule),
				canActivate:[AdminGuard]
			},

			{

				path: 'students',
				loadChildren: () => import('./views/pages/students/students.module').then(m => m.StudentsModule)
			},
			{

				path: 'employees',
				loadChildren: () => import('./views/pages/employees/employees.module').then(m => m.EmployeesModule),
	
			},
			{

				path: 'exampayment',
				loadChildren: () => import('./views/pages/exam-payment/exam-payment.module').then(m => m.ExamPaymentModule)
			},
			{

				path: 'trainerpayment',
				loadChildren: () => import('./views/pages/trainer-receivables/trainer-receivables.module').then(m => m.TrainerReceivablesModule)
			},
			{

				path: 'alternativeAttendant',
				loadChildren: () => import('./views/pages/alternative-attendant/alternative-attendant.module').then(m => m.AlternativeAttendantModule)
			},
			{

				path: 'builder',
				loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{

				path: 'attendance',
				loadChildren: () => import('./views/pages/attendance/attendance.module').then(m => m.AttendanceModule)
			},
			{

				path: 'teachingattendance',
				loadChildren: () => import('./views/pages/teachingattendant/teachingattendant.module').then(m => m.TeachingattendantModule)

			},
			{
				path: 'error/403', 
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'students', pathMatch: 'full' },
			{ path: '**', redirectTo: 'error/403', pathMatch: 'full' }
		]
	},

	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes,{
			preloadingStrategy: PreloadAllModules
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
