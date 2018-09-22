"use strict"

const playerHealth = {
    template: `
    <img ng-repeat="i in $ctrl.lives track by $index" class="img__heart" src="public/img/heart.png" ng-class="{'img__heart__change': $ctrl.updateHealth}"></img>
    `,
    controller: ["PlayerService", "$routeParams", function(PlayerService, $routeParams) {
        const vm = this;

        vm.lives = new Array(PlayerService.getPlayerHealth());

        if ($routeParams.updateHealth) vm.updateHealth = true;
    }]
}
angular.module('app').component('playerHealth', playerHealth);