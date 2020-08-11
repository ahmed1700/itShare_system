

export class AlternativeAttendant{
 groupID:number;
 trainerID:number;
 trackID:number;
 HourFrom:string;
 HourTo:string;
 class:string;
 date:Date;
 alternativeAttendantID:number;
 clear()
 {
     this.groupID=0;
     this.trainerID=0;
     this.trackID=0;
     this.HourFrom='';
     this.HourTo='';
     this.class='';
     this.date=null;
     this.alternativeAttendantID=0;
 }
}