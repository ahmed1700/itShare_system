export class Branch {
    branchID: number;
    name: string;
    address: string;
    details: string;
    homeTel1: string;
    homeTel2: string;
    mobile1: string;
    mobile2:string;
    email: string;
    ip: string;
    ip2: string;
    ip3: string;
    clear() {
        this.branchID = 0;
        this.name = '';
        this.address = '';
        this.details = '';
        this.homeTel1 = '';
        this.homeTel2 = '';
        this.mobile1 = '';
        this.mobile2 = '';
        this.email = '';
        this.ip = '';
        this.ip2 = '';
        this.ip3 = '';
    }
}