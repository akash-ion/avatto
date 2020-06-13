import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  url: string = 'https://avatto.in/wp-json/avatto/v2';
  constructor(public http: HttpClient,public api: ApiService) { }

  get(endpoint: string, params?: any, reqOpts?: any) {
	  
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
  

  getQuestions(){
    let questionLlist = [];
    let seq = this.get('quiz/178', '');
    // don't have the data yet
    return new Promise(resolve => {
      seq.subscribe((res: any) => {
        questionLlist.push(res);
        resolve(questionLlist);
      }, err => {
        console.error('ERROR', err);
      });
    });
  }
  
  getTimer() {
    
    let tagUserLlist = [];
    let seq = this.get('getTimer.php', '');
    // don't have the data yet
    return new Promise(resolve => {
      seq.subscribe((res: any) => {
        tagUserLlist.push(res);
        resolve(tagUserLlist);
      }, err => {
        console.error('ERROR', err);
      });
    });
  }

  submitQuiz(params: any){
    let seq = this.post('save_answer', params);

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  /*getTimer(flag : any){
    let tagUserLlist = [];
    let seq = this.get('getTimer.php?flag='+flag, '');
    return new Promise(resolve => {
      seq.subscribe((res: any) => {
        tagUserLlist.push(res);
        resolve(tagUserLlist);
      }, err => {
        console.error('ERROR', err);
      });
    });
    //return flag;
  } */
}
