/**
 * Buffered Binary Ajax 0.2.1
 * Copyright (c) 2010 António Afonso, antonio.afonso gmail, http://www.aadsm.net/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Adapted from Binary Ajax 0.1.5 
 */

/**
 * This function prepares a BufferedBinaryFile object for reading the file pointed by the URL given.
 *
 * @param {String} strUrl The URL with the location of the file to be read.
 * @param {function(BufferedBinaryFile)} fncCallback The function that will be invoked when the BufferedBinaryFile is ready to be used.
 * @param {function()} fncError The function that will be invoked when an error occrus, for instance, the file pointed by the URL is doesn't exist.
 */
var BufferedBinaryAjax = function(file, fncCallback, fncError) {
    function sendRequest(file, fncCallback, fncError, byteRange) {
		var reader = createRequest();
		if (reader) {
			var iDataOffset = 0;
			if (byteRange) {
				iDataOffset = byteRange[0];
			}
			var iDataLen = file.size - byteRange[0] + 1;
			if (byteRange) {
				iDataLen = byteRange[1] - byteRange[0] + 1;
			}

			if (fncCallback) {
				if (typeof(reader.onload) != "undefined") {
					reader.onload = function(e) {
                        if (e.target.readyState == FileReader.DONE) {
                            fncCallback(e.target.result);
                            reader = null;
                        }
					};
				}
                if (typeof(reader.onload) != "undefined") {
                    reader.onerror = function(evt) {
                        var msg = 'Error ' + evt.target.error.code;
                        switch (evt.target.error.code) {
                            case FileError.NOT_READABLE_ERR:
                            msg += ': NOT_READABLE_ERR';
                            break;
                        };
                        alert(msg);
                        if (fncError) fncError();
                    };
                }
			}
            var blob = file.slice(iDataOffset, iDataLen);
			reader.readAsBinaryString(blob);
		} else {
			if (fncError) fncError();
		}
	}
    function createRequest() {
		var reader = null;
		if (window.FileReader) {
			reader = new FileReader();
		}
		return reader;
	}
    
    /**
     * @class Reads a remote file without having to download it all.
     *
     * Creates a new BufferedBinaryFile that will download chunks of the file pointed by the URL given only on a per need basis.
     *
     * @param {File} file The file to be read.
     *
     * @constructor
     * @augments BinaryFile
     */
    function BufferedBinaryFile(file) {
        var undefined;
        var downloadedBytesCount = 0;
        var binaryFile = new BinaryFile("", 0, file.size);
        var bytes = [];
        
        /**
         * @param {?function()} callback If a function is passed then this function will be asynchronous and the callback invoked when the blocks have been loaded, otherwise it blocks script execution until the request is completed.
         */
        function waitForBytes(byteRange, callback) {
            // Filter out already downloaded blocks or return if found out that
            // the entire block range has already been downloaded.
            while( bytes[byteRange[0]] ) {
                byteRange[0]++;
                if( byteRange[0] > byteRange[1] ) return callback ? callback() : undefined;
            }
            while( bytes[byteRange[1]] ) {
                byteRange[1]--;
                if( byteRange[0] > byteRange[1] ) return callback ? callback() : undefined;
            }
            
            sendRequest(
                file,
                function(data) {
                    console.log(data);
                    if (callback) callback();
                },
                fncError,
                byteRange,
                !!callback
            );
        }
        
        this.getByteAt = function(iOffset) {
		    var byteData = bytes[iOffset];
		    return byteData;
		};
        
        // Mixin all BinaryFile's methods.
        // Not using prototype linking since the constructor needs to know
        // the length of the file.
        for( var key in binaryFile ) {
            if( binaryFile.hasOwnProperty(key) &&
                typeof binaryFile[key] === "function") {
                this[key] = binaryFile[key];
            }
        }
		/**
		 * Downloads the byte range given. Useful for preloading.
		 *
		 * @param {Array} range Two element array that denotes the first byte to be read on the first position and the last byte to be read on the last position. A range of [2, 5] will download bytes 2,3,4 and 5.
		 * @param {?function()} callback The function to invoke when the blocks have been downloaded, this makes this call asynchronous.
		 */
		this.loadRange = function(range, callback) {
		    waitForBytes(range, callback);
		};
    }
    
    function init() {
        fncCallback(new BufferedBinaryFile(file));
    }
    
    init();
};

/**
 * @constructor
 */
function BinaryFile(strData, iDataOffset, iDataLength) {
	var data = strData;
	var dataOffset = iDataOffset || 0;
	var dataLength = 0;

	this.getRawData = function() {
		return data;
	};

	if (typeof strData == "string") {
		dataLength = iDataLength || data.length;

		this.getByteAt = function(iOffset) {
			return data.charCodeAt(iOffset + dataOffset) & 0xFF;
		};
	} else if (typeof strData == "unknown") {
		dataLength = iDataLength || IEBinary_getLength(data);

		this.getByteAt = function(iOffset) {
			return IEBinary_getByteAt(data, iOffset + dataOffset);
		};
	}
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
		return window.btoa(data);
	};
	this.fromBase64 = function(strBase64) {
		data = window.atob(strBase64);
	};
	
    this.loadRange = function(range, callback) {
        callback();
    };
}

document.write(
	"<script type='text/vbscript'>\r\n"
	+ "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
	+ "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
	+ "End Function\r\n"
	+ "Function IEBinary_getLength(strBinary)\r\n"
	+ "	IEBinary_getLength = LenB(strBinary)\r\n"
	+ "End Function\r\n"
	+ "</script>\r\n"
);
