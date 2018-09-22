'use strict';

const map = {
    template: `
    <section class="map__canvas">
            <img class="logo__map" src='public/img/logo2.png'>
            <canvas id="canvas"></canvas>
        <section class="img__container">
            <section class="section__health" id="id__health">
                <player-health></player-health>
            </section>
            <section class="story__container">
                <p id="story" class="story"></p>
                <button ng-if="$ctrl.fightButton" ng-click="$ctrl.fight()" class="fight">fight!</button>
            </section>
        </section>
    </section>       
    <section class="popup">
        <section ng-if="$ctrl.showInstructions" class="heart__instructions">
            <section class="heart__question" ng-blur="$ctrl.showOutCome = false">
                <p ng-if="!$ctrl.showOutCome">{{ $ctrl.message }}</png>
                <p ng-if="!$ctrl.showOutCome">{{ $ctrl.message_2 }}</p>
                <p ng-if="!$ctrl.showOutCome">{{ $ctrl.question }}</p>
                <section ng-if="!$ctrl.showOutCome" class="answer__section">
                    <button class="answers" ng-click="$ctrl.evaluateAnswer(answer)" ng-repeat="answer in $ctrl.answers">{{ answer }}</button>
                </section>
                <p class="out_come" ng-class="{'correct__map':$ctrl.correct, 'incorrect__map':$ctrl.incorrect}" ng-if="$ctrl.showOutCome">{{ $ctrl.message_3 }}</p>
            </section>
        </section>
    </section>                            
    <section class="bottom__map--nav">
        <section class="bottom__map--buttons">
            <button class="button__intro" ng-click="$ctrl.intro()">INTRO</button>
            <button class="button__instructions" ng-click="$ctrl.instructions()">INSTRUCTIONS</button>
            <button class="button__info" ng-click="$ctrl.info()">CHARACTER BIO'S</button>
        </section>
        <button class="skip__button" ng-click="$ctrl.skip()">SKIP</button>
    </section>
    <section class="portrait"><h1>!!!This game is intended for landscape only - please rotate to play!!!</h1></section>
    `,

    controller: ["PlayerService", "EnemyService", "$location", "$timeout", "$interval", function(PlayerService, EnemyService, $location, $timeout, $interval) {
        const vm = this;
        vm.id = "id__health";
        vm.i = 0;
        vm.speed = 20;
        vm.fightButton = false;
        vm.canvas = document.querySelector('canvas');
        vm.canvas.width = 800;
        vm.canvas.height = 600;
        vm.gctx = vm.canvas.getContext("2d");
        vm.questions;
        vm.showInstructions = PlayerService.showInstructions;
        vm.showOutCome = false;
        vm.correct = false;
        vm.incorrect = false;
        PlayerService.mapAudio.currentTime = 0;
        PlayerService.mapAudio.play();
        PlayerService.mapAudio.loop = true;

        vm.questionObj = {
            question: "In most traditions, who was the wife of Zeus?",
            incorrect_answers: ["Aphrodite", "Athena", "Hestia"],
            correct_answer: "Hera"
        }

        vm.question = vm.questionObj.question;
        vm.correctAnswer = vm.questionObj.correct_answer;
        vm.answers = vm.questionObj.incorrect_answers;
        vm.answers.push(vm.correctAnswer);


        if (PlayerService.battles === 1) {
            PlayerService.showInstructionsCounter++;
            if (PlayerService.showInstructionsCounter < 2) vm.showInstructions = true;
            console.log(`Counter: ${PlayerService.showInstructionsCounter}`);
            if (PlayerService.playerHealth < 3) {
                vm.message = "Did you notice you lost a heart?";
                vm.message_2 = "Answer this question right and you can get your heart back!";
            } else if (PlayerService.playerHealth > 3) {
                vm.message = "Did you notice you gained a heart?";
                vm.message_2 = "Answer this question right and you can get an extra one!";
            } else {
                vm.message = "Did you notice you still have 3 hearts?";
                vm.message_2 = "Answer this queston right and you can get an extra one!";
            }
        };

        vm.evaluateAnswer = answer => {
            vm.showOutCome = true;
            if (answer === vm.correctAnswer) {
                PlayerService.applauseAudio.currentTime = 0;
                PlayerService.applauseAudio.play();
                vm.correct = true;
                PlayerService.setPlayerHealth(PlayerService.playerHealth += 1);
                vm.message_3 = "You gained an extra heart. Don't lose them all or you'll die!";
                console.log(`Player health: ${PlayerService.playerHealth}`);
            } else {
                PlayerService.awwAudio.currentTime = 0;
                PlayerService.awwAudio.play();
                vm.incorrect = true;
                vm.message_3 = "Oh no, you answered wrong! Don't loose all your hearts or you'll die!";
            }

            vm.hideInstructions();
        }

        vm.hideInstructions = () => {
            $timeout(() => {
                vm.showInstructions = false;
                PlayerService.awwAudio.pause();
                PlayerService.applauseAudio.pause();
            }, 3000);
        }

        vm.fight = () => {
            $location.url("/battle-ground");
            PlayerService.mapAudio.pause();
        }

        vm.intro = () => {
            $location.url("/intro");
            PlayerService.mapAudio.pause();
            PlayerService.buttonSound.play();
        }

        vm.instructions = () => {
            $location.url('/instructions');
            PlayerService.buttonSound.play();
        }


        vm.info = () => {
            $location.url('/characters');
            PlayerService.buttonSound.play();
        }

        vm.skip = () => {
            vm.fightButton = true;
            vm.speed = -2000;
            PlayerService.buttonSound.play();
        }

        vm.draw = (startX, startY, endX, endY) => {
            vm.amount = 0;
            $interval(() => {
                vm.amount += 0.01; // change to alter duration
                if (vm.amount > 1) vm.amount = 1;
                vm.gctx.strokeStyle = "red";
                vm.gctx.setLineDash([5, 5]);
                vm.gctx.lineWidth = 5;
                vm.gctx.moveTo(startX, startY);
                vm.gctx.lineTo(startX + (endX - startX) * vm.amount, startY + (endY - startY) * vm.amount);
                vm.gctx.stroke();
            }, 50);
        }

        vm.gctx.strokeStyle = "red";
        vm.gctx.setLineDash([5, 5]);
        vm.gctx.lineWidth = 5;

        switch (PlayerService.battles) {
            case 0:
                vm.storyText = EnemyService.cerberus;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/Cerebrus.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 50, 430, 90, 90);
                }
                break;
            case 1:
                vm.storyText = EnemyService.hades;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/Hades.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 115, 300, 90, 90);
                }
                // vm.draw(80, 470, 160, 365);
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.stroke();
                break;
            case 2:
                vm.storyText = EnemyService.sirens;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/Siren.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 180, 215, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(220, 260);
                vm.gctx.stroke();
                // vm.draw(160, 365, 220, 260);

                break;
            case 3:
                vm.storyText = EnemyService.poseidon;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/poseidon.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 0, 180, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(220, 260)
                vm.gctx.lineTo(45, 260);
                vm.gctx.stroke();
                // vm.draw(220, 260, 45, 260);
                break;
            case 4:

                vm.storyText = EnemyService.achilles;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/athena.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 75, 125, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(45, 260);
                vm.gctx.lineTo(115, 195);
                vm.gctx.stroke();
                // vm.draw(45, 260, 115, 195);
                break;
            case 5:
                vm.storyText = EnemyService.polyphemus;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/polyphemus.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 355, 250, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(45, 260);
                vm.gctx.lineTo(115, 195);
                vm.gctx.bezierCurveTo(115, 195, 300, 20, 395, 330);
                vm.gctx.lineTo(395, 330);
                vm.gctx.stroke();
                // vm.draw(115, 195, 395, 330);
                break;
            case 6:
                vm.storyText = EnemyService.prometheus;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/achilles.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 485, 450, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(45, 260);
                vm.gctx.lineTo(115, 195);
                vm.gctx.bezierCurveTo(115, 195, 300, 20, 395, 330);
                vm.gctx.lineTo(395, 330);
                vm.gctx.lineTo(530, 540);
                vm.gctx.stroke();
                // vm.draw(395, 330, 530, 540);
                break;
            case 7:
                vm.storyText = EnemyService.hercules;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/Hercules.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 690, 210, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(45, 260);
                vm.gctx.lineTo(115, 195);
                vm.gctx.bezierCurveTo(115, 195, 350, 20, 395, 330)
                vm.gctx.lineTo(530, 540);
                vm.gctx.lineTo(740, 300);
                vm.gctx.stroke();
                // vm.draw(530, 540, 740, 300);
                break;
            case 8:
                vm.storyText = EnemyService.zeus;
                vm.logoImg = new Image();
                vm.logoImg.src = "public/img/zeus.png";
                vm.logoImg.onload = function() {
                    vm.gctx.drawImage(vm.logoImg, 685, 0, 90, 90);
                }
                vm.gctx.moveTo(80, 470);
                vm.gctx.lineTo(160, 365);
                vm.gctx.bezierCurveTo(160, 365, 10, 350, 220, 260);
                vm.gctx.lineTo(45, 260);
                vm.gctx.lineTo(115, 195);
                vm.gctx.bezierCurveTo(115, 195, 350, 20, 395, 330)
                vm.gctx.lineTo(530, 540);
                vm.gctx.lineTo(740, 300);
                vm.gctx.lineTo(740, 55);
                vm.gctx.stroke();
                // vm.draw(740, 300, 740, 55);
                break;
        }

        vm.typeWriter = () => {
            if (vm.i < vm.storyText.length) {
                document.getElementById("story").innerHTML += vm.storyText.charAt(vm.i);
                vm.i++;
                $timeout(vm.typeWriter, vm.speed);
            } else {
                vm.fightButton = true;
            }
        }

        vm.typeWriter();
    }]
}
angular.module('app').component('map', map);