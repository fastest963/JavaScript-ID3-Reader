(function(){var t=function(){function b(b,k){var h=b[0],g=b[1],e=b[2],a=b[3],h=c(h,g,e,a,k[0],7,-680876936),a=c(a,h,g,e,k[1],12,-389564586),e=c(e,a,h,g,k[2],17,606105819),g=c(g,e,a,h,k[3],22,-1044525330),h=c(h,g,e,a,k[4],7,-176418897),a=c(a,h,g,e,k[5],12,1200080426),e=c(e,a,h,g,k[6],17,-1473231341),g=c(g,e,a,h,k[7],22,-45705983),h=c(h,g,e,a,k[8],7,1770035416),a=c(a,h,g,e,k[9],12,-1958414417),e=c(e,a,h,g,k[10],17,-42063),g=c(g,e,a,h,k[11],22,-1990404162),h=c(h,g,e,a,k[12],7,1804603682),a=c(a,h,g,e,
k[13],12,-40341101),e=c(e,a,h,g,k[14],17,-1502002290),g=c(g,e,a,h,k[15],22,1236535329),h=f(h,g,e,a,k[1],5,-165796510),a=f(a,h,g,e,k[6],9,-1069501632),e=f(e,a,h,g,k[11],14,643717713),g=f(g,e,a,h,k[0],20,-373897302),h=f(h,g,e,a,k[5],5,-701558691),a=f(a,h,g,e,k[10],9,38016083),e=f(e,a,h,g,k[15],14,-660478335),g=f(g,e,a,h,k[4],20,-405537848),h=f(h,g,e,a,k[9],5,568446438),a=f(a,h,g,e,k[14],9,-1019803690),e=f(e,a,h,g,k[3],14,-187363961),g=f(g,e,a,h,k[8],20,1163531501),h=f(h,g,e,a,k[13],5,-1444681467),a=
f(a,h,g,e,k[2],9,-51403784),e=f(e,a,h,g,k[7],14,1735328473),g=f(g,e,a,h,k[12],20,-1926607734),h=d(g^e^a,h,g,k[5],4,-378558),a=d(h^g^e,a,h,k[8],11,-2022574463),e=d(a^h^g,e,a,k[11],16,1839030562),g=d(e^a^h,g,e,k[14],23,-35309556),h=d(g^e^a,h,g,k[1],4,-1530992060),a=d(h^g^e,a,h,k[4],11,1272893353),e=d(a^h^g,e,a,k[7],16,-155497632),g=d(e^a^h,g,e,k[10],23,-1094730640),h=d(g^e^a,h,g,k[13],4,681279174),a=d(h^g^e,a,h,k[0],11,-358537222),e=d(a^h^g,e,a,k[3],16,-722521979),g=d(e^a^h,g,e,k[6],23,76029189),h=
d(g^e^a,h,g,k[9],4,-640364487),a=d(h^g^e,a,h,k[12],11,-421815835),e=d(a^h^g,e,a,k[15],16,530742520),g=d(e^a^h,g,e,k[2],23,-995338651),h=l(h,g,e,a,k[0],6,-198630844),a=l(a,h,g,e,k[7],10,1126891415),e=l(e,a,h,g,k[14],15,-1416354905),g=l(g,e,a,h,k[5],21,-57434055),h=l(h,g,e,a,k[12],6,1700485571),a=l(a,h,g,e,k[3],10,-1894986606),e=l(e,a,h,g,k[10],15,-1051523),g=l(g,e,a,h,k[1],21,-2054922799),h=l(h,g,e,a,k[8],6,1873313359),a=l(a,h,g,e,k[15],10,-30611744),e=l(e,a,h,g,k[6],15,-1560198380),g=l(g,e,a,h,k[13],
21,1309151649),h=l(h,g,e,a,k[4],6,-145523070),a=l(a,h,g,e,k[11],10,-1120210379),e=l(e,a,h,g,k[2],15,718787259),g=l(g,e,a,h,k[9],21,-343485551);b[0]=p(h,b[0]);b[1]=p(g,b[1]);b[2]=p(e,b[2]);b[3]=p(a,b[3])}function d(b,a,c,d,e,f){a=p(p(a,b),p(d,f));return p(a<<e|a>>>32-e,c)}function c(b,a,c,g,e,f,m){return d(a&c|~a&g,b,a,e,f,m)}function f(b,a,c,g,e,f,m){return d(a&g|c&~g,b,a,e,f,m)}function l(b,a,c,g,e,f,m){return d(c^(a|~g),b,a,e,f,m)}function a(a){var c=a.length,d=[1732584193,-271733879,-1732584194,
271733878],g;for(g=64;g<=a.length;g+=64)b(d,n(a.substring(g-64,g)));a=a.substring(g-64);var e=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(g=0;g<a.length;g++)e[g>>2]|=a.charCodeAt(g)<<(g%4<<3);e[g>>2]|=128<<(g%4<<3);if(55<g)for(b(d,e),g=0;16>g;g++)e[g]=0;e[14]=8*c;b(d,e);return d}function n(a){var b=[],c;for(c=0;64>c;c+=4)b[c>>2]=a.charCodeAt(c)+(a.charCodeAt(c+1)<<8)+(a.charCodeAt(c+2)<<16)+(a.charCodeAt(c+3)<<24);return b}function m(a){for(var b=0;b<a.length;b++){for(var c=a,d=b,e=a[b],f="",m=0;4>m;m++)f+=
q[e>>8*m+4&15]+q[e>>8*m&15];c[d]=f}return a.join("")}function p(a,b){return a+b&4294967295}this.init=function(){return[1732584193,-271733879,-1732584194,271733878,0,""]};this.update=function(a,c){a||(a=this.init());a[4]+=c.length;""!=a[5]&&(c=a[5]+c,a[5]="");for(var d=64;d<=c.length;d+=64)b(a,n(c.substring(d-64,d)));a[5]+=c.substring(d-64);return a};this.finalize=function(a){var c,d="",g=a[4];""!=a[5]&&(d=a[5],a[5]="",64<=d.length&&(a=this.update(a,d)));var d=d.substr(g%64*-1),e=[0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0];for(c=0;c<d.length;c++)e[c>>2]|=d.charCodeAt(c)<<(c%4<<3);e[c>>2]|=128<<(c%4<<3);if(55<c)for(b(a,e),c=0;16>c;c++)e[c]=0;e[14]=8*g;b(a,e);a.pop();a.pop();return m(a)};var q="0123456789abcdef".split("");"5d41402abc4b2a76b9719d911017c592"!=m(a("hello"))&&(p=function(a,b){var c=(a&65535)+(b&65535);return(a>>16)+(b>>16)+(c>>16)<<16|c&65535});this.hash=function(b){return m(a(b))};return this}(),u={readUTF16String:function(b,d,c){var f=0,l=1,a=0;c=Math.min(c||b.length,b.length);254==b[0]&&
255==b[1]?(d=!0,f=2):255==b[0]&&254==b[1]&&(d=!1,f=2);d&&(l=0,a=1);d=[];for(var n=0;f<c;n++){var m=b[f+l],p=(m<<8)+b[f+a],f=f+2;if(0==p)break;else 216>m||224<=m?d[n]=String.fromCharCode(p):(m=(b[f+l]<<8)+b[f+a],f+=2,d[n]=String.fromCharCode(p,m))}b=new String(d.join(""));b.bytesReadCount=f;return b},readUTF8String:function(b,d){var c=0;d=Math.min(d||b.length,b.length);239==b[0]&&187==b[1]&&191==b[2]&&(c=3);for(var f=[],l=0;c<d;l++){var a=b[c++];if(0==a)break;else if(128>a)f[l]=String.fromCharCode(a);
else if(194<=a&&224>a){var n=b[c++];f[l]=String.fromCharCode(((a&31)<<6)+(n&63))}else if(224<=a&&240>a){var n=b[c++],m=b[c++];f[l]=String.fromCharCode(((a&255)<<12)+((n&63)<<6)+(m&63))}else if(240<=a&&245>a){var n=b[c++],m=b[c++],p=b[c++],a=((a&7)<<18)+((n&63)<<12)+((m&63)<<6)+(p&63)-65536;f[l]=String.fromCharCode((a>>10)+55296,(a&1023)+56320)}}f=new String(f.join(""));f.bytesReadCount=c;return f},readNullTerminatedString:function(b,d){var c=[];d=d||b.length;for(var f=0;f<d;){var l=b[f++];if(0==l)break;
c[f-1]=String.fromCharCode(l)}c=new String(c.join(""));c.bytesReadCount=f;return c}},v={version:"ID3v1",_genres:"Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";"),
loadData:function(b,d){var c=b.getLength();b.loadRange([c-128,c],d)},getID3DataRange:function(b,d){var c=b.getLength();d(c-128,c)},readTagsFromData:function(b,d){var c={version:"1.1"},f=b.getLength()-128;if(0>f)return c;if(!d||d.title)c.title=b.getStringAt(f+3,30).replace(/\0|\s+$/g,"");if(!d||d.artist)c.artist=b.getStringAt(f+33,30).replace(/\0|\s+$/g,"");if(!d||d.album)c.album=b.getStringAt(f+63,30).replace(/\0|\s+$/g,"");if(!d||d.year)c.year=b.getStringAt(f+93,4).replace(/\0|\s+$/g,"");if(!d||
d.track||track.comment)if(c.year=b.getStringAt(f+93,4).replace(/\0|\s+$/g,""),0==b.getByteAt(f+97+28)){if(!d||d.track)c.comment=b.getStringAt(f+97,28).replace(/\0|\s+$/g,"");if(!d||d.track)c.track=b.getByteAt(f+97+29)}else c.comment="",c.track=0;if(!d||d.genre)f=b.getByteAt(f+97+30),c.genre=255>f?this._genres[f]:"";return c}},z={version:"ID3v2",_shortcuts:{title:["TIT2","TT2"],artist:["TPE1","TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON",
"TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},_readFrameData:{_pictureType:"32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";"),_getTextEncoding:function(b){switch(b){case 0:return"iso-8859-1";
case 1:return"utf-16";case 2:return"utf-16be";case 3:return"utf-8"}return null},APIC:function(b,d,c,f,l){l=l||"3";f=b;var a=this._getTextEncoding(c.getByteAt(b)),n=null;switch(l){case "2":n=c.getStringAt(b+1,3);b+=4;break;case "3":case "4":n=c.getStringWithCharsetAt(b+1,d-(b-f),a),b+=1+n.bytesReadCount}l=c.getByteAt(b,1);l=this._pictureType[l];a=c.getStringWithCharsetAt(b+1,d-(b-f),a);b+=1+a.bytesReadCount;return{format:n.toString(),type:l,description:a.toString(),data:c.getBytesAt(b,f+d-b)}},PIC:function(b,
d,c,f){return this.APIC(b,d,c,f,"2")},COMM:function(b,d,c){var f=b,l=this._getTextEncoding(c.getByteAt(b)),a=c.getStringAt(b+1,3),n=c.getStringWithCharsetAt(b+4,d-4,l);b+=4+n.bytesReadCount;b=c.getStringWithCharsetAt(b,f+d-b,l);return{language:a,short_description:n.toString(),text:b.toString()}},COM:function(b,d,c){return this.COMM(b,d,c)},T:function(b,d,c){var f=this._getTextEncoding(c.getByteAt(b));return c.getStringWithCharsetAt(b+1,d-1,f).toString()},TCON:function(b,d,c){return this.T.apply(this,
arguments).replace(/^\(\d+\)/,"")},TCO:function(b,d,c){return this.TCON(b,d,c)},USLT:function(b,d,c){var f=b,l=this._getTextEncoding(c.getByteAt(b)),a=c.getStringAt(b+1,3),n=c.getStringWithCharsetAt(b+4,d-4,l);b+=4+n.bytesReadCount;b=c.getStringWithCharsetAt(b,f+d-b,l);return{language:a,descriptor:n.toString(),lyrics:b.toString()}},ULT:function(b,d,c){return this.USLT(b,d,c)}},_getTagsFromShortcuts:function(b){var d={},c;for(c in b)if(b.hasOwnProperty(c)&&this._shortcuts[c])for(var f=0;f<this._shortcuts[c].length;f++)this._shortcuts[c][f]&&
(d[this._shortcuts[c][f]]=1);else b.hasOwnProperty(c)&&(d[c]=1);return d},_readSynchsafeInteger32At:function(b,d){var c=d.getByteAt(b),f=d.getByteAt(b+1),l=d.getByteAt(b+2);return d.getByteAt(b+3)&127|(l&127)<<7|(f&127)<<14|(c&127)<<21},_readFrameFlags:function(b,d){return{message:{tag_alter_preservation:b.isBitSetAt(d,6),file_alter_preservation:b.isBitSetAt(d,5),read_only:b.isBitSetAt(d,4)},format:{grouping_identity:b.isBitSetAt(d+1,7),compression:b.isBitSetAt(d+1,3),encription:b.isBitSetAt(d+1,
2),unsynchronisation:b.isBitSetAt(d+1,1),data_length_indicator:b.isBitSetAt(d+1,0)}}},_readFrames:function(b,d,c,f,l){var a={};f=f.major;for(l=this._getTagsFromShortcuts(l||{title:1,artist:1,album:1,track:1,year:1,genre:1});b<d;){var n=null,m=b,p=null,q,r,k;switch(f){case 2:q=c.getStringAt(m,3);r=c.getInteger24At(m+3,!0);k=6;break;case 3:0===q.charCodeAt(3)&&q.substr(0,3);q=c.getStringAt(m,4);r=c.getLongAt(m+4,!0);k=10;break;case 4:0===q.charCodeAt(3)&&q.substr(0,3),q=c.getStringAt(m,4),r=this._readSynchsafeInteger32At(m+
4,c),k=10}if(!q||""==q)break;b+=k+r;if(l[q]&&(2<f&&(p=this._readFrameFlags(c,m+8)),m+=k,p&&p.format.data_length_indicator&&(this._readSynchsafeInteger32At(m,c),m+=4,r-=4),!p||!p.format.unsynchronisation)){this._readFrameData[q]?n=this._readFrameData[q]:this._readFrameData[q[0]]&&(n=this._readFrameData[q[0]]);var h=null;n&&(h=n.call(this._readFrameData,m,r,c,p));a[q]=h}}return a},loadData:function(b,d){var c=this._readSynchsafeInteger32At;b.loadRange([0,10],function(){b.loadRange([0,c(6,b)],d)})},
getID3DataRange:function(b,d){var c=this._readSynchsafeInteger32At;b.loadRange([0,10],function(){d(6,c(6,b)+10)})},readTagsFromData:function(b,d){var c=0,f=b.getByteAt(c+3);if(4<f)return{version:"2."+f};var l=b.getByteAt(c+4),a=b.isBitSetAt(c+5,7),n=b.isBitSetAt(c+5,6),m=b.isBitSetAt(c+5,5),p=this._readSynchsafeInteger32At(c+6,b),c=c+10;if(n)var q=b.getLongAt(c,!0),c=c+(q+4);l={version:"2."+f+"."+l,major:f,revision:l,flags:{unsynchronisation:a,extended_header:n,experimental_indicator:m},size:p};c=
a?{}:this._readFrames(c,p-10,b,l,d);c.version="2."+f;for(var r in this._shortcuts)if(this._shortcuts.hasOwnProperty(r)&&(!d||d[r]))for(f=this._shortcuts[r],a=0,p=f.length;a<p;a++)f[a]&&c[f[a]]&&(c[r]||(c[r]=c[f[a]]),delete c[f[a]]);return c}},w=function(b){return this[b]},x=function(b,d){var c="";d||(d=this.length);for(;b<d;b++)c+=this[b];return c},y=function(b,d){var c=d||"",f=b.size||d.length,l=d?[0,d.length]:[0,-1];this.getRawData=function(){return c};this.getByteAt=function(a){0<=a-l[0]&&(a-=
l[0]);return c.charCodeAt(a)&255};this.getBytesAt=function(a,b){for(var c=Array(b),d=0;d<b;d++)c[d]=this.getByteAt(a+d);return c};this.getLength=function(){return f};this.getLengthLoaded=function(){return c.length};this.isBitSetAt=function(a,b){return 0!=(this.getByteAt(a)&1<<b)};this.getSByteAt=function(a){a=this.getByteAt(a);return 127<a?a-256:a};this.getShortAt=function(a,b){var c=b?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);0>c&&(c+=65536);return c};
this.getSShortAt=function(a,b){var c=this.getShortAt(a,b);return 32767<c?c-65536:c};this.getLongAt=function(a,b){var c=this.getByteAt(a),d=this.getByteAt(a+1),f=this.getByteAt(a+2),l=this.getByteAt(a+3),c=b?(((c<<8)+d<<8)+f<<8)+l:(((l<<8)+f<<8)+d<<8)+c;0>c&&(c+=4294967296);return c};this.getSLongAt=function(a,b){var c=this.getLongAt(a,b);return 2147483647<c?c-4294967296:c};this.getInteger24At=function(a,b){var c=this.getByteAt(a),d=this.getByteAt(a+1),f=this.getByteAt(a+2),c=b?((c<<8)+d<<8)+f:((f<<
8)+d<<8)+c;0>c&&(c+=16777216);return c};this.getStringAt=function(a,b){for(var c=[],d=a,f=0;d<a+b;d++,f++)c[f]=String.fromCharCode(this.getByteAt(d));return c.join("")};this.getStringWithCharsetAt=function(a,b,c){a=this.getBytesAt(a,b);switch(c.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":c=u.readUTF16String(a,c);break;case "utf-8":c=u.readUTF8String(a);break;default:c=u.readNullTerminatedString(a)}return c};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};
this.loadRange=function(a,d){if(window.FileReader){var m=new FileReader;if(a&&(1==a.length&&(a=[a[0],f-a[0]-1]),l[0]<=a[0]&&l[1]>=a[1])){d&&d(!0);return}if("undefined"==typeof m.onloadend)d&&d(!1);else{m.onloadend=function(b){b.target.readyState==FileReader.DONE&&(c=b.target.result,window.ArrayBuffer&&c instanceof window.ArrayBuffer&&(c=new Uint8Array(c),c.substring=x,"function"!==typeof c.substring&&(c.__proto__.substring=x),c.charCodeAt=w,"function"!==typeof c.charCodeAt&&(c.__proto__.charCodeAt=
w)),l=[a[0],a[0]+c.length],d&&d(!0),m=null)};"undefined"!=typeof m.onerror&&(m.onerror=function(a){d&&d(!1)});var p=b;a&&2==a.length?b.slice?p=b.slice(a[0],a[1]):b.webkitSlice?p=b.webkitSlice(a[0],a[1]):b.mozSlice&&(p=b.mozSlice(a[0],a[1])):a=[0,b.length-1];try{window.ArrayBuffer&&"function"===typeof m.readAsArrayBuffer?m.readAsArrayBuffer(p):m.readAsBinaryString(p)}catch(q){d&&d(!1)}}}else d&&d(!1)}};window.ID3={_loadFile:function(b,d,c){b.loadRange([0,10],function(f){if(f){var l=b.getStringAt(0,
3);"ID3"==l?d(z):v.loadData(b,function(){var a=b.getLengthLoaded()-128;0>a&&(a=0);l=b.getStringAt(a,3);"TAG"==l?d(v):d(null)})}else c?c("readerror"):d(null)})},loadTags:function(b){function d(d){f(c,d,function(a){b.success&&b.success(a)})}var c=b.dataReader||new y(b.file,b.stringData),f=this._getFileData;this._loadFile(c,function(f){f?f.loadData(c,function(){d(f.readTagsFromData(c,b.tags))}):d({})},b.error)},_getFileData:function(b,d,c){var f=[[0,0,0,0,0],[32,32,32,32,8],[64,48,40,48,16],[96,56,48,
56,24],[128,64,56,64,32],[160,80,64,80,40],[192,96,80,96,48],[224,112,96,112,56],[256,128,112,128,64],[288,160,128,144,80],[320,192,160,160,96],[352,224,192,176,112],[384,256,224,192,128],[416,320,256,224,144],[448,384,320,256,160]],l=[[11025,12E3,8E3],[0,0,0],[22050,24E3,16E3],[44100,48E3,32E3]];d||(d={});d.sampleRate=null;d.bitRate=null;var a=b.getLength();b.loadRange([a-16384,a],function(a){if(a){for(var m=b.getRawData(),p=m.length,q=[],r=a=0,k=null,h,g,e,s=0;s<p-4&&!(255==(m.charCodeAt(s)&255)&&
224==(m.charCodeAt(s+1)&224)&&(e={},e.version=(m.charCodeAt(s+1)&24)>>3,e.layer=Math.abs(((m.charCodeAt(s+1)&6)>>1)-4),g=(m.charCodeAt(s+2)&12)>>2,h=(m.charCodeAt(s+2)&240)>>4,e.padding=(m.charCodeAt(s+2)&2)>>1,e.verify=(m.charCodeAt(s+1)&31)<<2+g,1!==e.version&&0<e.layer&&3>g&&15!=h&&0!=h&&(null===k||k===e.verify)?(e.sampleRate=l[e.version][g],e.bitRate=1===(e.version&1)?f[h][e.layer-1]:f[h][(e.layer&1)+3],1===e.layer?e.frameLength=4*(12E3*e.bitRate/e.sampleRate+e.padding):(k=3===e.layer&&(e.version&
-2)===e.version?72:144,e.frameLength=k*e.bitRate*1E3/e.sampleRate+e.padding),r+=e.bitRate,q.push(e),a++,k=e.verify,s+=Math.floor(e.frameLength)-1):(q=[],r=a=0,k=null)),25<=a);s++);3<a&&(m=q.shift(),d.sampleRate=m.sampleRate,d.bitRate=Math.ceil(r/a))}c(d)})},calculateAudioHash:function(b){if(window.binl_md5){var d=b.dataReader||new y(b.file,b.stringData),c=function(c,l){var a=0,n=16384,m=d.getLength(),p;6>=c&&l&&l<m&&(a=l);var q=function(a,c,f){n=16384;a+n>m-128&&(n=m-a-128);d.loadRange([a,a+n],function(g){g?
(p=d.getRawData(),c=t.update(c,p),a+n<m-128?q(a+n,c,f):(a+=n,d.loadRange([a,a+128],function(a){a?f(t.finalize(c)):b.error?b.error("readerror"):b.success&&b.success("")}))):b.error?b.error("readerror"):b.success&&b.success("")})};q(a,t.init(),function(a){b.success&&b.success(a)})};this._loadFile(d,function(f){f?f.getID3DataRange(d,c):b.success&&b.success("")},function(d){"unsupported"==d?c(-1,null):b.error?b.error(d):b.success&&b.success("")})}else b.error?b.error("nomd5"):b.success&&b.success("")}}})();