onmessage = function(e){
  //[file, ID3, md5, BinaryFile, ID3v2, StringUtils, Base64]
  var file = e.data;
  ID3.loadTags(file, function() {
    var tags = ID3.getAllTags();
    postMessage(tags);
  });
  
  
};

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

function BinaryFile(file, strData) {
	var data = strData || "";
	var dataLength = 0;
    var file = file;

	this.getRawData = function() {
		return data;
	};

	dataLength = file.size || data.length;
    
	this.getByteAt = function(iOffset) {
		return data.charCodeAt(iOffset) & 0xFF;
	};
    // @aadsm
    this.getBytesAt = function(iOffset, iLength) {
        var bytes = new Array(iLength);
        for( var i = 0; i < iLength; i++ ) {
            bytes[i] = this.getByteAt(iOffset+i);
        }
        return bytes;
    };

	this.getLength = function() {
		return dataLength;
	};

    // @aadsm
    this.isBitSetAt = function(iOffset, iBit) {
        var iByte = this.getByteAt(iOffset);
        return (iByte & (1 << iBit)) != 0;
    };

	this.getSByteAt = function(iOffset) {
		var iByte = this.getByteAt(iOffset);
		if (iByte > 127)
			return iByte - 256;
		else
			return iByte;
	};

	this.getShortAt = function(iOffset, bBigEndian) {
		var iShort = bBigEndian ? 
			(this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
			: (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
		if (iShort < 0) iShort += 65536;
		return iShort;
	};
	this.getSShortAt = function(iOffset, bBigEndian) {
		var iUShort = this.getShortAt(iOffset, bBigEndian);
		if (iUShort > 32767)
			return iUShort - 65536;
		else
			return iUShort;
	};
	this.getLongAt = function(iOffset, bBigEndian) {
		var iByte1 = this.getByteAt(iOffset),
			iByte2 = this.getByteAt(iOffset + 1),
			iByte3 = this.getByteAt(iOffset + 2),
			iByte4 = this.getByteAt(iOffset + 3);

		var iLong = bBigEndian ? 
			(((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
			: (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
		if (iLong < 0) iLong += 4294967296;
		return iLong;
	};
	this.getSLongAt = function(iOffset, bBigEndian) {
		var iULong = this.getLongAt(iOffset, bBigEndian);
		if (iULong > 2147483647)
			return iULong - 4294967296;
		else
			return iULong;
	};
	// @aadsm
	this.getInteger24At = function(iOffset, bBigEndian) {
        var iByte1 = this.getByteAt(iOffset),
			iByte2 = this.getByteAt(iOffset + 1),
			iByte3 = this.getByteAt(iOffset + 2);

		var iInteger = bBigEndian ? 
			((((iByte1 << 8) + iByte2) << 8) + iByte3)
			: ((((iByte3 << 8) + iByte2) << 8) + iByte1);
		if (iInteger < 0) iInteger += 16777216;
		return iInteger;
    };
	this.getStringAt = function(iOffset, iLength) {
		var aStr = [];
		for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
			aStr[j] = String.fromCharCode(this.getByteAt(i));
		}
		return aStr.join("");
	};
	// @aadsm
	this.getStringWithCharsetAt = function(iOffset, iLength, iCharset) {
		var bytes = this.getBytesAt(iOffset, iLength);
		var sString;
		
		switch( iCharset.toLowerCase() ) {
		    case 'utf-16':
		    case 'utf-16le':
		    case 'utf-16be':
		        sString = StringUtils.readUTF16String(bytes, iCharset);
		        break;
		        
		    case 'utf-8':
		        sString = StringUtils.readUTF8String(bytes);
		        break;
		    
		    default:
		        sString = StringUtils.readNullTerminatedString(bytes);
		        break;
		}
		
		return sString;
	};

	this.getCharAt = function(iOffset) {
		return String.fromCharCode(this.getByteAt(iOffset));
	};
	this.toBase64 = function() {
		return btoa(data);
	};
	this.fromBase64 = function(strBase64) {
		data = atob(strBase64);
	};
    this.loadRange = function(range, callback) {        
        var reader = null;
        
        if (data.length) {
            callback();
            return;
        }
        
        if (FileReader) {
			var reader = new FileReader();
		}
        if (reader) {
            if (callback) {
				if (typeof(reader.onloadend) != "undefined") {
					reader.onloadend = function(e) {
                        if (!e.target.error && e.target.readyState == FileReader.DONE) {
                            data = e.target.result;
                            callback();
                            reader = null;
                        }
					};
				}
                if (typeof(reader.onload) != "undefined") {
                    reader.onerror = function(evt) {
                        var msg = 'Error ' + evt.target.error.code;
                        postMessage(msg);
                        reader = null;
                    };
                }
			}
            //var blob = file.slice(range[0], range[1] - range[0] + 2);
			reader.readAsBinaryString(file);
        }
        
	};
}

/*
 * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

(function(ns) {
    var ID3v2 = ns.ID3v2 = {};
    
    ID3v2.readFrameData = {};
    ID3v2.frames = {
        // v2.2
        "BUF" : "Recommended buffer size",
        "CNT" : "Play counter",
        "COM" : "Comments",
        "CRA" : "Audio encryption",
        "CRM" : "Encrypted meta frame",
        "ETC" : "Event timing codes",
        "EQU" : "Equalization",
        "GEO" : "General encapsulated object",
        "IPL" : "Involved people list",
        "LNK" : "Linked information",
        "MCI" : "Music CD Identifier",
        "MLL" : "MPEG location lookup table",
        "PIC" : "Attached picture",
        "POP" : "Popularimeter",
        "REV" : "Reverb",
        "RVA" : "Relative volume adjustment",
        "SLT" : "Synchronized lyric/text",
        "STC" : "Synced tempo codes",
        "TAL" : "Album/Movie/Show title",
        "TBP" : "BPM (Beats Per Minute)",
        "TCM" : "Composer",
        "TCO" : "Content type",
        "TCR" : "Copyright message",
        "TDA" : "Date",
        "TDY" : "Playlist delay",
        "TEN" : "Encoded by",
        "TFT" : "File type",
        "TIM" : "Time",
        "TKE" : "Initial key",
        "TLA" : "Language(s)",
        "TLE" : "Length",
        "TMT" : "Media type",
        "TOA" : "Original artist(s)/performer(s)",
        "TOF" : "Original filename",
        "TOL" : "Original Lyricist(s)/text writer(s)",
        "TOR" : "Original release year",
        "TOT" : "Original album/Movie/Show title",
        "TP1" : "Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",
        "TP2" : "Band/Orchestra/Accompaniment",
        "TP3" : "Conductor/Performer refinement",
        "TP4" : "Interpreted, remixed, or otherwise modified by",
        "TPA" : "Part of a set",
        "TPB" : "Publisher",
        "TRC" : "ISRC (International Standard Recording Code)",
        "TRD" : "Recording dates",
        "TRK" : "Track number/Position in set",
        "TSI" : "Size",
        "TSS" : "Software/hardware and settings used for encoding",
        "TT1" : "Content group description",
        "TT2" : "Title/Songname/Content description",
        "TT3" : "Subtitle/Description refinement",
        "TXT" : "Lyricist/text writer",
        "TXX" : "User defined text information frame",
        "TYE" : "Year",
        "UFI" : "Unique file identifier",
        "ULT" : "Unsychronized lyric/text transcription",
        "WAF" : "Official audio file webpage",
        "WAR" : "Official artist/performer webpage",
        "WAS" : "Official audio source webpage",
        "WCM" : "Commercial information",
        "WCP" : "Copyright/Legal information",
        "WPB" : "Publishers official webpage",
        "WXX" : "User defined URL link frame",
        // v2.3
        "AENC" : "Audio encryption",
        "APIC" : "Attached picture",
        "COMM" : "Comments",
        "COMR" : "Commercial frame",
        "ENCR" : "Encryption method registration",
        "EQUA" : "Equalization",
        "ETCO" : "Event timing codes",
        "GEOB" : "General encapsulated object",
        "GRID" : "Group identification registration",
        "IPLS" : "Involved people list",
        "LINK" : "Linked information",
        "MCDI" : "Music CD identifier",
        "MLLT" : "MPEG location lookup table",
        "OWNE" : "Ownership frame",
        "PRIV" : "Private frame",
        "PCNT" : "Play counter",
        "POPM" : "Popularimeter",
        "POSS" : "Position synchronisation frame",
        "RBUF" : "Recommended buffer size",
        "RVAD" : "Relative volume adjustment",
        "RVRB" : "Reverb",
        "SYLT" : "Synchronized lyric/text",
        "SYTC" : "Synchronized tempo codes",
        "TALB" : "Album/Movie/Show title",
        "TBPM" : "BPM (beats per minute)",
        "TCOM" : "Composer",
        "TCON" : "Content type",
        "TCOP" : "Copyright message",
        "TDAT" : "Date",
        "TDLY" : "Playlist delay",
        "TENC" : "Encoded by",
        "TEXT" : "Lyricist/Text writer",
        "TFLT" : "File type",
        "TIME" : "Time",
        "TIT1" : "Content group description",
        "TIT2" : "Title/songname/content description",
        "TIT3" : "Subtitle/Description refinement",
        "TKEY" : "Initial key",
        "TLAN" : "Language(s)",
        "TLEN" : "Length",
        "TMED" : "Media type",
        "TOAL" : "Original album/movie/show title",
        "TOFN" : "Original filename",
        "TOLY" : "Original lyricist(s)/text writer(s)",
        "TOPE" : "Original artist(s)/performer(s)",
        "TORY" : "Original release year",
        "TOWN" : "File owner/licensee",
        "TPE1" : "Lead performer(s)/Soloist(s)",
        "TPE2" : "Band/orchestra/accompaniment",
        "TPE3" : "Conductor/performer refinement",
        "TPE4" : "Interpreted, remixed, or otherwise modified by",
        "TPOS" : "Part of a set",
        "TPUB" : "Publisher",
        "TRCK" : "Track number/Position in set",
        "TRDA" : "Recording dates",
        "TRSN" : "Internet radio station name",
        "TRSO" : "Internet radio station owner",
        "TSIZ" : "Size",
        "TSRC" : "ISRC (international standard recording code)",
        "TSSE" : "Software/Hardware and settings used for encoding",
        "TYER" : "Year",
        "TXXX" : "User defined text information frame",
        "UFID" : "Unique file identifier",
        "USER" : "Terms of use",
        "USLT" : "Unsychronized lyric/text transcription",
        "WCOM" : "Commercial information",
        "WCOP" : "Copyright/Legal information",
        "WOAF" : "Official audio file webpage",
        "WOAR" : "Official artist/performer webpage",
        "WOAS" : "Official audio source webpage",
        "WORS" : "Official internet radio station homepage",
        "WPAY" : "Payment",
        "WPUB" : "Publishers official webpage",
        "WXXX" : "User defined URL link frame"
    };

    var _shortcuts = {
        "title"     : ["TIT2", "TT2"],
        "artist"    : ["TPE1", "TP1"],
        "album"     : ["TALB", "TAL"],
        "year"      : ["TYER", "TYE"],
        "comment"   : ["COMM", "COM"],
        "track"     : ["TRCK", "TRK"],
        "genre"     : ["TCON", "TCO"],
        "picture"   : ["APIC", "PIC"],
        "lyrics"    : ["USLT", "ULT"]
    };
    var _defaultShortcuts = ["title", "artist", "album", "track"];
    
    function getTagsFromShortcuts(shortcuts) {
        var tags = [];
        for( var i = 0, shortcut; shortcut = shortcuts[i]; i++ ) {
            tags = tags.concat(_shortcuts[shortcut]||[shortcut]);
        }
        return tags;
    }
    
    // The ID3v2 tag/frame size is encoded with four bytes where the most significant bit (bit 7) is set to zero in every byte, making a total of 28 bits. The zeroed bits are ignored, so a 257 bytes long tag is represented as $00 00 02 01.
    function readSynchsafeInteger32At(offset, data) {
        var size1 = data.getByteAt(offset);
        var size2 = data.getByteAt(offset+1);
        var size3 = data.getByteAt(offset+2);
        var size4 = data.getByteAt(offset+3);
        // 0x7f = 0b01111111
        var size = size4 & 0x7f
                 | ((size3 & 0x7f) << 7)
                 | ((size2 & 0x7f) << 14)
                 | ((size1 & 0x7f) << 21);
        return size;
    }

    function readFrameFlags(data, offset)
    {
        var flags =
        {
            message:
            {
                tag_alter_preservation  : data.isBitSetAt( offset, 6),
                file_alter_preservation : data.isBitSetAt( offset, 5),
                read_only               : data.isBitSetAt( offset, 4)
            },
            format: 
            {
                grouping_identity       : data.isBitSetAt( offset+1, 7),
                compression             : data.isBitSetAt( offset+1, 3),
                encription              : data.isBitSetAt( offset+1, 2),
                unsynchronisation       : data.isBitSetAt( offset+1, 1),
                data_length_indicator   : data.isBitSetAt( offset+1, 0)
            }
        };
        
        return flags;
    }

    /** All the frames consists of a frame header followed by one or more fields containing the actual information.
     * The frame ID made out of the characters capital A-Z and 0-9. Identifiers beginning with "X", "Y" and "Z" are for experimental use and free for everyone to use, without the need to set the experimental bit in the tag header. Have in mind that someone else might have used the same identifier as you. All other identifiers are either used or reserved for future use.
     * The frame ID is followed by a size descriptor, making a total header size of ten bytes in every frame. The size is calculated as frame size excluding frame header (frame size - 10).
     */
    function readFrames(offset, end, data, id3header, tags)
    {
        var frames = {};
        var frameDataSize;
        var major = id3header["major"];
        
        tags = getTagsFromShortcuts(tags || _defaultShortcuts);
        
        while( offset < end ) {
            var readFrameFunc = null;
            var frameData = data;
            var frameDataOffset = offset;
            var flags = null;
            
            switch( major ) {
                case 2:
                var frameID = frameData.getStringAt(frameDataOffset, 3);
                var frameSize = frameData.getInteger24At(frameDataOffset+3, true);
                var frameHeaderSize = 6;
                break;

                case 3:
                var frameID = frameData.getStringAt(frameDataOffset, 4);
                var frameSize = frameData.getLongAt(frameDataOffset+4, true);
                var frameHeaderSize = 10;
                break;
                
                case 4:
                var frameID = frameData.getStringAt(frameDataOffset, 4);
                var frameSize = readSynchsafeInteger32At(frameDataOffset+4, frameData);
                var frameHeaderSize = 10;
                break;
            }
            // if last frame GTFO
            if( frameID == "" ) { break; }
            
            // advance data offset to the next frame data
            offset += frameHeaderSize + frameSize;
            // skip unwanted tags
            if( tags.indexOf( frameID ) < 0 ) { continue; }
            
            // read frame message and format flags
            if( major > 2 )
            {
                flags = readFrameFlags(frameData, frameDataOffset+8);
            }
            
            frameDataOffset += frameHeaderSize;
            
            // the first 4 bytes are the real data size 
            // (after unsynchronisation && encryption)
            if( flags && flags.format.data_length_indicator )
            {
                frameDataSize = readSynchsafeInteger32At(frameDataOffset, frameData);
                frameDataOffset += 4;
                frameSize -= 4;
            }
            
            // TODO: support unsynchronisation
            if( flags && flags.format.unsynchronisation )
            {
                //frameData = removeUnsynchronisation(frameData, frameSize);
                continue;
            }
                            
            // find frame parsing function
            if( frameID in ID3v2.readFrameData ) {
                readFrameFunc = ID3v2.readFrameData[frameID];
            } else if( frameID[0] == "T" ) {
                readFrameFunc = ID3v2.readFrameData["T*"];
            }
            
            var parsedData = readFrameFunc ? readFrameFunc(frameDataOffset, frameSize, frameData, flags) : undefined;
            var desc = frameID in ID3v2.frames ? ID3v2.frames[frameID] : 'Unknown';
        
            var frame = {
                id          : frameID,
                size        : frameSize,
                description : desc,
                data        : parsedData
            };
        
            if( frameID in frames ) {
                if( frames[frameID].id ) {
                    frames[frameID] = [frames[frameID]];
                }
                frames[frameID].push(frame);
            } else {
                frames[frameID] = frame;
            }
        }
    
        return frames;
    }

    //function removeUnsynchronisation(data, size)
    //{
    //    return data;
    //}

    function getFrameData( frames, ids ) {
        if( typeof ids == 'string' ) { ids = [ids]; }
    
        for( var i = 0, id; id = ids[i]; i++ ) {
            if( id in frames ) { return frames[id].data; }
        }
    }
    
    ID3v2.loadData = function(data, callback) {
        data.loadRange([0, readSynchsafeInteger32At(6, data)], callback);
    };
    
    // http://www.id3.org/id3v2.3.0
    ID3v2.readTagsFromData = function(data, tags) {
        var offset = 0;
        var major = data.getByteAt(offset+3);
        if( major > 4 ) { return {version: '>2.4'}; }
        var revision = data.getByteAt(offset+4);
        var unsynch = data.isBitSetAt(offset+5, 7);
        var xheader = data.isBitSetAt(offset+5, 6);
        var xindicator = data.isBitSetAt(offset+5, 5);
        var size = readSynchsafeInteger32At(offset+6, data);
        offset += 10;
        
        if( xheader ) {
            var xheadersize = data.getLongAt(offset, true);
            // The 'Extended header size', currently 6 or 10 bytes, excludes itself.
            offset += xheadersize + 4;
        }

        var id3 = {
    	    "version" : '2.' + major + '.' + revision,
    	    "major" : major,
    	    "revision" : revision,
    	    "flags" : {
    	        "unsynchronisation" : unsynch,
    	        "extended_header" : xheader,
    	        "experimental_indicator" : xindicator
    	    },
    	    "size" : size
    	};
        var frames = unsynch ? {} : readFrames(offset, size-10, data, id3, tags);
    	// create shortcuts for most common data
    	for( var name in _shortcuts ) if(_shortcuts.hasOwnProperty(name)) {
    	    var data = getFrameData( frames, _shortcuts[name] );
    	    if( data ) id3[name] = data;
    	}
    	
    	for( var frame in frames ) {
    	    if( frames.hasOwnProperty(frame) ) {
    	        id3[frame] = frames[frame];
    	    }
    	}
    	
    	return id3;
    };
    
    // Export functions for closure compiler
    ns["ID3v2"] = ID3v2;
})(this);

var StringUtils = {
    readUTF16String: function(bytes, bigEndian, maxBytes) {
        var ix = 0;
        var offset1 = 1, offset2 = 0;
        maxBytes = Math.min(maxBytes||bytes.length, bytes.length);

        if( bytes[0] == 0xFE && bytes[1] == 0xFF ) {
            bigEndian = true;
            ix = 2;
        } else if( bytes[0] == 0xFF && bytes[1] == 0xFE ) {
            bigEndian = false;
            ix = 2;
        }
        if( bigEndian ) {
            offset1 = 0;
            offset2 = 1;
        }

        var arr = [];
        for( var j = 0; ix < maxBytes; j++ ) {
            var byte1 = bytes[ix+offset1];
            var byte2 = bytes[ix+offset2];
            var word1 = (byte1<<8)+byte2;
            ix += 2;
            if( word1 == 0x0000 ) {
                break;
            } else if( byte1 < 0xD8 || byte1 >= 0xE0 ) {
                arr[j] = String.fromCharCode(word1);
            } else {
                var byte3 = bytes[ix+offset1];
                var byte4 = bytes[ix+offset2];
                var word2 = (byte3<<8)+byte4;
                ix += 2;
                arr[j] = String.fromCharCode(word1, word2);
            }
        }
        var string = new String(arr.join(""));
        string.bytesReadCount = ix;
        return string;
    },
    readUTF8String: function(bytes, maxBytes) {
        var ix = 0;
        maxBytes = Math.min(maxBytes||bytes.length, bytes.length);

        if( bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF ) {
            ix = 3;
        }

        var arr = [];
        for( var j = 0; ix < maxBytes; j++ ) {
            var byte1 = bytes[ix++];
            if( byte1 == 0x00 ) {
                break;
            } else if( byte1 < 0x80 ) {
                arr[j] = String.fromCharCode(byte1);
            } else if( byte1 >= 0xC2 && byte1 < 0xE0 ) {
                var byte2 = bytes[ix++];
                arr[j] = String.fromCharCode(((byte1&0x1F)<<6) + (byte2&0x3F));
            } else if( byte1 >= 0xE0 && byte1 < 0xF0 ) {
                var byte2 = bytes[ix++];
                var byte3 = bytes[ix++];
                arr[j] = String.fromCharCode(((byte1&0xFF)<<12) + ((byte2&0x3F)<<6) + (byte3&0x3F));
            } else if( byte1 >= 0xF0 && byte1 < 0xF5) {
                var byte2 = bytes[ix++];
                var byte3 = bytes[ix++];
                var byte4 = bytes[ix++];
                var codepoint = ((byte1&0x07)<<18) + ((byte2&0x3F)<<12)+ ((byte3&0x3F)<<6) + (byte4&0x3F) - 0x10000;
                arr[j] = String.fromCharCode(
                    (codepoint>>10) + 0xD800,
                    (codepoint&0x3FF) + 0xDC00
                );
            }
        }
        var string = new String(arr.join(""));
        string.bytesReadCount = ix;
        return string;
    },
    readNullTerminatedString: function(bytes, maxBytes) {
        var arr = [];
        maxBytes = maxBytes || bytes.length;
        for ( var i = 0; i < maxBytes; ) {
            var byte1 = bytes[i++];
            if( byte1 == 0x00 ) break;
		    arr[i-1] = String.fromCharCode(byte1);
	    }	    
        var string = new String(arr.join(""));
        string.bytesReadCount = i;
        return string;
    }
};

// Modified version of http://www.webtoolkit.info/javascript-base64.html
(function(ns) {
    ns.Base64 = {
    	// private property
    	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    	// public method for encoding
    	encodeBytes : function (input) {
    		var output = "";
    		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    		var i = 0;

    		while (i < input.length) {

    			chr1 = input[i++];
    			chr2 = input[i++];
    			chr3 = input[i++];

    			enc1 = chr1 >> 2;
    			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    			enc4 = chr3 & 63;

    			if (isNaN(chr2)) {
    				enc3 = enc4 = 64;
    			} else if (isNaN(chr3)) {
    				enc4 = 64;
    			}

    			output = output +
    			Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
    			Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

    		}

    		return output;
    	}
    };
    
    // Export functions for closure compiler
    ns["Base64"] = ns.Base64;
    ns.Base64["encodeBytes"] = ns.Base64.encodeBytes;
})(this);

function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function hex(x) {
for (var i=0; i<x.length; i++)
x[i] = rhex(x[i]);
return x.join('');
}

function md5(s) {
return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
}

/*
 * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
 * Modified by António Afonso <antonio.afonso gmail.com>
 */
(function() {
    var pictureType = [
        "32x32 pixels 'file icon' (PNG only)",
        "Other file icon",
        "Cover (front)",
        "Cover (back)",
        "Leaflet page",
        "Media (e.g. lable side of CD)",
        "Lead artist/lead performer/soloist",
        "Artist/performer",
        "Conductor",
        "Band/Orchestra",
        "Composer",
        "Lyricist/text writer",
        "Recording Location",
        "During recording",
        "During performance",
        "Movie/video screen capture",
        "A bright coloured fish",
        "Illustration",
        "Band/artist logotype",
        "Publisher/Studio logotype"
    ];
    
    function getTextEncoding( bite ) {
        var charset;
        switch( bite )
        {
            case 0x00:
                charset = 'iso-8859-1';
                break;
                
            case 0x01:
                charset = 'utf-16';
                break;
                
            case 0x02:
                charset = 'utf-16be';
                break;
                
            case 0x03:
                charset = 'utf-8';
                break;
        }
        
        return charset;
    }
    
    function getTime( duration )
    {
        var duration    = duration/1000,
            seconds     = Math.floor( duration ) % 60,
            minutes     = Math.floor( duration/60 ) % 60,
            hours       = Math.floor( duration/3600 );
            
        return {
            seconds : seconds,
            minutes : minutes,
            hours   : hours
        };
    }
    
    function formatTime( time )
    {
        var seconds = time.seconds < 10 ? '0'+time.seconds : time.seconds;
        var minutes = (time.hours > 0 && time.minutes < 10) ? '0'+time.minutes : time.minutes;
        
        return (time.hours>0?time.hours+':':'') + minutes + ':' + seconds;
    }
        
    ID3v2.readFrameData['APIC'] = function readPictureFrame(offset, length, data, flags, v) {
        v = v || '3';
        
        var start = offset;
        var charset = getTextEncoding( data.getByteAt(offset) );
        switch( v ) {
            case '2':
                var format = data.getStringAt(offset+1, 3);
                offset += 4;
                break;
                
            case '3':
            case '4':
                var format = data.getStringWithCharsetAt(offset+1, length - (offset-start), charset);
                offset += 1 + format.bytesReadCount;
                break;
        }
        var bite = data.getByteAt(offset, 1);
        var type = pictureType[bite];
        var desc = data.getStringWithCharsetAt(offset+1, length - (offset-start), charset);
        
        offset += 1 + desc.bytesReadCount;
        
        return {
            format : format.toString(),
            type : type,
            description : desc.toString(),
            data : data.getBytesAt(offset, (start+length) - offset)
        };
    };
    
    ID3v2.readFrameData['COMM'] = function readCommentsFrame(offset, length, data) {
        var start = offset;
        var charset = getTextEncoding( data.getByteAt(offset) );
        var language = data.getStringAt( offset+1, 3 );
        var shortdesc = data.getStringWithCharsetAt(offset+4, length-4, charset);
        
        offset += 4 + shortdesc.bytesReadCount;
        var text = data.getStringWithCharsetAt( offset, (start+length) - offset, charset );
        
        return {
            language : language,
            short_description : shortdesc.toString(),
            text : text.toString()
        };
    };
    
    ID3v2.readFrameData['COM'] = ID3v2.readFrameData['COMM'];
    
    ID3v2.readFrameData['PIC'] = function(offset, length, data, flags) {
        return ID3v2.readFrameData['APIC'](offset, length, data, flags, '2');
    };
    
    ID3v2.readFrameData['PCNT'] = function readCounterFrame(offset, length, data) {
        // FIXME: implement the rest of the spec
        return data.getInteger32At(offset);
    };
    
    ID3v2.readFrameData['CNT'] = ID3v2.readFrameData['PCNT'];
    
    ID3v2.readFrameData['T*'] = function readTextFrame(offset, length, data) {
        var charset = getTextEncoding( data.getByteAt(offset) );
        
        return data.getStringWithCharsetAt(offset+1, length-1, charset).toString();
    };
        
    ID3v2.readFrameData['TCON'] = function readGenreFrame(offset, length, data) {
        var text = ID3v2.readFrameData['T*'].apply( this, arguments );
        return text.replace(/^\(\d+\)/, '');
    };
    
    ID3v2.readFrameData['TCO'] = ID3v2.readFrameData['TCON'];
    
    //ID3v2.readFrameData['TLEN'] = function readLengthFrame(offset, length, data) {
    //    var text = ID3v2.readFrameData['T*'].apply( this, arguments );
    //    
    //    return {
    //        text : text,
    //        parsed : formatTime( getTime(parseInt(text)) )
    //    };
    //};
    
    ID3v2.readFrameData['USLT'] = function readLyricsFrame(offset, length, data) {
        var start = offset;
        var charset = getTextEncoding( data.getByteAt(offset) );
        var language = data.getStringAt( offset+1, 3 );
        var descriptor = data.getStringWithCharsetAt( offset+4, length-4, charset );
        
        offset += 4 + descriptor.bytesReadCount;
        var lyrics = data.getStringWithCharsetAt( offset, (start+length) - offset, charset );
        
        return {
            language : language,
            descriptor : descriptor.toString(),
            lyrics : lyrics.toString()
        };
    };
    
    ID3v2.readFrameData['ULT'] = ID3v2.readFrameData['USLT'];
})();

/*
 * Support for iTunes-style m4a tags
 * See:
 *   http://atomicparsley.sourceforge.net/mpeg-4files.html
 *   http://developer.apple.com/mac/library/documentation/QuickTime/QTFF/Metadata/Metadata.html
 * Authored by Joshua Kifer <joshua.kifer gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

(function(ns) {
    var ID4 = ns.ID4 = {};
    
    ID4.types = {
        '0'     : 'uint8',
        '1'     : 'text',
        '13'    : 'jpeg',
        '14'    : 'png',
        '21'    : 'uint8'
    };
    ID4.atom = {
        '©alb': ['album'],
        '©art': ['artist'],
        '©ART': ['artist'],
        'aART': ['artist'],
        '©day': ['year'],
        '©nam': ['title'],
        '©gen': ['genre'],
        'trkn': ['track'],
        '©wrt': ['composer'],
        '©too': ['encoder'],
        'cprt': ['copyright'],
        'covr': ['picture'],
        '©grp': ['grouping'],
        'keyw': ['keyword'],
        '©lyr': ['lyrics'],
        '©gen': ['genre']
    };

    ID4.loadData = function(data, callback) {
        // load the header of the first block
        data.loadRange([0, 7], function () {
            loadAtom(data, 0, data.getLength(), callback);
        });
    };

    /**
     * Make sure that the [offset, offset+7] bytes (the block header) are
     * already loaded before calling this function.
     */
    function loadAtom(data, offset, length, callback) {
        // 8 is the size of the atomSize and atomName fields.
        // When reading the current block we always read 8 more bytes in order
        // to also read the header of the next block.
        var atomSize = data.getLongAt(offset, true);
        if (atomSize == 0) return callback();
        var atomName = data.getStringAt(offset + 4, 4);
        
        // Container atoms
        if (['moov', 'udta', 'meta', 'ilst'].indexOf(atomName) > -1)
        {
            if (atomName == 'meta') offset += 4; // next_item_id (uint32)
            data.loadRange([offset+8, offset+8 + 8], function() {
                loadAtom(data, offset + 8, atomSize - 8, callback);
            });
        } else {
            // Value atoms
            var readAtom = atomName in ID4.atom;
            data.loadRange([offset+(readAtom?0:atomSize), offset+atomSize + 8], function() {
                loadAtom(data, offset+atomSize, length, callback);
            });
        }       
    };

    ID4.readTagsFromData = function(data) {
        var tag = {};
        readAtom(tag, data, 0, data.getLength());
        return tag;
    };

    function readAtom(tag, data, offset, length, indent)
    {
        indent = indent === undefined ? "" : indent + "  ";
        var seek = offset;
        while (seek < offset + length)
        {
            var atomSize = data.getLongAt(seek, true);
            if (atomSize == 0) return;
            var atomName = data.getStringAt(seek + 4, 4);
            // Container atoms
            if (['moov', 'udta', 'meta', 'ilst'].indexOf(atomName) > -1)
            {
                if (atomName == 'meta') seek += 4; // next_item_id (uint32)
                readAtom(tag, data, seek + 8, atomSize - 8, indent);
                return;
            }
            // Value atoms
            if (ID4.atom[atomName])
            {
                var klass = data.getInteger24At(seek + 16 + 1, true);
                var atom = ID4.atom[atomName];
                var type = ID4.types[klass];
                if (atomName == 'trkn')
                {
                    tag[atom[0]] = data.getByteAt(seek + 16 + 11);
                    tag['count'] = data.getByteAt(seek + 16 + 13);
                }
                else
                {
                    // 16: name + size + "data" + size (4 bytes each)
                    // 4: atom version (1 byte) + atom flags (3 bytes)
                    // 4: NULL (usually locale indicator)
                    var dataStart = seek + 16 + 4 + 4;
                    var dataEnd = atomSize - 16 - 4 - 4;
                    switch( type ) {
                        case 'text': 
                            tag[atom[0]] = data.getStringWithCharsetAt(dataStart, dataEnd, "UTF-8");
                            break;
                            
                        case 'uint8':
                            tag[atom[0]] = data.getShortAt(dataStart);
                            break;
                            
                        case 'jpeg':
                        case 'png':
                            tag[atom[0]] = {
                                format  : "image/" + type,
                                data    : data.getBytesAt(dataStart, dataEnd)
                            };
                            break;
                    }
                }
            }
            seek += atomSize;
        }
    }
    
    // Export functions for closure compiler
    ns["ID4"] = ns.ID4;
})(this);

/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso (antonio.afonso gmail.com)
 */

(function(ns) {
    var ID3v1 = ns.ID3v1 = {};
    var genres = [
    	"Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge",
    	"Hip-Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B",
    	"Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska",
    	"Death Metal","Pranks","Soundtrack","Euro-Techno","Ambient",
    	"Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance","Classical",
    	"Instrumental","Acid","House","Game","Sound Clip","Gospel",
    	"Noise","AlternRock","Bass","Soul","Punk","Space","Meditative",
    	"Instrumental Pop","Instrumental Rock","Ethnic","Gothic",
    	"Darkwave","Techno-Industrial","Electronic","Pop-Folk",
    	"Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta",
    	"Top 40","Christian Rap","Pop/Funk","Jungle","Native American",
    	"Cabaret","New Wave","Psychadelic","Rave","Showtunes","Trailer",
    	"Lo-Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro",
    	"Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock",
    	"National Folk","Swing","Fast Fusion","Bebob","Latin","Revival",
    	"Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock",
    	"Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band",
    	"Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson",
    	"Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus",
    	"Porn Groove","Satire","Slow Jam","Club","Tango","Samba",
    	"Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle",
    	"Duet","Punk Rock","Drum Solo","Acapella","Euro-House","Dance Hall"
    ];

    ID3v1.loadData = function(data, callback) {
        var length = data.getLength();
        data.loadRange([length-128-1, length], callback);
    }

    ID3v1.readTagsFromData = function(data) {
    	var offset = data.getLength() - 128;
    	var header = data.getStringAt(offset, 3);
    	if (header == "TAG") {
    		var title = data.getStringAt(offset + 3, 30).replace(/\0/g, "");
    		var artist = data.getStringAt(offset + 33, 30).replace(/\0/g, "");
    		var album = data.getStringAt(offset + 63, 30).replace(/\0/g, "");
    		var year = data.getStringAt(offset + 93, 4).replace(/\0/g, "");

    		var trackFlag = data.getByteAt(offset + 97 + 28);
    		if (trackFlag == 0) {
    			var comment = data.getStringAt(offset + 97, 28).replace(/\0/g, "");
    			var track = data.getByteAt(offset + 97 + 29);
    		} else {
    			var comment = "";
    			var track = 0;
    		}

    		var genreIdx = data.getByteAt(offset + 97 + 30);
    		if (genreIdx < 255) {
    			var genre = genres[genreIdx];
    		} else {
    			var genre = "";
    		}

    		return {
    		    "version" : '1.1',
    			"title" : title,
    			"artist" : artist,
    			"album" : album,
    			"year" : year,
    			"comment" : comment,
    			"track" : track,
    			"genre" : genre
    		}
    	} else {
    		return {};
    	}
    };
    
    // Export functions for closure compiler
    ns["ID3v1"] = ns.ID3v1;
})(this);