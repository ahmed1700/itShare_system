// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';

import { currentUser, Logout, User } from '../../../../../core/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;
    _user
	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	
	constructor(private route:Router) {
	 
		 
	}

	ngOnInit(){
		this._user=  (JSON.parse(localStorage.getItem('currentUser')).fullNameEnglish)
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	
	/**
	 * Log out
	 */
	logout() {

		localStorage.clear();
	
		if(JSON.parse(localStorage.getItem('currentTrainer')))
		 {
			
			this.route.navigate(['/auth/trainerlogin'])
		 }
		 else
		 {
		 this.route.navigate(['/auth/login'])
		 }

	} 

	myProfile(){

		if(JSON.parse(localStorage.getItem('currentUser')).role=='Admin')
		 {
			
			this.route.navigate([`/employees/edit/${JSON.parse(localStorage.getItem('currentUser')).employeeID}`])
		 }
		 else
		 {
		 this.route.navigate(['/employees'])
		 }

	}
}
