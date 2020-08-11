export class Tracks{
    trackID:Number
}

export class AssignStudent {
    employeeID: number;
    studentID: number;
    groupID: number;
    courseID: number;
    courseTracks:Tracks [];
    totalPayment:number;
    branchID:number;
    creationDate:Date;
    assignStudentID:number;
    status:string;
    clear() {
        this.employeeID = 0;
        this.studentID = 0;
        this.groupID= 0;
        this.courseID = 0; 
        this.courseTracks=[{trackID:0}];
        this.totalPayment=0;
        this.branchID=0;
        this.status='';
        
    }
}