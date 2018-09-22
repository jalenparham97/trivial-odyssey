'use strict';

const characters = {
    template: `
    <section class="character__container">
        <h1 class="character__title">CHARACTER BIOGRAPHY</h1>
        <section>
            <ul class="ul__gods">
                <li ng-repeat="character in $ctrl.characters" ng-click="$ctrl.selectCharacter(character.name);">
                    <a href="">{{ character.name }}</a>
                </li>
            </ul>
            <section class="bio">
                <p ng-if="$ctrl.selectBio === false" class="select__bio">SELECT A CHARACTER ABOVE.</p>
                <section class="bio__info" ng-if="$ctrl.bioShow">
                    <img ng-src=" {{ $ctrl.pic }}">
                    <p>{{ $ctrl.bio }}</p>
                </section>
            </section>
        </section>
        <button class="back__button" ng-click="$ctrl.back()">BACK</button>
    </section>    
    <section class="portrait"><h1>!!!This game is intended for landscape only - please rotate to play!!!</h1></section>
    `,
    controller: ["BioService", "$location", function(BioService, $location) {
        const vm = this;
        vm.bioShow = false;
        vm.selectBio = false;

        vm.characters = [
            { name: 'Achilles' },
            { name: 'Athena' },
            { name: 'Cerebrus' },
            { name: 'Hades' },
            { name: 'Hercules' },
            { name: 'Polyphemus' },
            { name: 'Poseidon' },
            { name: 'Siren' },
            { name: 'Zeus' }
        ];

        vm.back = () => $location.url('/map');

        vm.selectCharacter = hit => {
            vm.selectBio = true;
            vm.bioShow = true;
            vm.pic = `public/img/${hit}.png`;
            vm.bio = BioService[hit];
        }
    }]
}
angular.module('app').component('characters', characters);