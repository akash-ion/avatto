import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { QuizService } from '../../api/quiz.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {
  @ViewChild('coundown') coundown: ElementRef;
  @ViewChild('submitQuizId') submitQuizId: ElementRef;
  @ViewChild('myDivElementRef') myDivElementRef: ElementRef;
  interval: any;
  timeout: any;
  startQz : any = '';
  timer : any = '';
  nextBtnActive : any = "false";
  questionList : any = JSON.parse(localStorage.getItem("question"))?JSON.parse(localStorage.getItem("question")):[];
  lStart : any = parseInt(localStorage.getItem('lStart'))?parseInt(localStorage.getItem('lStart')):0;
  lEnd : any = parseInt(localStorage.getItem('lEnd'))?parseInt(localStorage.getItem('lEnd')):this.lStart + 1;
  buttonValue = 0;
  postAns : any = JSON.parse(localStorage.getItem("postAns"))?JSON.parse(localStorage.getItem("postAns")):{};
  questionNum : any = 'question_num_tal saveActivated';
  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public quiz: QuizService,
    private el: ElementRef,
    private router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit() {

  }

  async startQuiz(){
    if(this.questionList.length <= 0){
      let loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });
      loading.present();
      this.quiz.getQuestions().then(data => {
        loading.dismiss();
        let item = data[0];
        this.timer = item['time_of_quiz'];
        localStorage.setItem("totalTime",item['time_of_quiz']);
        localStorage.setItem("question",JSON.stringify(item.question));
        this.questionList = JSON.parse(localStorage.getItem("question"));
        this.startQz = "quiz started";
        this.startTimer(this.timer);
      });
    }  else {
      var i = 0;
      this.timer = localStorage.getItem('timer')
      this.startQz = "quiz started";
      this.startTimer(this.timer);
      this.timeout = setTimeout(() => {
        for(var key in this.postAns){
            let className = ".questionNum"+i;
            const btnElement = (<HTMLElement>this.el.nativeElement).querySelector(className);
            if(this.postAns[key]['markReviewd'] == 'true'){
                this.renderer.setStyle(
                btnElement,
                'background-color',
                '#ec4908'
                );
            }else if(this.postAns[key]['markReviewd'] == 'false'){
                this.renderer.setStyle(
                btnElement,
                'background-color',
                '#59ad19'
                );
            }else {
                this.renderer.setStyle(
                btnElement,
                'background-color',
                '#7c58b8'
                );
            }
            i++;
        }
    }, 100);      
    }
  }

  prevQuestion(){
    if(this.lEnd > 1){
      this.lEnd = parseInt(this.lEnd) - 1;
      this.lStart = parseInt(this.lEnd) - 1;
      localStorage.setItem('lStart',this.lStart);
      localStorage.setItem('lEnd',this.lEnd);
      this.buttonValue = 0;
      this.nextBtnActive = "false";
    }
  }

  gotoQuestionNo(questionId,qsNo){
    this.lStart = qsNo;
    this.lEnd = parseInt(qsNo)+1;
    if(this.postAns[qsNo]){
      this.buttonValue = this.postAns[qsNo]['choice'];
    }
    let i = 0;
    while(i<=qsNo){     
      if(!this.postAns[i]){
        let className = ".questionNum"+i;
        const btnElement = (<HTMLElement>this.el.nativeElement).querySelector(className); 
        this.renderer.setStyle(
          btnElement,
          'background-color',
          '#EC1707'
        );
      }
      i++;
    }
  }

  selectAnswer(params, questionId,rightChoice,selector){
    let qsAns = {};
    qsAns['choice'] = params;
    qsAns['id'] = questionId;
    qsAns['rightChoice'] = rightChoice;
    this.postAns[selector] = qsAns;
    localStorage.setItem("postAns",JSON.stringify(this.postAns));
    this.buttonValue = params;
    this.nextBtnActive = "true";
  }

  nextQuestion(questionId,params : number){
    let className = '';
    if(this.lStart < this.questionList.length-1){
      className = ".questionNum"+params;
      this.postAns[params]['markReviewd'] = "false";
      localStorage.setItem("postAns",JSON.stringify(this.postAns));
      this.lStart = params + 1;
      this.lEnd = this.lStart + 1;
      this.buttonValue = 0;
      localStorage.setItem('lStart',this.lStart);
      localStorage.setItem('lEnd',this.lEnd);
      this.nextBtnActive = "false";    
    } else {
      className = ".questionNum"+this.lStart;
    }
    
    const btnElement = (<HTMLElement>this.el.nativeElement).querySelector(className);
    this.renderer.setStyle(
      btnElement,
      'background-color',
      '#59ad19'
    );
  }

  markQuestion(questionId,params: number){
    let className = '';
    if(this.lStart < this.questionList.length-1){   
      className = ".questionNum"+params;  
      this.lStart = params + 1;
      this.lEnd = this.lStart + 1;
      this.buttonValue = 0;
      localStorage.setItem('lStart',this.lStart);
      localStorage.setItem('lEnd',this.lEnd);
      this.nextBtnActive = "false"; 
    } else {
      className = ".questionNum"+this.lStart;
    }   
    const btnElement = (<HTMLElement>this.el.nativeElement).querySelector(className);
    if(this.postAns[params]){
      this.postAns[params]['markReviewd'] = "true";
      localStorage.setItem("postAns",JSON.stringify(this.postAns));
      this.renderer.setStyle(
        btnElement,
        'background-color',
        '#ec4908'
      );
    } else {
      let qsAns = {};
      qsAns['markReviewd'] = "notanswerd";
      qsAns['id'] = questionId;
      this.postAns[params] = qsAns;
      localStorage.setItem("postAns",JSON.stringify(this.postAns));
      this.renderer.setStyle(
        btnElement,
        'background-color',
        '#7c58b8'
      );
    }
  }

  async submitQuiz(){
    let loading = await this.loadingCtrl.create({
			cssClass: 'my-custom-class',
			message: 'Please wait...',
		});
    loading.present();
    const ansSheet = {};
    ansSheet['ansSheet'] = this.postAns;
    loading.dismiss();	
    this.router.navigate(['/result'])

    this.quiz.submitQuiz(ansSheet).subscribe(async (resp) => {
        loading.dismiss();	
        this.questionList = [];
        localStorage.clear();
        const toast = await this.toastCtrl.create({
            message: 'Answer has been submitted.',
            duration: 2000
        });
        toast.present();
    }, async (err) => {
        loading.dismiss();		
        const toast = await this.toastCtrl.create({
            message: 'failed to upload.',
            duration: 2000
        });
        toast.present();
    });
  }

  startTimer(duration) {
    var timer = duration, minutes, seconds;
    let coundownHtml = this.coundown;
    this.interval = setInterval(() => {
        minutes = parseInt(timer) / parseInt("60", 10);
        seconds = parseInt(timer) % parseInt("60", 10);

        minutes = Math.floor(minutes) < 10 ? "0" + Math.floor(minutes) : Math.floor(minutes);
        seconds = seconds < 10 ? "0" + seconds : seconds;

        coundownHtml.nativeElement.innerHTML = Math.floor(minutes) + ":" + seconds;
        localStorage.setItem('timer',timer);
        if (--timer < 0) {
            timer = duration;
            this.submitQuiz();
            clearInterval(this.interval);
        } 
      
    }, 1000);
  }

}
