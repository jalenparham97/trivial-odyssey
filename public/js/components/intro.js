'use strict';

const intro = {
    template: `
    <section class = "intro_container">
    <img class="logo" src='public/img/logo2.png'>
    <p class="intro_text">Zeus has banished you to the Underworld and capriciously imprisoned your loved ones at Mt. Olympus. The gods it seems have made you their plaything! They will move heaven and earth so that you don’t see your family again. Use your cunning, strength and bravery to defy the gods and foil their schemes.</p>
    <section class="button__intro--section">
        <button class="button__play" ng-click="$ctrl.play()">{{ $ctrl.playButton }}</button>
        <button class="button__instructions--intro" ng-click="$ctrl.instructions()">INSTRUCTIONS</button>
    </section>
    </section>
    <section class="portrait"><h1>!!!This game is intended for landscape only - please rotate to play!!!</h1></section>
    `,
    controller: ["$location", "PlayerService", function($location, PlayerService) {
        const vm = this;
        PlayerService.introAudio.currentTime = 0;
        PlayerService.introAudio.play();
        PlayerService.introAudio.loop;

        PlayerService.battles > 0 ? vm.playButton = "CONTINUE" : vm.playButton = "PLAY";

        vm.play = () => {
            $location.url("/map");
            PlayerService.introAudio.currentTime = 0;
            PlayerService.introAudio.pause();
            PlayerService.buttonSound.play();
        }

        vm.instructions = () => {
            $location.url("/instructions");
            PlayerService.buttonSound.play();
        }
    }]
}
angular.module('app').component('intro', intro);