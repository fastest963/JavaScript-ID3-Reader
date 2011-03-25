
/*
 * Binary Ajax 0.1.5
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Extended by António Afonso <antonio.afonso gmail.com>
 */
var BinaryFile = function(strData, iDataOffset, iDataLength) {
	var data = strData;
	var dataOffset = iDataOffset || 0;
	var dataLength = 0;

	this.getRawData = function() {
		return data;
	}

	if (typeof strData == "string") {
		dataLength = iDataLength || data.length;

		this.getByteAt = function(iOffset) {
			return data.charCodeAt(iOffset + dataOffset) & 0xFF;
		}
	} else if (typeof strData == "unknown") {
		dataLength = iDataLength || IEBinary_getLength(data);

		this.getByteAt = function(iOffset) {
			return IEBinary_getByteAt(data, iOffset + dataOffset);
		}
	}
    // @aadsm
    this.getBytesAt = function(iOffset, iLength) {
        var bytes = new Array(iLength);
        for( var i = 0; i < iLength; i++ ) {
            bytes[i] = this.getByteAt(iOffset+i);
        }
        return bytes;
    }

	this.getLength = function() {
		return dataLength;
	}

    // @aadsm
    this.isBitSetAt = function(iOffset, iBit) {
        var iByte = this.getByteAt(iOffset);
        return (iByte & (1 << iBit)) != 0;
    }

	this.getSByteAt = function(iOffset) {
		var iByte = this.getByteAt(iOffset);
		if (iByte > 127)
			return iByte - 256;
		else
			return iByte;
	}

	this.getShortAt = function(iOffset, bBigEndian) {
		var iShort = bBigEndian ? 
			(this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
			: (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
		if (iShort < 0) iShort += 65536;
		return iShort;
	}
	this.getSShortAt = function(iOffset, bBigEndian) {
		var iUShort = this.getShortAt(iOffset, bBigEndian);
		if (iUShort > 32767)
			return iUShort - 65536;
		else
			return iUShort;
	}
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
	}
	this.getSLongAt = function(iOffset, bBigEndian) {
		var iULong = this.getLongAt(iOffset, bBigEndian);
		if (iULong > 2147483647)
			return iULong - 4294967296;
		else
			return iULong;
	}
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
    }
	this.getStringAt = function(iOffset, iLength) {
		var aStr = [];
		for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
			aStr[j] = String.fromCharCode(this.getByteAt(i));
		}
		return aStr.join("");
	}
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
	}

	this.getCharAt = function(iOffset) {
		return String.fromCharCode(this.getByteAt(iOffset));
	}
	this.toBase64 = function() {
		return window.btoa(data);
	}
	this.fromBase64 = function(strBase64) {
		data = window.atob(strBase64);
	}
}

var BinaryAjax = (function() {

	function createRequest() {
		var reader = null;
		if (window.FileReader) {
			reader = new FileReader();
		}
		return reader;
	}
    
	function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
		var reader = createRequest();
        var binaryResponse = new BinaryFile("", 0, 0);
        
		if (reader) {
			if (fncCallback) {
				if (typeof(reader.onload) != "undefined") {
					reader.onload = function(e) {
					    if (e.target.readyState == FileReader.DONE) {
                            this.fileSize = (e.target.result).length;
                            binaryResponse = new BinaryFile(e.target.result, 0, this.fileSize);                            
                            
                            for( var key in binaryResponse ) {
                                if( binaryResponse.hasOwnProperty(key) &&
                                    typeof binaryResponse[key] === "function") {
                                    this[key] = binaryResponse[key];
                                }
                            }
                            
                            binaryResponse.loadRange = function(range, callback) {
                                callback();
                            };
                            
                            fncCallback(binaryResponse);
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
            reader.readAsBinaryString(strURL);
		} else {
			if (fncError) fncError();
		}
	}
    
    return function(strURL, fncCallback, fncError, aRange) {

		/*if (aRange) {
			getHead(
				strURL, 
				function(reader) {
					var iLength = parseInt(reader.getResponseHeader("Content-Length"),10) || -1;
					var strAcceptRanges = reader.getResponseHeader("Accept-Ranges");

					var iStart, iEnd;
					iStart = aRange[0];
					if (aRange[0] < 0 ) 
						iStart += iLength;
					iEnd = iStart + aRange[1] - 1;
					if( iStart >= 0 ) {
					    sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
					} else {
					    sendRequest(strURL, fncCallback, fncError);
					}
				}
			);

		} else {*/
			sendRequest(strURL, fncCallback, fncError);
		//}
	}

}());


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
