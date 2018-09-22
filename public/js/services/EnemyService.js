"use strict"

function EnemyService() {
    const vm = this;
    vm.cerberus = "Cerberus, a vile three headed hound, guards the gate to the underworld so that the dead do not leave. Each of the heads snarls and gnashes their teeth as you approach. You must face the beast or remain in the underworld forever...";

    vm.hades = "Hades, god of the dead, is not inclined to let the dead leave his dominion. He stands sternly before you. His subjects do not cheat death easily...";

    vm.sirens = "You exit the underworld to a great ocean between you and the world of the living. Luckily a boat is nearby (a favor from the gods). You sail for some time guided by the winds until an enchanting song compells you to follow. It's a trap!";

    vm.poseidon = "Having evaded the sirens you float on a calm sea, but Poseidon has other plans for you. He strikes the sea with his trident and monsterous waves devour your boat.";

    vm.achilles = 'You awake on a beach having evaded Poseidon. You wander, almost giving up hope, when Athena appears. She will help you, if you can prove yourself. Athena places you under the tutelage of Achilles. “You have much to learn and no time to lose”, he says.';

    vm.polyphemus = "You learn much from Achilles then continue your journey to Mt Olympus. Exhausted you rest in a nearby cave. Unbeknownst to you the cave is home to Polyphemus. He hungrily eyes you...";

    vm.prometheus = "A great eagle swoops down and rests upon a shadowy figure imprisioned on a boulder. It’s Prometheus! Help him and he may help you...";

    vm.hercules = "You release Prometheus and he guides you to Mt. Olympus, home of the gods. The ominous mountain looms before you. You think you are close, but Hercules has other plans for you!";

    vm.zeus = "Zeus has followed your journey from the Underworld to his doorstep. “I did not expect you to make it this far, mere mortal”. A lighting bolt grows out of his hand. Zeus is the last thing standing between you and your loved ones!";
}
angular.module("app").service("EnemyService", EnemyService);