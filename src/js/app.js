(function() {
    'use strict';

    var ko = require('knockout');
    var guesser = require('./guesser.js');
    var _uniq = require('lodash/array/uniq');

    var vm = {
        word: ko.observable(),
        showForm: ko.observable(true),
        showResults: ko.observable(false),
        invalidWord: ko.observable(false),
        success: ko.observable(false)
    };

    vm.startGame = function() {
        if (wordIsValid(vm.word())) {
            vm.showForm(false);
            vm.invalidWord(false);

            guessWord(vm.word().toLowerCase());
        } else {
            vm.invalidWord(true);
        }
    };

    function wordIsValid(word) {
        return word.length === 5 && _uniq(word.split('')).length === word.length;
    }

    function guessWord(word) {
    	var result = guesser.guessWord(word);

        vm.allGuesses = result.allGuesses;
        vm.showResults(true);

        if (result.guess) {
            vm.success(true);
        } else {
            vm.success(false);
        }
    }

    ko.applyBindings(vm);
})();
