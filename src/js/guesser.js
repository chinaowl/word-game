(function() {
    'use strict';

    var allWords = require('./words.json');
    var dictionary = require('./dictionary.json');

    var _intersection = require('lodash/array/intersection');
    var _difference = require('lodash/array/difference');
    var _forEach = require('lodash/collection/forEach');
    var _includes = require('lodash/collection/includes');

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

    function eliminateAllLetters(letters) {
        _forEach(letters, function(letter) {
            eliminateLetter(letter);
        });
    }

    function eliminateLetter(letter) {
        if (!_includes(eliminated, letter)) {
            eliminated.push(letter);
            unknown = _difference(unknown, [letter]);
            possibleWords = _difference(possibleWords, dictionary[letter]);
        }
    }

    function guessWord(word) {
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
                return {
                	guess: guess,
                	allGuesses: allGuesses
                };
            }

            // remove incorrect guess from possibilities
            possibleWords.splice(index, 1);

            // analyze guess
            var lettersInGuess = guess.split('');
            if (count === 0) {
                eliminateAllLetters(lettersInGuess);
            } else if (count === 5) {
                found = lettersInGuess;
                eliminateAllLetters(_difference(unknown, found));
            } else {
                // TODO: more stuff here
            }
        }

        return {
        	allGuesses: allGuesses
        };
    }

    exports.guessWord = guessWord;
})();
