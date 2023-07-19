import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackerService } from './snacker.service';
import jwt_decode from 'jwt-decode';
import { exec } from 'child_process';
import { GlobalConstant } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth:AuthService,
    public router:Router,
    private snackerService: SnackerService) { }

    canActivate(route:ActivatedRouteSnapshot):boolean{
      // debugger;
      let expectedRoleArray = route.data;
      expectedRoleArray= expectedRoleArray.expectedRole;

      const token:any = localStorage.getItem('token');
      var tokenPayload:any;
      try{
        tokenPayload = jwt_decode(token);
      }
      catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let checkRole = false;

      for(let i = 0;i<expectedRoleArray.length; i++){
        if(expectedRoleArray[i] == tokenPayload.role){
          checkRole = true;
        }
      }

      if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
        if(this.auth.isAuthenticated() && checkRole){
          return true;
        }
        this.snackerService.openSnacker(GlobalConstant.unauthorized,GlobalConstant.error);
        this.router.navigate(['/cafe/dashboard']);
        return false; 
      }
        else{
          this.router.navigate(['/']);
          localStorage.clear();
          return false;
        }
      
    }
}
