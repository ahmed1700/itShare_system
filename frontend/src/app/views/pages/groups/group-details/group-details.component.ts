import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
//groups
import { GroupsService } from '../../../../core/auth/_services/group.service';
import { Group } from '../../../../core/auth/_models/group.model';
import { CoursesService } from '../../../../core/auth/_services/courses.service';
import { PaymentsService } from '../../../../core/auth/_services/payment.service'
import { AssignStudent } from '../../../../core/auth/_models/assignStudent.model';
import { Subscription } from 'rxjs';
import { Track } from '../../../../core/auth/_models/Tracks.model';
 
import { TrainersService } from '../../../../core/auth/_services/trainers.service';
import { Trainer } from '../../../../core/auth/_models/Trainers.model';

//branches
import { branchesService } from '../../../../core/auth/_services/branches.service';
import { Student } from '../../../../core/auth/_models/students.model';
 
@Component({
  selector: 'kt-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  groupID;
  group: Group;
  assignStudents: AssignStudent[];
  Coursename;
  allTracks: Track[];
  allTrainers: Trainer[]=[];
  remaining = 0;
  paid = 0;
  assignStudentPayment: any = []
  courseID;
  trainersID;
  branchName
  students:Student []
  private subscriptions: Subscription[] = [];
  constructor(
    private GroupsService: GroupsService,
    private CoursesService: CoursesService,
    private PaymentsService: PaymentsService,
    private trainersService: TrainersService,
    private branchesService: branchesService,
    private activatedRoute:ActivatedRoute
  ) { }
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  ngOnInit() {
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      this.groupID = params['id'];
    })
    const Group = this.GroupsService.getGroupByID(this.groupID).subscribe(res => {
      if (res.result == true) {
        this.group = res.group;
        this.students=res.students
        this.courseID = res.group.courseID
        this.getAllTracks();
        this.getBranckName()
        let trainers = this.group.groupTracks.map(trainer => trainer.trainerID)
        this.trainersID = trainers.filter((a, b) => trainers.indexOf(a) === b)
        this.getAllTrainers();
        let course = this.CoursesService.getCourseByID(res.group.courseID).subscribe(courseres => {
          this.Coursename = courseres.data.courseName;
        })
        this.subscriptions.push(course)
        this.assignStudents = res.assignStudents;
        if (this.assignStudents.length > 0) {
          for (let i = 0; i < this.assignStudents.length; i++) {
            let payment = this.PaymentsService.findRemaining(this.assignStudents[i].assignStudentID).subscribe(remaining => {
              this.remaining = remaining.remaingPayment;
              this.paid = this.assignStudents[i].totalPayment - this.remaining
              this.assignStudentPayment.push({ assignStudent: this.assignStudents[i].assignStudentID, paid: this.paid, remaining: this.remaining })
            })
            this.subscriptions.push(payment)
          }
        }
      }
    })
    this.subscriptions.push(Group);
  }
  getAllTracks() {
    const addSubscription = this.CoursesService.getCourseByID(this.courseID).subscribe(res => {
      if (res.result == true) {
        this.allTracks = res.tracks;
      }

    })
    this.subscriptions.push(addSubscription);
  }
  getBranckName() {
    if (this.group) {
      this.branchesService.getBranchtByID(this.group.branchID).subscribe(res => {
        if (res.result == true) {
          this.branchName = res.data.name;
        }
      })
    }

  }

  getAllTrainers() {
    console.log(this.trainersID)
    if (this.trainersID) {
      this.trainersID.forEach(trainer => {
        let trainers = this.trainersService.getTrainerByID(trainer).subscribe(res => {
          
          if (res.result == true) {
            console.log(res.data)
            this.allTrainers.push(res.data)
          }
        })
        this.subscriptions.push(trainers)
      })
    }
  }
  getTrackName(id) {
    if (this.allTracks) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackName
      }
    }
  }

  getTrainerName(id) {
    if (this.allTrainers) {
      if (this.allTrainers.length > 0) {
        const trainer = this.allTrainers.find(trainer  => trainer.trainerID === id)
        return trainer.fullNameEnglish
      }
    }
  }

  getStudentName(id) {
    if (this.students) {
      if (this.students.length > 0) {
        const student = this.students.find(student  => student.studentID === id)
        return student.fullNameEnglish
      }
    }
  }
  getTrackHours(id) {
    if (this.allTracks) {
      if (this.allTracks.length > 0) {
        const track = this.allTracks.find(track => track.trackID === id)
        return track.trackHours
      }
    }
  }
  getRemianing(id) {
    if (this.assignStudentPayment && this.assignStudentPayment.length > 0) {
      let remeining = this.assignStudentPayment.find(p => p.assignStudent === id)
      return remeining.remaining
    }
  }
  getPaid(id) {
    if (this.assignStudentPayment && this.assignStudentPayment.length > 0) {
      let remeining = this.assignStudentPayment.find(p => p.assignStudent === id)
      return remeining.paid
    }
  }
}
