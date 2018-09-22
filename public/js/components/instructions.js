"use strict";

const instructions = {
    template: `
    <section class="section__instructions">
      <section class="instructions__container">
        <h1>Instructions</h1>
        <ul>
        <li>Your battles will consist of various mythological trivia questions.</li>
        <li>Each battle will have two questions with 20 seconds to answer each question.</li>
        <li>Answer both questions correctly and gain a health point (heart). No heart is gained for only one correct answer.</li>
        <li>Lose a heart if both questions are answered incorrectly.</li>
        <li>The game is over if all hearts are lost.</li>
        </ul>
        <button type="button" ng-click="$ctrl.back();">{{ $ctrl.button }}</button>
      </section>
    </section>
    <section class="portrait"><h1>!!!This game is intended for landscape only - please rotate to play!!!</h1></section>
  `,
    controller: ['$location', 'PlayerService', function($location, PlayerService) {
        const vm = this;
        
        PlayerService.battles === 0 ? vm.button = "PLAY" : vm.button = "BACK";
    
        vm.back = () => {
          $location.url('/map');
          PlayerService.introAudio.pause();
          PlayerService.buttonSound.play();
        }
    }]
}
angular.module("app").component("instructions", instructions);