

export class Course {
    courseID: number;
    employeeID: number;
    providerID: number;
    courseName: string;
    courseDesc: string;
    discount: number;
    courseHours: number;
    coursePrice: number;
    priceAfterDiscount: number;
    courseTracks: courseTracks[];
    clear() {
        this.courseID = 0;
        this.employeeID = 0;
        this.providerID = 0;
        this.courseName = '';
        this.courseDesc = '';
        this.discount = 0;
        this.courseHours= 0;
        this.coursePrice= 0;
        this.priceAfterDiscount= 0;
        this.courseTracks = [{ trackID: 0 }];
    }
}
export class courseTracks {
    trackID: number;
}
