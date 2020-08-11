
// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
 // student
import {TracksService} from '../../../../core/auth/_services/tracks.service';
import {Track} from   '../../../../core/auth/_models/Tracks.model';

@Component({
  selector: 'kt-tracks-list',
  templateUrl: './tracks-list.component.html',
})
export class TracksListComponent implements OnInit,OnDestroy {
 // Table fields
 dataSource: MatTableDataSource<any>;
 displayedColumns = ['select', 'trackID','trackName','trackHours','price','actions'];
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 @ViewChild(MatSort, {static: true}) sort: MatSort;
 // Selection
 selection = new SelectionModel<Track>(true, []);
 tracksResult: Track[]=[] ;
 // Subscriptions
 private subscriptions: Subscription[] = [];

  constructor(
    private tracksService:TracksService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
    private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
      this.loadTracksList();
      this.subheaderService.setTitle('Tracks');
    }
    ngOnDestroy() {
      this.subscriptions.forEach(el => el.unsubscribe());
    }
  
   
    loadTracksList() {
      this.selection.clear();
      const addSubscription =this.tracksService.getTracks().subscribe((res)=>{
          if(res.result==true){
            this.tracksResult=res.data;
            this.dataSource=new MatTableDataSource<Track>(this.tracksResult);
            this.dataSource.sort=this.sort;
            this.dataSource.paginator=this.paginator;
            this.cdr.detectChanges();
          }
       }) 
      this.selection.clear();
      this.subscriptions.push(addSubscription);
    }
    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    fetchTracks() {
      const messages = [];
      this.selection.selected.forEach(elem => {
        messages.push({
          text: `trackOutline:${elem.trackOutline}`,
          id: elem.trackID.toString(),
        });
      });
      this.layoutUtilsService.fetchElements(messages);
    }
  
    /**
     * Check all rows are selected
     */
    isAllSelected(): boolean {
      const numSelected = this.selection.selected.length;
      const numRows = this.tracksResult.length;
      return numSelected === numRows;
    }
  
    /**
     * Toggle selection
     */
    masterToggle() {
      if (this.selection.selected.length === this.tracksResult.length) {
        this.selection.clear();
      } else {
        this.tracksResult.forEach(row => this.selection.select(row));
      }
    }
  
    /* UI */
    /**
     * Returns Student roles string
     *
     
     *
     * @param id
     */
    editTrack(id) {
      this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
    }
  
  
  
}
