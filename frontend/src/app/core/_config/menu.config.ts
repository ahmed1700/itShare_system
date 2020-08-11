
export class MenuConfig {
	filteredMenu: [];
	public defaults: any = {
		header: {
			self: {},
			items: [],

		},
		aside: {
			self: {},
			items: [

				{
					title: 'Students',
					root: true,
					icon: 'flaticon-network',
					bullet: 'dot',
					submenu: [
						{
							title: 'Students',
							page: '/students'
						},
						{
							title: 'Assign Students',
							page: '/assignStudents'
						},
						{
							title: 'Groups',
							page: '/groups',
						},
						{
							title: 'Alternative Attendant',
							page: '/alternativeAttendant',
						},
						{
							title: 'Calender',
							page: '/groups/calender',
						},
					]
				},
				{
					title: 'Courses',
					root: true,
					icon: 'flaticon-laptop',
					bullet: 'dot',
					submenu: [
						{
							title: 'Courses',
							page: '/courses',
						},
						{
							title: 'Tracks',
							page: '/tracks',
						},

						{
							title: 'providers',
							page: '/providers',
						},

						{
							title: 'Exams',
							page: '/exams',
						},
					]
				}, 

				{
					title: 'Adminstator',
					root: true,
					icon: 'flaticon-medal',
					bullet: 'dot',
					submenu: [
						{
							title: 'Branches',
							page: '/branches',
						},
						{
							title: 'vacations',
							page: '/vacations',
						},
						{
							title: 'Conditions And Terms',
							page: '/terms',
						},
						{
							title: 'Categories',
							page: '/categories',
						},
						{
							title: 'Employees',
							page: '/employees',
						},
					]
				},


				{
					title: 'Refund',
					root: true,
					icon: 'flaticon-price-tag',
					bullet: 'dot',
					submenu: [
						{
							title: 'Refund',
							page: '/refund',
						},

						{
							title: 'Transfer',
							page: '/transfer',
						},
					]
				},

				{
					title: 'Reports&Payment',
					root: true,
					icon: 'flaticon-coins',
					bullet: 'dot',
					submenu: [
						{
							title: 'Courses Payment',
							page: '/payment',
						},

						{
							title: 'General Payment',
							page: '/publicPayment',
						},
						{
							title: 'Exams Payment',
							page: '/exampayment',
						},
						{
							title: 'All Payment',
							page: '/allpayment',
						},
					]
				},

				{
					title: 'Trainer',
					root: true,
					icon: 'flaticon-presentation',
					bullet: 'dot',
					submenu: [
						{
							title: 'Trainers',
							page: '/trainers',
						},
						
						{
							title: 'Attendant',
							page: '/attendance',
						},
						{
							title: 'Payments',
							page: '/trainerpayment',
						},
					]
				},
			]
		}
	} 

	public get configs(): any {
		this.checkedpermission();
	    console.log('aaaaaaa',this.defaults)
		return this.defaults;
	}

	checkedpermission() {
		if (JSON.parse(localStorage.getItem('currentUser')).role !== 'Admin') {
			this.FilterMenu('aside', 'Adminstator');
			this.filtersumenu('aside', 'Reports&Payment', 'All Payment');
			
		}
		
	}

	FilterMenu(obj, title) {
		this.defaults[obj].items = this.defaults[obj].items.filter(x => x.title !== title)
			
	}


	filtersumenu(header, title, submenu) {
		this.defaults[header].items.find(x => x.title == title)['submenu'] = this.defaults[header].items.find(x => x.title == title)['submenu'].filter(x => x.title !== submenu)
	}

}
