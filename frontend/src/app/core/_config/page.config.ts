export class PageConfig {
	public defaults: any = {
			
		'students': {
			page:{
				title: 'Students',
			
			}
		},

		"exams":{
            page:{
				title: 'Exams',
			
			}
		},

		"exampayment":{
            page:{
				title: 'Exams Payment',
			
			}
		},
		
		"allpayment":{
            page:{
				title: 'All Payment',
			
			}
		},

		"terms":{
            page:{
				title: 'Conditions And Terms',
			
			}
		},

		"refund":{
            page:{
				title: 'Refund',
			
			}
		},

		"transfer":{
            page:{
				title: 'Transfer',
			
			}
		},

       "attendance":{
		page:{
			title: 'Attendance',
		
		}
	},

		
		
		
		"payment":{
			page:{
				title:'Payments'
			}
			
		},

		"categories":{
			page:{
				title:'Categories'
			}
			
		},
		"publicPayment":{
			page:{
				title:'General Payment'
			}
			
		},

		"groups":{
			page:{
				title:'Groups',
				"calender":{
					page:{
						title: 'Calender',
					
					}
				},
			}
			
		},
		"assignStudents":{
			page:{
				title:'Assign Students'
			}
			
		}
		
	};

	public get configs(): any {
		return this.defaults;
	}
}
