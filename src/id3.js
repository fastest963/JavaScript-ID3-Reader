
(function() {

    /**
    * Copyright (c) 2010, António Afonso <antonio.afonso gmail.com>. All rights reserved.
    *
    * Redistribution and use in source and binary forms, with or without modification, are
    * permitted provided that the following conditions are met:
    *
    *    1. Redistributions of source code must retain the above copyright notice, this list of
    *       conditions and the following disclaimer.
    *
    *    2. Redistributions in binary form must reproduce the above copyright notice, this list
    *       of conditions and the following disclaimer in the documentation and/or other materials
    *       provided with the distribution.
    *
    * THIS SOFTWARE IS PROVIDED BY António Afonso ``AS IS'' AND ANY EXPRESS OR IMPLIED
    * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
    * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
    * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
    * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
    * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */
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

    /*
     * JavaScript ID3 Tag Reader 0.1.2
     * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
     * MIT License [http://www.opensource.org/licenses/mit-license.php]
     *
     * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
     * Modified by António Afonso (antonio.afonso gmail.com)
     * Modified by James Hartig <james.hartig@grooveshark.com>
     */

    var ID3v1 = {
        version: "ID3v1",
        _genres: [
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
        ],

        loadData: function(dataReader, callback) {
            var length = dataReader.getLength();
            dataReader.loadRange([length-128-1, length], callback);
        },

        readTagsFromData: function(dataReader, tags) {
            var foundTags = {version: '1.1'},
                offset = dataReader.getLength() - 128;
            if (offset < 0) {
                return foundTags;
            }
            if (!tags || tags.title) {
                foundTags.title = dataReader.getStringAt(offset + 3, 30).replace(/\0/g, "");
            }
            if (!tags || tags.artist) {
                foundTags.artist = dataReader.getStringAt(offset + 33, 30).replace(/\0/g, "");
            }
            if (!tags || tags.album) {
                foundTags.album = dataReader.getStringAt(offset + 63, 30).replace(/\0/g, "");
            }
            if (!tags || tags.year) {
                foundTags.year = dataReader.getStringAt(offset + 93, 4).replace(/\0/g, "");
            }
            if (!tags || tags.track || track.comment) {
                foundTags.year = dataReader.getStringAt(offset + 93, 4).replace(/\0/g, "");
                var trackFlag = dataReader.getByteAt(offset + 97 + 28);
                if (trackFlag == 0) {
                    if (!tags || tags.track) {
                        foundTags.comment = data.getStringAt(offset + 97, 28).replace(/\0/g, "");
                    }
                    if (!tags || tags.track) {
                        foundTags.track = data.getByteAt(offset + 97 + 29);
                    }
                } else {
                    foundTags.comment = "";
                    foundTags.track = 0;
                }
            }
            if (!tags || tags.genre) {
                var genreIdx = data.getByteAt(offset + 97 + 30);
                if (genreIdx < 255) {
                    foundTags.genre = this._genres[genreIdx];
                } else {
                    foundTags.genre = "";
                }
            }

            return foundTags;
        }
    };

    /*
     * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
     * Modified by António Afonso <antonio.afonso gmail.com>
     * Modified by James Hartig <james.hartig@grooveshark.com>
     */

    var ID3v2 = {
        version: "ID3v2",
        _shortcuts: {
            //todo: add more shortcuts
            title     : ["TIT2", "TT2"],
            artist    : ["TPE1", "TP1"],
            album     : ["TALB", "TAL"],
            year      : ["TYER", "TYE"],
            comment   : ["COMM", "COM"],
            track     : ["TRCK", "TRK"],
            genre     : ["TCON", "TCO"],
            picture   : ["APIC", "PIC"],
            lyrics    : ["USLT", "ULT"]
        },

        _readFrameData: {
            _pictureType: [
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
            ],
            _getTextEncoding: function(bite) {
                var charset;
                switch(bite) {
                    case 0x00:
                        return 'iso-8859-1';
                    case 0x01:
                        return 'utf-16';
                    case 0x02:
                        return 'utf-16be';
                    case 0x03:
                        return 'utf-8';
                }
                return null;
            },

            //picture
            APIC: function(offset, length, data, flags, v) {
                v = v || '3';

                var start = offset,
                    charset = this._getTextEncoding(data.getByteAt(offset)),
                    format = null;
                switch( v ) {
                    case '2':
                        format = data.getStringAt(offset + 1, 3);
                        offset += 4;
                        break;

                    case '3':
                    case '4':
                        format = data.getStringWithCharsetAt(offset + 1, length - (offset - start), charset);
                        offset += 1 + format.bytesReadCount;
                        break;
                }
                var bite = data.getByteAt(offset, 1);
                var type = this._pictureType[bite];
                var desc = data.getStringWithCharsetAt(offset + 1, length - (offset - start), charset);

                offset += 1 + desc.bytesReadCount;

                return {
                    "format" : format.toString(),
                    "type" : type,
                    "description" : desc.toString(),
                    "data" : data.getBytesAt(offset, (start + length) - offset)
                };
            },
            PIC: function(offset, length, data, flags) {
                return this.APIC(offset, length, data, flags, '2');
            },

            //comment
            COMM: function(offset, length, data) {
                var start = offset;
                var charset = this._getTextEncoding(data.getByteAt(offset));
                var language = data.getStringAt(offset + 1, 3);
                var shortdesc = data.getStringWithCharsetAt(offset + 4, length - 4, charset);

                offset += 4 + shortdesc.bytesReadCount;
                var text = data.getStringWithCharsetAt(offset, (start + length) - offset, charset);

                return {
                    language : language,
                    short_description : shortdesc.toString(),
                    text : text.toString()
                };
            },
            COM: function(offset, length, data) {
                return this.COMM(offset, length, data);
            },

            //text
            T: function(offset, length, data) {
                var charset = this._getTextEncoding(data.getByteAt(offset));
                return data.getStringWithCharsetAt(offset + 1, length - 1, charset).toString();
            },
            //genre
            TCON: function(offset, length, data) {
                var text = this.T.apply(this, arguments);
                return text.replace(/^\(\d+\)/, '');
            },
            TCO: function(offset, length, data) {
                return this.TCON(offset, length, data);
            },

            //lyrics
            USLT: function(offset, length, data) {
                var start = offset;
                var charset = this._getTextEncoding(data.getByteAt(offset));
                var language = data.getStringAt(offset + 1, 3);
                var descriptor = data.getStringWithCharsetAt(offset + 4, length - 4, charset);

                offset += 4 + descriptor.bytesReadCount;
                var lyrics = data.getStringWithCharsetAt(offset, (start + length) - offset, charset);

                return {
                    language : language,
                    descriptor : descriptor.toString(),
                    lyrics : lyrics.toString()
                };
            },
            ULT: function(offset, length, data) {
                return this.USLT(offset, length, data);
            }
        },

        _getTagsFromShortcuts: function(shortcuts) {
            var tags = {};
            for(var c in shortcuts) {
                if (shortcuts.hasOwnProperty(c) && this._shortcuts[c]) {
                    for (var j = 0; j < this._shortcuts[c].length; j++) {
                        if (this._shortcuts[c][j]) {
                            tags[this._shortcuts[c][j]] = 1;
                        }
                    }
                } else if (shortcuts.hasOwnProperty(c)) {
                    tags[c] = 1;
                }
            }
            return tags;
        },

        // The ID3v2 tag/frame size is encoded with four bytes where the most significant bit (bit 7) is set to zero in every byte, making a total of 28 bits. The zeroed bits are ignored, so a 257 bytes long tag is represented as $00 00 02 01.
        _readSynchsafeInteger32At: function(offset, dataReader) {
            var size1 = dataReader.getByteAt(offset);
            var size2 = dataReader.getByteAt(offset + 1);
            var size3 = dataReader.getByteAt(offset + 2);
            var size4 = dataReader.getByteAt(offset + 3);
            // 0x7f = 0b01111111
            return size4 & 0x7f
                     | ((size3 & 0x7f) << 7)
                     | ((size2 & 0x7f) << 14)
                     | ((size1 & 0x7f) << 21);
        },

        _readFrameFlags: function(data, offset) {
            return {
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
        },

        /** All the frames consists of a frame header followed by one or more fields containing the actual information.
         * The frame ID made out of the characters capital A-Z and 0-9. Identifiers beginning with "X", "Y" and "Z" are for experimental use and free for everyone to use, without the need to set the experimental bit in the tag header. Have in mind that someone else might have used the same identifier as you. All other identifiers are either used or reserved for future use.
         * The frame ID is followed by a size descriptor, making a total header size of ten bytes in every frame. The size is calculated as frame size excluding frame header (frame size - 10).
         */
        _readFrames: function(offset, end, dataReader, id3header, tags) {
            var frames = {};
            var frameDataSize;
            var major = id3header["major"];

            tags = this._getTagsFromShortcuts(tags || {title: 1, artist: 1, album: 1, track: 1, year: 1, genre: 1});

            while (offset < end) {
                var readFrameFunc = null,
                    frameDataOffset = offset,
                    flags = null,
                    frameID, frameSize, frameHeaderSize;

                switch (major) {
                    case 2:
                        frameID = dataReader.getStringAt(frameDataOffset, 3);
                        frameSize = dataReader.getInteger24At(frameDataOffset + 3, true);
                        frameHeaderSize = 6;
                        break;
                    case 3:
                        frameID = dataReader.getStringAt(frameDataOffset, 4);
                        frameSize = dataReader.getLongAt(frameDataOffset + 4, true);
                        frameHeaderSize = 10;
                        break;
                    case 4:
                        frameID = dataReader.getStringAt(frameDataOffset, 4);
                        frameSize = this._readSynchsafeInteger32At(frameDataOffset + 4, dataReader);
                        frameHeaderSize = 10;
                        break;
                }

                if (!frameID || frameID == "") {
                    break;
                }

                // advance data offset to the next frame data
                offset += frameHeaderSize + frameSize;


                if (!tags[frameID]) {
                    continue;
                }

                // read frame message and format flags
                if (major > 2) {
                    flags = this._readFrameFlags(dataReader, frameDataOffset+8);
                }

                frameDataOffset += frameHeaderSize;

                // the first 4 bytes are the real data size
                // (after unsynchronisation && encryption)
                if (flags && flags.format.data_length_indicator) {
                    frameDataSize = this._readSynchsafeInteger32At(frameDataOffset, dataReader);
                    frameDataOffset += 4;
                    frameSize -= 4;
                }

                // TODO: support unsynchronisation
                if (flags && flags.format.unsynchronisation) {
                    //dataReader = removeUnsynchronisation(dataReader, frameSize);
                    continue;
                }

                // find frame parsing function
                if (this._readFrameData[frameID]) {
                    readFrameFunc = this._readFrameData[frameID];
                } else if (this._readFrameData[frameID[0]]) {
                    readFrameFunc = this._readFrameData[frameID[0]];
                }

                var parsedData = null;
                if (readFrameFunc) {
                    //todo: pic version?!?
                    parsedData = readFrameFunc.call(this._readFrameData, frameDataOffset, frameSize, dataReader, flags);
                }

                //todo: what do we do about possible overwriting?
                frames[frameID] = parsedData;
            }

            return frames;
        },

        loadData: function(dataReader, callback) {
            var f = this._readSynchsafeInteger32At;
            dataReader.loadRange([0, 9], function() {
                dataReader.loadRange([0, f(6, dataReader)], callback);
            });
        },

        //http://www.id3.org/id3v2.3.0
        readTagsFromData: function(dataReader, tags) {
            var offset = 0,
                major = dataReader.getByteAt(offset + 3);
                //todo: figure out why we don't support 4+
            if (major > 4) { return {version: '2.' + major}; }
            var revision = dataReader.getByteAt(offset + 4),
                unsynch = dataReader.isBitSetAt(offset + 5, 7),
                xheader = dataReader.isBitSetAt(offset + 5, 6),
                xindicator = dataReader.isBitSetAt(offset + 5, 5),
                size = this._readSynchsafeInteger32At(offset + 6, dataReader);

            offset += 10;

            if (xheader) {
                var xheadersize = dataReader.getLongAt(offset, true);
                // The 'Extended header size', currently 6 or 10 bytes, excludes itself.
                offset += xheadersize + 4;
            }

            var id3 = {
                    version : '2.' + major + '.' + revision,
                    major : major,
                    revision : revision,
                    flags : {
                        unsynchronisation : unsynch,
                        extended_header : xheader,
                        experimental_indicator : xindicator
                    },
                    size : size
                },
                foundTags = unsynch ? {} : this._readFrames(offset, size-10, dataReader, id3, tags);

            foundTags.version = '2.' + major;
            for (var name in this._shortcuts) {
                if (this._shortcuts.hasOwnProperty(name) && (!tags || tags[name])) {
                    var ids = this._shortcuts[name];
                    for (var i = 0, l = ids.length; i < l; i++) {
                        if (ids[i] && foundTags[ids[i]]) {
                            foundTags[name] = foundTags[ids[i]];
                            break;
                        }
                    }
                }
            }
            return foundTags;
        }

    };

    /*
     * Binary Ajax 0.1.5
     * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
     * MIT License [http://www.opensource.org/licenses/mit-license.php]
     *
     * Extended by António Afonso <antonio.afonso gmail.com>
     * Modified by James Hartig <james.hartig@grooveshark.com>
     */

    var BinaryFile = function(file, strData) {

        var data = strData || "",
            dataLength = file.size || strData.length,
            loaded = strData ? [0, strData.length] : [0, -1];

        this.getRawData = function() {
            return data;
        };

        this.getByteAt = function(iOffset) {
            return data.charCodeAt(iOffset) & 0xFF;
        };

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

        //sending 0,3 would load the first 3 characters
        this.loadRange = function(range, callback) {
            if (!window.FileReader) {
                return;
            }
            var reader = new FileReader();

            if (range) {
                if (range.length == 1) {
                    range = [0, range[1]];
                }
                if (loaded[0] <= range[0] || loaded[1] >= range[0]) {
                    if (loaded[1] >= range[1]) { //woo! we have all the data
                        if (callback) {
                            callback();
                        }
                        return;
                    }
                }
                // if they want to start outside, then just load that range
                /* else if (range[1] < loaded[1]) {
                    range[1] = loaded[1];
                }*/
            }

            if (typeof(reader.onloadend) != "undefined") {
                reader.onloadend = function(e) {
                    if (e.target.readyState == FileReader.DONE) {
                        data = e.target.result;
                        loaded = [range[0], range[0] + data.length];
                        if (callback) {
                            callback();
                        }
                        reader = null;
                    }
                };
            }
            if (typeof(reader.onerror) != "undefined") {
                reader.onerror = function(evt) {
                    //todo: do something
                };
            }
            var blob = file;
            if (range && range.length == 2) {
                if (file.webkitSlice) {
                    blob = file.webkitSlice(range[0], range[1]);
                } else if (file.mozSlice) {
                    blob = file.mozSlice(range[0], range[1]);
                }
            } else {
                range = [0, file.length];
            }

            //note this is deprecated according to spec
            reader.readAsBinaryString(blob);
        };
    };

    /*
     * JavaScript ID3 Tag Reader 0.1.2
     * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
     * MIT License [http://www.opensource.org/licenses/mit-license.php]
     *
     * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
     * Modified by António Afonso <antonio.afonso gmail.com>
     * Modified by James Hartig <james.hartig@grooveshark.com>
     */

    window.ID3 = {
        loadTags: function(options) {
            var dataReader = options.dataReader || new BinaryFile(options.file, options.stringData);

            //load the format identifier
            //preload the first 9 bytes for id3v2
            dataReader.loadRange([0, 9], function() {
                var reader = null,
                    data = dataReader.getStringAt(0, 3);

                if (data == "TAG") {
                    reader = ID3v1;
                } else if (data == "ID3") {
                    reader = ID3v2;
                } else {
                    if (options.error) {
                        options.error([]);
                    }
                    return;
                }

                reader.loadData(dataReader, function() {
                    var tags = reader.readTagsFromData(dataReader, options.tags);
                    if (options.success) {
                        options.success(tags);
                    }
                });
            });
        }
    };

})();
