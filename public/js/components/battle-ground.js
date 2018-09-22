'use strict';

const battleGround = {
    template: `
    <section class="battle__container">
        <section  class="battle__img__bg" ng-style="{'background-image':'url(' + $ctrl.battleImage + ')'}">
            <section class="timer__container">
                <section class="timer">
                    <p id="timer">{{ $ctrl.counter }} seconds left</p>
                </section>
                <section ng-hide="$ctrl.gameOver" class="section__health" id="id__health">
                    <player-health></player-health>
                </section>
            </section>
            <section ng-show="$ctrl.gameOver" class="section__game-over">Game Over</section>
            <img ng-if="!$ctrl.answered" ng-src="{{ $ctrl.characterImage }}" class="battle__char__img">
            <section class="random__response" ng-if="$ctrl.answered">
                <p ng-class="{'correct':$ctrl.correct, 'incorrect':$ctrl.incorrect}">{{ $ctrl.response }}</p>
            </section>
            <section ng-hide="$ctrl.gameOver" class="question__container">
                <section ng-if="$ctrl.answered === false">
                    <p class="trivia__question"> {{ $ctrl.currentQuestion }} </p>
                    <section class="answers"  ng-class="{'answered': $ctrl.answered}" >
                        <button ng-repeat="answer in $ctrl.answerArray" ng-value="answer" ng-click="$ctrl.userChooseAnswer(answer); $ctrl.stopTimer();">
                            {{ answer }}
                        </button>
                    </section>
                </section>
                <section>
                    <button ng-if="$ctrl.start === false" class="start__button" ng-click="$ctrl.timer(); $ctrl.getNextQuestion();">START</button>
                </section>
                <section class="text_container" ng-if="$ctrl.answered">
                    <p class="answer_text">{{ $ctrl.answerText }} <span ng-if="$ctrl.incorrect">{{ $ctrl.correctAnswer }}</span>!</p>
                    <button ng-hide="$ctrl.switchButtons" class="next_question_button" ng-click="$ctrl.nextQuestion(); $ctrl.timer();">NEXT QUESTION</button>
                    <button ng-show="$ctrl.switchButtons" class="next_question_button" ng-click="$ctrl.continue();">CONTINUE</button>
                </section>
            </section>
        </section>
    </section>
    <section class="portrait"><h1>!!!This game is intended for landscape only - please rotate to play!!!</h1></section>  
    `,

    controller: ["TriviaService", "PlayerService", "$location", "$timeout", "$interval", function(TriviaService, PlayerService, $location, $timeout, $interval) {
        const vm = this;
        vm.id = "id__health";
        vm.playMusic = false;
        vm.start = false;
        vm.gameOver = false;
        vm.incorrect = false;
        vm.correct = false;
        vm.switchButtons = false;
        vm.answerCounter = 0;
        vm.correctAnswers = 0;
        vm.incorrectAnswers = 0;
        vm.answered = false;
        vm.counter = 20;
        vm.answerArray = [];
        vm.currentQuestion = null;
        vm.correctAnswer = null;
        vm.changedHealth = false; 
        vm.rightAnswerArr = [
            "You're a genius, keep up the good work!",
            "The Gods stand no chance at defeating you!",
            "Wow, you got it right!",
            "I am sparta!",
            "Great job! You got it right!"
        ];

        vm.wrongAnswerArr = [
            "Nope! Try Again!",
            "Wrong, Wrong, Wrong",
            "You may need to study more...",
            "Nice Try, Maybe next time",
            "We all make mistakes"
        ];

        vm.getRandomResponse = array => {
            vm.randomIndex = Math.floor(Math.random() * array.length);
            vm.response = array[vm.randomIndex];
        }

        //array from service
        if (PlayerService.battles === 0) {
            TriviaService.getEasyQuestions().then(response => {
                vm.easyQuestions = response;
                sessionStorage.setItem("easy", JSON.stringify(vm.easyQuestions));
            });

            TriviaService.getMediumQuestions().then(response => {
                vm.mediumQuestions = response;
                sessionStorage.setItem("medium", JSON.stringify(vm.mediumQuestions));
            });

            TriviaService.getHardQuestions().then(response => {
                vm.hardQuestions = response;
                sessionStorage.setItem("hard", JSON.stringify(vm.hardQuestions));
            });
        }

        vm.easyQuestions = JSON.parse(sessionStorage.getItem("easy"));
        vm.mediumQuestions = JSON.parse(sessionStorage.getItem("medium"));
        vm.hardQuestions = JSON.parse(sessionStorage.getItem("hard"));

        vm.evaluateAnswerCounter = () => {
            if (vm.answerCounter === 2) {
                vm.button = "Continue Story"
                vm.switchButtons = true;
                PlayerService.battles += 1;
                if (PlayerService.battles > 8) $location.path("/victory");
            }
        }

        vm.timer = () => {
            PlayerService.battleAudio.volume = .3;
            PlayerService.battleAudio.play();
            vm.counter = 20;
            vm.countDown = $interval(() => {
                vm.counter--;

                if (vm.counter <= 0) {
                    $interval.cancel(vm.countDown);
                    vm.answerCounter++
                    vm.incorrect = true;
                    vm.correct = false;

                    vm.evaluateAnswerCounter();

                    $timeout(() => {
                        vm.answered = true;
                        vm.correct = false;
                        vm.answerText = `You ran out of time. The correct answer was`;
                        PlayerService.awwAudio.currentTime = 0;
                        PlayerService.awwAudio.play();
                        vm.getRandomResponse(vm.wrongAnswerArr);
                    }, 0);
                }
            }, 1000);

            return vm.countDown;
        }

        vm.stopTimer = () => {
            $interval.cancel(vm.countDown);
            vm.counter = 20;
        }

        vm.getQuestion = questionArray => {
            vm.currentQuestion = questionArray[0].question;
            vm.correctAnswer = questionArray[0].correct_answer;

            vm.answerArray.push(vm.correctAnswer);
            for (let answer of questionArray[0].incorrect_answers) {
                vm.answerArray.push(answer);
            }
            vm.randomizeArray(vm.answerArray);
            questionArray.shift();
            sessionStorage.setItem("easy", JSON.stringify(vm.easyQuestions));
            sessionStorage.setItem("medium", JSON.stringify(vm.mediumQuestions));
            sessionStorage.setItem("hard", JSON.stringify(vm.hardQuestions));
        }

        vm.randomizeArray = array => array.sort(() => 0.5 - Math.random());

        vm.getNextQuestion = () => {
            vm.start = true;
            vm.currentQuestion = null;
            vm.correctAnswer = null;
            vm.answerArray = [];

            if (PlayerService.battles < 3) {
                vm.getQuestion(vm.easyQuestions);
            } else if (PlayerService.battles >= 3 && PlayerService.battles < 6) {
                vm.getQuestion(vm.mediumQuestions);
            } else if (PlayerService.battles >= 6) {
                vm.getQuestion(vm.hardQuestions);
            }
        }

        vm.userChooseAnswer = userSelection => {
            vm.answered = true;
            vm.answerCounter += 1;

            if (userSelection === vm.correctAnswer) {
                vm.correct = true;
                vm.incorrect = false;
                vm.answerText = "You answered correctly. Great job";
                vm.correctAnswers++;
                vm.getRandomResponse(vm.rightAnswerArr);
                PlayerService.applauseAudio.currentTime = 0;
                PlayerService.applauseAudio.play();

                if (vm.correctAnswers === 2) {
                    PlayerService.setPlayerHealth(PlayerService.playerHealth += 1);
                    vm.changedHealth = true;
                }

            } else {
                vm.incorrect = true;
                vm.correct = false;
                vm.answerText = `You answered the question incorrectly! The correct answer was`;
                vm.incorrectAnswers++;
                vm.getRandomResponse(vm.wrongAnswerArr);
                PlayerService.awwAudio.currentTime = 0;
                PlayerService.awwAudio.play();

                if (vm.incorrectAnswers === 2) {
                    PlayerService.setPlayerHealth(PlayerService.playerHealth -= 1);
                    vm.changedHealth = true;
                }

                if (PlayerService.playerHealth === 0) {
                    vm.gameOver = true;
                    PlayerService.gameOverSound.currentTime = 0;
                    PlayerService.gameOverSound.volume = .6;
                    PlayerService.gameOverSound.play();
                    PlayerService.battleAudio.pause();
                    PlayerService.awwAudio.pause();

                    $timeout(() => {
                        PlayerService.resetPlayer();
                        $location.path('/intro');
                    }, 5000);
                }
            }

            vm.evaluateAnswerCounter();
        }

        vm.nextQuestion = () => {
            vm.answered = false;
            vm.getNextQuestion();
            PlayerService.awwAudio.pause();
            PlayerService.applauseAudio.pause();
            PlayerService.buttonSound.play();
        }

        vm.continue = () => {
            vm.changedHealth ? $location.path("/map").search({ "updateHealth": "true" }) : $location.path("/map");
            PlayerService.battleAudio.currentTime = 0;
            PlayerService.battleAudio.pause();
            PlayerService.awwAudio.pause();
            PlayerService.applauseAudio.pause();
            PlayerService.buttonSound.play();
        };

        switch (PlayerService.battles) {
            case 0:
                vm.battleImage = "public/img/Underworld.png";
                vm.characterImage = "public/img/Cerebrus.png";
                break;
            case 1:
                vm.battleImage = "public/img/Underworld2.png";
                vm.characterImage = "public/img/Hades.png";
                break;
            case 2:
                vm.battleImage = "public/img/island.png";
                vm.characterImage = "public/img/Siren.png";
                break;
            case 3:
                vm.battleImage = "public/img/mountain-island.png"
                vm.characterImage = "public/img/Poseidon.png";
                break;
            case 4:
                vm.battleImage = "public/img/beach.png"
                vm.characterImage = "public/img/Athena.png";
                break;
            case 5:
                vm.battleImage = "public/img/cave.png"
                vm.characterImage = "public/img/Polyphemus.png";
                break;
            case 6:
                vm.battleImage = "public/img/rocky.png"
                vm.characterImage = "public/img/Achilles.png";
                break;
            case 7:
                vm.battleImage = "public/img/Olympus1.png"
                vm.characterImage = "public/img/Hercules.png";
                break;
            case 8:
                vm.battleImage = "public/img/Olympus2.png"
                vm.characterImage = "public/img/Zeus.png";
                break;
        }
    }]
};
angular.module('app').component('battleGround', battleGround);