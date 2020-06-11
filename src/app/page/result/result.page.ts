import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  postAns : any = JSON.parse(localStorage.getItem("postAns"))?JSON.parse(localStorage.getItem("postAns")):{};
  questionList : any = JSON.parse(localStorage.getItem("question"))?JSON.parse(localStorage.getItem("question")):[];

  resultSheet : any = [];
  shortResult : any = [];
  constructor() { 
    
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    let correctChoiceCount : number = 0,incorrectChoiceCount : number = 0,unattended : number = 0 ,timeTaken,score;
    for(var key in this.questionList){
      let result = {};
      result['questionName'] = this.questionList[key]["name"];
      if(typeof this.postAns[key] === 'undefined'){
        result['userChoice'] = "N/A";
        result['correctChoice'] = "N/A";     
        unattended++  
      } else {
        if(this.postAns[key]["markReviewd"] == "notanswerd"){
          result['userChoice'] = "N/A";
          result['correctChoice'] = "N/A";
          unattended++       
        } else {
          result['userChoice'] = this.postAns[key]["choice"];
          result['correctChoice'] = this.postAns[key]["rightChoice"];
          if(result['userChoice'] == result['correctChoice']){
            correctChoiceCount++;
          } else {
            incorrectChoiceCount++
          }
        }       
      }
      this.resultSheet[key] = result;
    }
    this.shortResult['totQuestion'] = this.questionList.length;
    this.shortResult['correctChoiceCount'] = correctChoiceCount;
    this.shortResult['incorrectChoiceCount'] = incorrectChoiceCount;
    this.shortResult['unattended'] = unattended;
    this.shortResult['timeTaken'] = this.timeConversion();
  }
  
  timeConversion(){
    let totSec = parseInt(localStorage.getItem("totalTime")) - parseInt(localStorage.getItem('timer'));
    return totSec;
  }

}
