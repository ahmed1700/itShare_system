export class provider{
    providerID:number;
    providerName:string;
    providerDesc:string;
    employeeID:number;
    clear()
    {
        this.providerID=0;
        this.employeeID=0;
        this.providerName='';
        this.providerDesc='';
    }
}