// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState} from '../../../core/reducers/';
import { isLoggedIn } from '../_selectors/auth.selectors';
import {AuthService} from '../../../core/auth/_services/auth.service.fake'

@Injectable()
export class TrainerGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router,private auth:AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(!this.auth.trainerLoged())
        {
        
        this.router.navigate(['/students']);
        }
        else
         return true;
    }
}
