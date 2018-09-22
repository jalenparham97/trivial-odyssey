'use strict';

const victory = {
    template: `
    <section class="section__victory">
        <h1 class="h1__winner">YOU WIN!!!</h1>
        <section class="section__wide-scroll">
            <p class="p__credits" id="id__credits"></p>   
        </section>
        <button class="button__play-again" type="button" ng-click="$ctrl.resetGame();">PLAY AGAIN?</button>
    </section>
    <section class="portrait"><h1>!!!This game is intended for landscape only - please rotate to play!!!</h1></section>
    `,
    controller: ['$location', 'PlayerService', "$timeout", function($location, PlayerService, $timeout) {
        const vm = this;
        vm.i = 0;
        vm.speed = 20;
        vm.storyText = "You've completed your quest! The gods stood no chance before your awesome might. You delight in your family's reunion, and look to the horizon...";

        PlayerService.victory.play();
        PlayerService.mapAudio.pause();
        PlayerService.battleAudio.pause();

        vm.resetGame = () => {
            PlayerService.resetPlayer();
            $location.path('/intro');
            PlayerService.applauseAudio.pause();
        }

        vm.typeWriter = () => {
            if (vm.i < vm.storyText.length) {
                document.getElementById("id__credits").innerHTML += vm.storyText.charAt(vm.i);
                vm.i++;
                $timeout(vm.typeWriter, vm.speed);
            }
        }

        vm.typeWriter();

    }]
}
angular.module('app').component('victory', victory);