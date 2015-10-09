var words = require('./words.json');
var _forEach = require('lodash/collection/forEach');
var fs = require('fs');

exports.createDictionary = function() {
    var dictionary = {};

    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    _forEach(alphabet, function(letter) {
        dictionary[letter] = [];
    });

    _forEach(words, function(word) {
        _forEach(word, function(letter) {
            dictionary[letter].push(word);
        });
    });

    fs.writeFile('./src/js/dictionary.json', JSON.stringify(dictionary, null, 4), function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log('File successfully written! Check folder for dictionary.json');
        }
    });
};
