

export class Trainer
{
    employeeID: number;
    fullNameArabic:string;
    fullNameEnglish:string;
    nationalID:string;
    mobile1 :string;
    mobile2 :string;
    email:string;
    gender:string;
    city :string;
    address :string;
    contractType :string;
    trainerID: number;
    password:string;
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
       this.contractType ='';
       this.trainerID=0;
       this.password=''
    }

}