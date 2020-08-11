import { Component, OnInit,OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource ,MatSort} from '@angular/material';
// RXJS

import { Subscription } from 'rxjs';

// Services
import { LayoutUtilsService } from '../../../../core/_base/crud';
// Models
import { SubheaderService } from '../../../../core/_base/layout';
 // TeachingAttendance
 import {TeachingAttendantService} from '../../../../core/auth/_services/teachingAttendant';
 import {teachingAttendant} from   '../../../../core/auth/_models/teachingAttendant';
   //groups
 import {GroupsService} from '../../../../core/auth/_services/group.service';
 import {Group} from '../../../../core/auth/_models/group.model';
// Trainers
import {TrainersService} from '../../../../core/auth/_services/trainers.service';
import {Trainer} from '../../../../core/auth/_models/Trainers.model';
// Tracks
import {TracksService} from '../../../../core/auth/_services/tracks.service';
import {Track} from '../../../../core/auth/_models/Tracks.model';
// Courses
import {CoursesService} from '../../../../core/auth/_services/courses.service';
import {Course} from '../../../../core/auth/_models/Courses.model';

@Component({
  selector: 'kt-teachingattendant-list',
  templateUrl: './teachingattendant-list.component.html',
  styleUrls: ['./teachingattendant-list.component.scss']
})
export class TeachingattendantListComponent implements OnInit,OnDestroy {
    // Table fields
    dataSource: MatTableDataSource<teachingAttendant>;
    displayedColumns = ['select', 'teacheingAttendantID','GroupName','TrainerName','TrackName','CourseName','TotalHours','ActualHours', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

	// Selection
	selection = new SelectionModel<teachingAttendant>(true, []);
	teachingAttendanceResult: teachingAttendant[] = [];
  allGroups:Group[]; 
  allTrainers:Trainer[];
  allTrack:Track[];
  allCourses:Course[];
	selectedGroup;  
  selectedTrainer; 
  selectedTrack;
  selectedCourse;

  
  // Subscriptions
  subscriptions:Subscription[]=[];
  constructor(private attendanceTeachingService:TeachingAttendantService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
    private groupService:GroupsService,
    private trainerService:TrainersService,
    private trackServicec:TracksService,
    private courseService:CoursesService,
		private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.getAllGroups();
    this.getAllTrainers();
    this.getAllTracks();
    this.getAllCourses();
    this.loadTeachingAttendanceList();
    	// Set title to page breadCrumbs
		this.subheaderService.setTitle('TeachingAttendance');
  }

  	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
  }
  loadTeachingAttendanceList() {
		this.selection.clear();
	 const teachingAttendances=  this.attendanceTeachingService.GetAllTeachingAttendant().subscribe((res)=>{
        if(res.result==true){
					this.teachingAttendanceResult=res.data;
					this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult);
					this.dataSource.sort=this.sort;
					this.dataSource.paginator=this.paginator;
					this.cdr.detectChanges();
        }
     }) 
		this.selection.clear();
		this.subscriptions.push()
		this.subscriptions.push(teachingAttendances);
  }

  getAllGroups(){
    const groups=	this.groupService.getGroups().subscribe(res=>{
      if(res.result==true){
        this.allGroups=res.data;
      }
        
      })
      this.subscriptions.push(groups)
    }
  getAllTrainers(){
    const trainers=	this.trainerService.getTrainers().subscribe(res=>{
      if(res.result==true){
        this.allTrainers=res.data;
      }
        
      })
      this.subscriptions.push(trainers)
    }
  getAllTracks(){
    const tracks=	this.trackServicec.getTracks().subscribe(res=>{
      if(res.result==true){
        this.allTrack=res.data;
      }
        
      })
      this.subscriptions.push(tracks)
    }
  getAllCourses(){
    const courses=	this.courseService.getCourses().subscribe(res=>{
      if(res.result==true){
        this.allCourses=res.data;
      }
        
      })
      this.subscriptions.push(courses)
    }
    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    fetchِTeachingAttendance() {
      const messages = [];
      this.selection.selected.forEach(elem => {
        messages.push({
          text: `signin:${elem.signin},signOut: ${elem.signOut}`,
          id: elem.teacheingAttendantID.toString(),
        });
      });
      this.layoutUtilsService.fetchElements(messages);
    }
    /*
    * Check all rows are selected
    */
   isAllSelected(): boolean {
     const numSelected = this.selection.selected.length;
     const numRows = this.teachingAttendanceResult.length;
     return numSelected === numRows;
   }
     /**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.teachingAttendanceResult.length) {
			this.selection.clear();
		} else {
			this.teachingAttendanceResult.forEach(row => this.selection.select(row));
		}
  }
  // Filteration Data.
  filterByGroup(){
		if(this.selectedGroup==''){
			this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult)
		}else{
		this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult.filter(p=>
			p.groupID==this.selectedGroup))}
  }
  filterByTrainer(){
		if(this.selectedGroup==''){
			this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult)
		}else{
		this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult.filter(p=>
			p.trainerID==this.selectedTrainer))}
  }
  filterByTrack(){
		if(this.selectedGroup==''){
			this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult)
		}else{
		this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult.filter(p=>
			p.trackID==this.selectedTrack))}
  }
  filterByCourse(){
		if(this.selectedGroup==''){
			this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult)
		}else{
		this.dataSource=new MatTableDataSource<teachingAttendant>(this.teachingAttendanceResult.filter(p=>
			p.courseID==this.selectedCourse))}
	}
}
