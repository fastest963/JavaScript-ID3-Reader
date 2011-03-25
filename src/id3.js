/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

(function(ns) {
    var ID3 = ns.ID3 = {};
    
    var _file = {};
    // location of the format identifier
    var _formatIDRange = [0, 7];
    
    /**
     * Finds out the tag format of this data and returns the appropriate
     * reader.
     */
    function getTagReader(data) {
        // FIXME: improve this detection according to the spec
        return data.getStringAt(4, 7) == "ftypM4A" ? ID4 :
               (data.getStringAt(0, 3) == "ID3" ? ID3v2 : ID3v1);
    }
    
    function readTags(reader, data, url, tags) {
        var tagsFound = reader.readTagsFromData(data, tags);
        var tags = _file || {};
        for( var tag in tagsFound ) {
            if( tagsFound.hasOwnProperty(tag) ) {
                tags[tag] = tagsFound[tag];
            }
        }
        _file = tags;
        _file["md5"] = md5(data.getRawData());
    }

    /**
     * @param {string} url The location of the sound file to read.
     * @param {function()} cb The callback function to be invoked when all tags have been read.
     * @param {{tags: Array.<string>, dataReader: function(string, function(BinaryReader))}} options The set of options that can specify the tags to be read and the dataReader to use in order to read the file located at url.
     */
    ID3.loadTags = function(file, cb, options) {
        options = options || {};
        var dataReader = options["dataReader"] || new BinaryFile(file);
        
        // preload the format identifier
        dataReader.loadRange(_formatIDRange, function() {
            var reader = getTagReader(dataReader);
            reader.loadData(dataReader, function() {
                readTags(reader, dataReader, file, options["tags"]);
                if( cb ) cb();
            });
        });
    };

    ID3.getAllTags = function() {
        if (!_file) return null;
        
        var tags = {};
        for (var a in _file) {
            if (_file.hasOwnProperty(a))
                tags[a] = _file[a];
        }
        return tags;
    };

    ID3.getTag = function(tag) {
        if (!_file) return null;
        return _file[tag];
    };
    
    // Export functions for closure compiler
    ns["ID3"] = ns.ID3;
    ID3["loadTags"] = ID3.loadTags;
    ID3["getAllTags"] = ID3.getAllTags;
    ID3["getTag"] = ID3.getTag;
})(this);