export class GroupSchedule{
    days:String;
    Hourfrom:String;
    Hourto:String;
}

export class groupTracks{
    trackID:number;
    trainerID:number;
    trackHistory:Date[];
    trackStartDate:String
    trackEndDate:String
    trainerPricePerHour:number;
}

export class Group {
    employeeID: number;
    courseID: number;
    branchID: number;
    groupName: String;
    groupSchedule:GroupSchedule [];
    groupTracks:groupTracks [];
    groupStartDate:String;
    cousreHistory:Date[];
    class: String;
    groupType: String;
    groupStatus: String;
    groupEndDate:String
    groupID: number;
    clear() {
        this.employeeID = 0;
        this.courseID = 0;
        this.branchID= 0;
        this.groupName = ''; 
        this.groupSchedule=[{
            days:'',
            Hourfrom:'',
            Hourto:'',
        }];
        this.groupTracks=[{
            trackID:0,
            trainerID:0,
            trackHistory:[],
            trackStartDate:'',
            trackEndDate:'',
            trainerPricePerHour:0,
        }]
        this.class= ''; 
        this.groupType= ''; 
        this.groupStatus= ''; 
        this.groupEndDate= ''; 
        this.groupID= 0;
        
    }
}