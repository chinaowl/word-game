(function() {
    'use strict';

    var ko = require('knockout');
    var allWords = require('./words.json');
    var dictionary = require('./dictionary.json');
    var _uniq = require('lodash/array/uniq');
    var _intersection = require('lodash/array/intersection');


    var vm = {
        word: ko.observable(),
        showForm: ko.observable(true),
        showResults: ko.observable(false),
        invalidWord: ko.observable(false),
        couldNotGuess: ko.observable(false)
    };

    vm.startGame = function() {
        if (wordIsValid(vm.word())) {
            vm.showForm(false);
            vm.invalidWord(false);
            guessWord(vm.word());
        } else {
            vm.invalidWord(true);
        }
    };

    function wordIsValid(word) {
        if (word.length === 5 && uniqueLetters(word)) {
            return true;
        } else {
            return false;
        }
    }

    function uniqueLetters(word) {
        return _uniq(word.split('')).length === word.length;
    }

    function guessWord(word) {
        var guess, guessCount = 0, success = false, allGuesses = [], tempIndex = 0;

        while (guessCount < allWords.length) {
        	guess = allWords[tempIndex++];
        	allGuesses.push({
        		guess: guess,
        		count: getCorrectLetterCount(word, guess)
        	});

        	if (guess === word) {
        		success = true;
        		break;
        	}

        	guessCount++;
        }

        if (success) {
        	vm.allGuesses = allGuesses;
        	vm.showResults(true);
        } else {
        	vm.couldNotGuess(true);
        }
    }

    function getCorrectLetterCount(actual, guess) {
    	return _intersection(actual.split(''), guess.split('')).length;
    }

    ko.applyBindings(vm);
})();
