(function() {
    'use strict';

    var ko = require('knockout');
    var allWords = require('./words.json');
    var dictionary = require('./dictionary.json');
    var _uniq = require('lodash/array/uniq');
    var _intersection = require('lodash/array/intersection');
    var _difference = require('lodash/array/difference');
    var _union = require('lodash/array/union');
    var _remove = require('lodash/array/remove');
    var _forEach = require('lodash/collection/forEach');
    var _includes = require('lodash/collection/includes');

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
        var success = false;
        var allGuesses = [];
        var found = [];
        var eliminated = [];
        var unknown = 'abcdefghijklmnopqrstuvwxyz'.split('');
        var possibleWords = allWords.slice();
        var countToGuessMap = [];

        for (var i = 0; i <= 5; i++) {
            countToGuessMap[i] = [];
        }

        function getRandomIndex(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getCorrectLetterCount(actual, guess) {
            return _intersection(actual.split(''), guess.split('')).length;
        }

        function eliminateLetter(letter) {
            if (!_includes(eliminated, letter)) {
                eliminated.push(letter);
                unknown = _difference(unknown, [letter]);
                possibleWords = _difference(possibleWords, dictionary[letter]);
            }
        }

        while (possibleWords.length > 0) {
            // make a guess
            var index = getRandomIndex(0, possibleWords.length - 1);
            var guess = possibleWords[index];
            var count = getCorrectLetterCount(word, guess);

            // log guess
            countToGuessMap[count].push(guess);
            allGuesses.push({
                guess: guess,
                count: count
            });

            // check guess
            if (guess === word) {
                success = true;
                break;
            }

            // remove incorrect guess from possibilities
            possibleWords.splice(index, 1);

            // analyze guess
            if (count === 0) {
                _forEach(guess.split(''), function(letter) {
                    eliminateLetter(letter);
                });
            } else if (count === 5) {
                found = guess.split('');
                _forEach(_difference(unknown, found), function(letter) {
                    eliminateLetter(letter);
                });
            } else {
                // TODO: more stuff here...
            }
        }

        vm.allGuesses = allGuesses;
        vm.showResults(true);

        if (success) {
            vm.success(true);
        } else {
            vm.success(false);
        }
    }

    ko.applyBindings(vm);
})();
