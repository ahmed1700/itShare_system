export class Employee
{
    employeeID: number;
    fullNameArabic:string;
    fullNameEnglish:string;
    nationalID:string;
    homeTel:string;
    mobile1 :string;
    mobile2 :string;
    email:string;
    gender:string;
    city :string;
    address :string;
    status:string;
    branchID:number;
    password:string;
    role:string;
    salary:string;
    clear() {
       this.employeeID=0;
       this.fullNameArabic='';
       this.fullNameEnglish='';
       this.nationalID='';
       this.mobile1 ='';
       this.mobile2 ='';
       this.email='';
       this.gender='';
       this.city ='';
       this.address ='';
       this.status ='';
       this.homeTel ='';
       this.branchID=0;
      this.password='';
      this.role='';
      this.salary=''
    }

}