export class Student {
    employeeID: number;
    branchID:number;
    fullNameArabic: string;
    fullNameEnglish: string;
    nationalID: string;
    mobile1: string;
    mobile2: string;
    email: string;
    gender: string;
    studentsType: string;
    city: string;
    address: string;
    studentID: number;
    password:string;
    clear() {
        this.employeeID = 0;
        this.branchID=0;
        this.fullNameArabic = '';
        this.fullNameEnglish = '';
        this.nationalID = '';
        this.mobile1 = '';
        this.mobile2 = '';
        this.email = '';
        this.gender = '';
        this.studentsType = '';
        this.city = '';
        this.address = '';
        this.studentID = 0;
        this.password=''
    }
}