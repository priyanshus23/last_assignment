import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ArticleService } from './article.service';
import { Article } from './article';
import { JsonPipe } from '@angular/common';

@Component({
   selector: 'app-article',
   templateUrl: './article.component.html',
   styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
   //Component properties
   allArticles: Article[];
   createarticles: Article[];
   statusCode: number;
   requestProcessing = false;
   articleIdToUpdate = null;
   processValidation = false;

   //Create form
   	articleForm = new FormGroup({
       title: new FormControl('', Validators.required),
	   category: new FormControl('', Validators.required),
	   description: new FormControl('',Validators.required),
	   BookNO: new FormControl('',Validators.required),
   });
   //create second form
   articleForm2 = new FormGroup({
	getID: new FormControl('', Validators.required)
   });
   //Create constructor to get service instance
   constructor(private articleService: ArticleService) {
   }
   //Create ngOnInit() and and load articles
   ngOnInit(): void {
	   this.getAllArticles();
   }
   //Fetch all articles

   getAllArticles() {
		this.articleService.getAllArticles()
		  .subscribe(
                data => this.allArticles = data,
				errorCode =>  this.statusCode = errorCode);

   }
           //hanles the get id article

	loadArticleByID(articleId: string) {
		console.log("IN COMPONENT");
		this.articleService.getArticleById(this.articleForm2.value.getID)
		.subscribe(article => {
			/* JsonPipe{{ article | JSON }} */
			console.log(article);
			alert(JSON.stringify(article));
			this.backToCreateArticle();
			})
		/* subscribe(article => {
			console.log(article, 'loadArticle');
				}) */
				/* this.getAllArticles() */
		
	}
	 onArticleFormSubmit2(articleformid: string) {
		 console.log("IN SUB 2");
		this.processValidation = true;
		if (this.articleForm2.invalid) {
			 return; //Validation failed, exit from method.
		}
		this.preProcessConfigurations();
		let article = this.articleForm2.value;

		 //shoots loadArticleByID
		this.loadArticleByID(articleformid);

		//this.loadArticleToEdit(article.id);
		 }
   //Handle create and update article
   onArticleFormSubmit() {
	  this.processValidation = true;
	  if (this.articleForm.invalid) {
	       return; //Validation failed, exit from method.
	  }
	  //Form is valid, now perform create or update
      this.preProcessConfigurations();
	  let article = this.articleForm.value;
	  if (this.articleIdToUpdate === null) {
	    //Generate article id then create article
        this.articleService.getAllArticles()
	     .subscribe(articles => {

		   //Generate article id
		   const maxIndex = articles.length - 1;
		   const articleWithMaxIndex = articles[maxIndex];
		   const articleId = articleWithMaxIndex.id + 1;
		   article.id = articleId;
		   console.log(article, 'this is form data---');
		   //Create article
     	   this.articleService.createArticle(article)
			  .subscribe(successCode => {
					this.statusCode = successCode;
					this.getAllArticles();
					this.backToCreateArticle();
				 },
				 errorCode => this.statusCode = errorCode
			   );
		 });
	  } else {
   	    //Handle update article
        article.id = this.articleIdToUpdate;
	    this.articleService.updateArticle(article)
	      .subscribe(successCode => {
		            this.statusCode = successCode;
				    this.getAllArticles();
					this.backToCreateArticle();
			    },
		        errorCode => this.statusCode = errorCode);
	  }
   }
   //Load article by id to edit
   loadArticleToEdit(articleId: string) {
	   console.log("ArticleID>>", articleId);
      this.preProcessConfigurations();
      this.articleService.getArticleById(articleId)
	      .subscribe(article => {
			console.log(article, 'poiuytre');
		            this.articleIdToUpdate = article.id;
					this.articleForm.setValue({ title: article.title, category: article.category, description: article.description, BookNO: article.BookNO });
					this.processValidation = true;
					this.requestProcessing = false;
		        },
		        errorCode =>  this.statusCode = errorCode);
   }
   //Delete article
   deleteArticle(articleId: string) {
      this.preProcessConfigurations();
      this.articleService.deleteArticleById(articleId)
	      .subscribe(successCode => {
		            //this.statusCode = successCode;
					//Expecting success code 204 from server
					this.statusCode = 204;
				    this.getAllArticles();
				    this.backToCreateArticle();
			    },
		        errorCode => this.statusCode = errorCode);
   }
   //Perform preliminary processing configurations
   preProcessConfigurations() {
      this.statusCode = null;
	  this.requestProcessing = true;
   }
   //Go back from update to create
   backToCreateArticle() {
      this.articleIdToUpdate = null;
      this.articleForm.reset();
	  this.processValidation = false;
   }

}