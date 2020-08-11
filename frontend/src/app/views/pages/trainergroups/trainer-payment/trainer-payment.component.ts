import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../../../core/auth/_services/group.service';
import { TracksService } from '../../../../core/auth/_services/tracks.service';
import { Track } from '../../../../core/auth/_models/Tracks.model';
import { Group } from '../../../../core/auth/_models/group.model';
@Component({
  selector: 'kt-trainer-payment',
  templateUrl: './trainer-payment.component.html',
  styleUrls: ['./trainer-payment.component.scss']
})
export class TrainerPaymentComponent implements OnInit {

  myPayment = []
  allTracks: Track[] = [];
  groupTracks=[]

  constructor(private groupsService: GroupsService, private TracksService: TracksService, ) { }

  ngOnInit() {

    this.getAllGroups()
  }


  getAllGroups() {
    let trainerID = JSON.parse(localStorage.getItem('currentTrainer')).trainerID;
    this.groupsService.getTrainerPaymentByTrainerID(trainerID).subscribe(res => {
      this.myPayment = res.data;
      console.log(res)
      if (this.myPayment && this.myPayment.length > 0) {
        this.myPayment.forEach(element => {
          element.groupTracks.forEach(track => {
            this.groupTracks.push(track)
            this.TracksService.getTrackByID(track.trackID).subscribe(res => {
              if (res.result == true) {
                this.allTracks.push(res.data)
              }
            })
          })
        })
      }
    })
  }

  getTrackName(id) {
    if (this.allTracks && this.allTracks.length > 0) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackName
      }
    }

  }


	/**
	 * Toggle selection
	 */



  getGroupName(groupTrack) {
    let group = this.myPayment.find(P=>P.groupTracks.includes(groupTrack))
    return group.groupName
  }

}
