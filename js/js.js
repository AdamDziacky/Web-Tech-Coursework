(function(){
    // Functions

    function buildQuiz(){
      // variable to store the HTML output
      const output = [];
  
      // for each question...
      myQuestions.forEach(
        (currentQuestion, questionNumber) => {
  
          // variable to store the list of possible answers
          const answers = [];
  
          // and for each available answer...
          for(letter in currentQuestion.answers){
  
            // ...add an HTML radio button
            answers.push(
              `<label>
                <input type="radio" name="question${questionNumber}" value="${letter}">
                ${letter} :
                ${currentQuestion.answers[letter]}
              </label>`
            );
          }
  
          // add this question and its answers to the output
          if (currentQuestion.att_type == "N/A") {
            output.push(
              `<div class="slide">
                <div class="question"> ${currentQuestion.question} </div>
                <br>
                <div class="answers"> ${answers.join("")} </div>
              </div>`
            );
          }

          if (currentQuestion.att_type == "Image") {
            output.push(
              `<div class="slide">
                <div class="question"> ${currentQuestion.question} </div>
                <img src="${currentQuestion.att}" alt="Question Image" style="width:300px;height:300px;">
                <br>
                <div class="answers"> ${answers.join("")} </div>
              </div>`
            );
          }          

          if (currentQuestion.att_type == "Audio") {
            output.push(
              `<div class="slide">
                <div class="question"> ${currentQuestion.question} </div>
                <br>
                <audio controls>
                  <source src="${currentQuestion.att}" type="audio/mp3">
                  <source src="${currentQuestion.att}" type="audio/mpeg">
                  Your browser does not support the audio element.
                </audio>
                <br>
                <br>
                <div class="answers"> ${answers.join("")} </div>
              </div>`
            );
          }          
        }
      );
  
      // finally combine our output list into one string of HTML and put it on the page
      quizContainer.innerHTML = output.join('');
    }

    function showResults(){

      //close the timer and assign time points for last question
      if (timerId) 
      {     
        // console.log("timeScoreBonus " + timeLeft);
        timeScoreBonuses[myQuestions.length] = timeLeft;
        // console.log(timeScoreBonuses);

        clearInterval(timerId);
      }

      // gather answer containers from our quiz
      const answerContainers = quizContainer.querySelectorAll('.answers');
  
      // keep track of user's answers
      let numCorrect = 0;
      let scoreTotal = 0;
  
      // for each question...
      myQuestions.forEach( (currentQuestion, questionNumber) => {
  
        // find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
  
        // if answer is correct
        if(userAnswer === currentQuestion.correctAnswer){
          // add to the number of correct answers
          numCorrect++;
          console.log("Score bonus for Q" + (questionNumber + 1) + "   " + timeScoreBonuses[(questionNumber + 1)]);

          scoreTotal += (1 + timeScoreBonuses[(questionNumber + 1)]);
          
          // color the answers green
          answerContainers[questionNumber].style.color = 'lightgreen';
        }
        // if answer is wrong or blank
        else{
          // color the answers red
          answerContainers[questionNumber].style.color = 'red';
        }
      });
      
      // show number of correct answers out of total
      
      console.log("Score total: " + scoreTotal);
      resultsContainer.innerHTML = `Your score is: ${scoreTotal} out of ${myQuestions.length * 20}`;
      previousButton.style.display = "none";
      submitButton.style.display = "none";
    }
  
    function showSlide(n) {

      // If there is an interval running, stop it, reset the timeLeft var. 
      
      if (timerId) 
      {     
        console.log("timeScoreBonus " + timeLeft);
        timeScoreBonuses[n] = timeLeft;
        console.log(timeScoreBonuses);

        clearInterval(timerId);
        timeLeft = 20;
        timerId = setInterval(countdown, 1000);
      }
      // If no timer running ,start a new one
      else
      {
        timerId = setInterval(countdown, 1000);
      }

      // changing slides and button visibility
      slides[currentSlide].classList.remove('active-slide');
      slides[n].classList.add('active-slide');
      currentSlide = n;
      if(currentSlide === 0){
        previousButton.style.display = 'none';
      }
      else{
        previousButton.style.display = 'inline-block';
      }
      if(currentSlide === slides.length-1){
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
      }
      else{
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
      }
    }
  
    function showNextSlide() {  
      progress_list[currentSlide].style.textDecoration = "line-through";
      showSlide(currentSlide + 1);

    }
  
    function showPreviousSlide() {
      progress_list[currentSlide - 1].style.textDecoration = "initial";
      showSlide(currentSlide - 1);
    }

    // after clicking start button
    function welcomeMessage()
    {
      // Get users name
      username = document.getElementById('name').value;
      msg = "Hi " + username + ". Do you consider yourself a movie addict / maniac / enthusiast? Many people do but not many of them really are. This is your chance to prove yourself worthy of that nickname. Ahead of you is the series of 10 questions featuring some of most famous movies of all times. The sooner you answer, the more points you get. You have 20 seconds per question to get bonus for fast answer. Are you ready?" 
      document.getElementById('intro').innerHTML = msg;
      
      // Hide the form
      document.getElementById('welcomeForm').style.display = "none";
      document.getElementById('start').style.display = "none";
      document.getElementById('continue').style.display = "inline-block";
    }

    function countdown() {
      if (timeLeft == -1) {
          clearTimeout(timerId);
      } 
      else {
          console.log(timeLeft + ' seconds remaining');
          timeLeft--;
      }
  }

    // after clicking continue button
    function startQuiz()
    {
      showSlide(currentSlide);
      document.getElementById('page-content').style.display = "block";
      continueButton.style.display = 'none';
      nextButton.style.display = 'inline-block';
      document.getElementById('intro').style.display = 'none';
      document.getElementById('welcomeDiv').style.display = 'none';
    }
  
    // Variables

    var timeScoreBonuses = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0
    };

    var timeLeft = 20;
    var timerId;
    var timeScoreBonus = 0;
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const startButton = document.getElementById('start');
    const continueButton = document.getElementById('continue');
    var progress_list = document.getElementsByClassName("progress-ul-li");

    const myQuestions = [
        {
          question: "I am going to make him an offer he can't refuse. <br> In what movie did this line appear?",
          answers: {
            a: "The Godfather",
            b: "Scarface",
            c: "Casino Royale"
          },
          att_type: "N/A",
          correctAnswer: "a"
        },
        {
          question: "Which character said the this line?",
          answers: {
            a: "Frodo Baggins",
            b: "Sauron",
            c: "Gandalf the Grey"
          },
          att_type: "Audio",
          att: "attachments/gandalf_shallnotpass.mp3",
          correctAnswer: "c"
        },
        {
          question: "What is on the picture?",
          answers: {
            a: "Geometrical shapes",
            b: "Deathly Hallows",
            c: "Illuminati sign",
          },
          att_type: "Image",
          att: "attachments/HP_Pic.jpg",
          correctAnswer: "b"
        },
        {
          question: "Which movie takes place in a Gotham City?",
          answers: {
            a: "The Dark Knight",
            b: "Daredevil",
            c: "Suicide Squad",
          },
          att_type: "N/A",
          correctAnswer: "a"
        },
        {
          question: "What is the name of the thing on the picture?",
          answers: {
            a: "Todd",
            b: "Jack",
            c: "Wilson",
          },
          att_type: "Image",
          att: "attachments/Wilson.jpg",
          correctAnswer: "c"
        },
        {
          question: "Ever have that feeling when you're not sure if you're awake or dreaming? <br> What movie did this line appear in?",
          answers: {
            a: "Inception",
            b: "The Matrix",
            c: "Requiem for a Dream",
          },
          att_type: "N/A",
          correctAnswer: "b"
        },
        {
          question: "What was the job of the person saying these words?",
          answers: {
            a: "Headmaster",
            b: "Gamekeeper",
            c: "Auror",
          },
          att_type: "Audio",
          att: "attachments/wizzard.mp3",
          correctAnswer: "b"
        },
        {
          question: "What was the first horrow movie to win an Oscar??",
          answers: {
            a: "The Ring",
            b: "Psycho",
            c: "Silence of the lambs",
          },
          att_type: "N/A",
          correctAnswer: "c"
        },
        {
          question: "In which movie can you find this scene?",
          answers: {
            a: "It's a wonderful life",
            b: "12 Angry Men",
            c: "Casablanca",
          },
          att_type: "Image",
          att: "attachments/Angry_Men.jpg",
          correctAnswer: "b"
        },
        {
          question: "What is the name of the villain in the movie Schindler's List?",
          answers: {
            a: "Mads Mikkelsen",
            b: "Ralph Fiennes",
            c: "Anthony Hopkings",
          },
          att_type: "N/A",
          correctAnswer: "b"
        }
      ];
  
    // Kick things off
    buildQuiz();
   
    // Pagination
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
  
    // // Show the first slide
    // showSlide(currentSlide);
  
    // Event listeners
    submitButton.addEventListener('click', showResults);
    previousButton.addEventListener("click", showPreviousSlide);
    nextButton.addEventListener("click", showNextSlide);
    startButton.addEventListener('click', welcomeMessage);
    continueButton.addEventListener('click', startQuiz);

    submitButton.style.display = 'none';
    previousButton.style.display = 'none';
    nextButton.style.display = 'none';
    continueButton.style.display = 'none';
  })();
  