(function(u){var w=function(){function a(a,l){var h=a[0],f=a[1],b=a[2],g=a[3],h=c(h,f,b,g,l[0],7,-680876936),g=c(g,h,f,b,l[1],12,-389564586),b=c(b,g,h,f,l[2],17,606105819),f=c(f,b,g,h,l[3],22,-1044525330),h=c(h,f,b,g,l[4],7,-176418897),g=c(g,h,f,b,l[5],12,1200080426),b=c(b,g,h,f,l[6],17,-1473231341),f=c(f,b,g,h,l[7],22,-45705983),h=c(h,f,b,g,l[8],7,1770035416),g=c(g,h,f,b,l[9],12,-1958414417),b=c(b,g,h,f,l[10],17,-42063),f=c(f,b,g,h,l[11],22,-1990404162),h=c(h,f,b,g,l[12],7,1804603682),g=c(g,h,f,
b,l[13],12,-40341101),b=c(b,g,h,f,l[14],17,-1502002290),f=c(f,b,g,h,l[15],22,1236535329),h=e(h,f,b,g,l[1],5,-165796510),g=e(g,h,f,b,l[6],9,-1069501632),b=e(b,g,h,f,l[11],14,643717713),f=e(f,b,g,h,l[0],20,-373897302),h=e(h,f,b,g,l[5],5,-701558691),g=e(g,h,f,b,l[10],9,38016083),b=e(b,g,h,f,l[15],14,-660478335),f=e(f,b,g,h,l[4],20,-405537848),h=e(h,f,b,g,l[9],5,568446438),g=e(g,h,f,b,l[14],9,-1019803690),b=e(b,g,h,f,l[3],14,-187363961),f=e(f,b,g,h,l[8],20,1163531501),h=e(h,f,b,g,l[13],5,-1444681467),
g=e(g,h,f,b,l[2],9,-51403784),b=e(b,g,h,f,l[7],14,1735328473),f=e(f,b,g,h,l[12],20,-1926607734),h=d(f^b^g,h,f,l[5],4,-378558),g=d(h^f^b,g,h,l[8],11,-2022574463),b=d(g^h^f,b,g,l[11],16,1839030562),f=d(b^g^h,f,b,l[14],23,-35309556),h=d(f^b^g,h,f,l[1],4,-1530992060),g=d(h^f^b,g,h,l[4],11,1272893353),b=d(g^h^f,b,g,l[7],16,-155497632),f=d(b^g^h,f,b,l[10],23,-1094730640),h=d(f^b^g,h,f,l[13],4,681279174),g=d(h^f^b,g,h,l[0],11,-358537222),b=d(g^h^f,b,g,l[3],16,-722521979),f=d(b^g^h,f,b,l[6],23,76029189),
h=d(f^b^g,h,f,l[9],4,-640364487),g=d(h^f^b,g,h,l[12],11,-421815835),b=d(g^h^f,b,g,l[15],16,530742520),f=d(b^g^h,f,b,l[2],23,-995338651),h=k(h,f,b,g,l[0],6,-198630844),g=k(g,h,f,b,l[7],10,1126891415),b=k(b,g,h,f,l[14],15,-1416354905),f=k(f,b,g,h,l[5],21,-57434055),h=k(h,f,b,g,l[12],6,1700485571),g=k(g,h,f,b,l[3],10,-1894986606),b=k(b,g,h,f,l[10],15,-1051523),f=k(f,b,g,h,l[1],21,-2054922799),h=k(h,f,b,g,l[8],6,1873313359),g=k(g,h,f,b,l[15],10,-30611744),b=k(b,g,h,f,l[6],15,-1560198380),f=k(f,b,g,h,
l[13],21,1309151649),h=k(h,f,b,g,l[4],6,-145523070),g=k(g,h,f,b,l[11],10,-1120210379),b=k(b,g,h,f,l[2],15,718787259),f=k(f,b,g,h,l[9],21,-343485551);a[0]=n(h,a[0]);a[1]=n(f,a[1]);a[2]=n(b,a[2]);a[3]=n(g,a[3])}function d(a,b,c,d,e,g){b=n(n(b,a),n(d,g));return n(b<<e|b>>>32-e,c)}function c(a,b,c,f,e,g,m){return d(b&c|~b&f,a,b,e,g,m)}function e(a,b,c,f,e,g,m){return d(b&f|c&~f,a,b,e,g,m)}function k(a,b,c,f,e,g,m){return d(c^(b|~f),a,b,e,g,m)}function b(b){var c=b.length,d=[1732584193,-271733879,-1732584194,
271733878],f;for(f=64;f<=b.length;f+=64)a(d,p(b.substring(f-64,f)));b=b.substring(f-64);var e=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(f=0;f<b.length;f++)e[f>>2]|=b.charCodeAt(f)<<(f%4<<3);e[f>>2]|=128<<(f%4<<3);if(55<f)for(a(d,e),f=0;16>f;f++)e[f]=0;e[14]=8*c;a(d,e);return d}function p(a){var b=[],c;for(c=0;64>c;c+=4)b[c>>2]=a.charCodeAt(c)+(a.charCodeAt(c+1)<<8)+(a.charCodeAt(c+2)<<16)+(a.charCodeAt(c+3)<<24);return b}function m(a){for(var b=0;b<a.length;b++){for(var c=a,d=b,e=a[b],g="",m=0;4>m;m++)g+=
q[e>>8*m+4&15]+q[e>>8*m&15];c[d]=g}return a.join("")}function n(a,b){return a+b&4294967295}this.init=function(){return[1732584193,-271733879,-1732584194,271733878,0,""]};this.update=function(b,c){b||(b=this.init());b[4]+=c.length;""!=b[5]&&(c=b[5]+c,b[5]="");for(var d=64;d<=c.length;d+=64)a(b,p(c.substring(d-64,d)));b[5]+=c.substring(d-64);return b};this.finalize=function(b){var c,d="",e=b[4];""!=b[5]&&(d=b[5],b[5]="",64<=d.length&&(b=this.update(b,d)));var d=d.substr(e%64*-1),k=[0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0];for(c=0;c<d.length;c++)k[c>>2]|=d.charCodeAt(c)<<(c%4<<3);k[c>>2]|=128<<(c%4<<3);if(55<c)for(a(b,k),c=0;16>c;c++)k[c]=0;k[14]=8*e;a(b,k);b.pop();b.pop();return m(b)};var q="0123456789abcdef".split("");"5d41402abc4b2a76b9719d911017c592"!=m(b("hello"))&&(n=function(b,a){var c=(b&65535)+(a&65535);return(b>>16)+(a>>16)+(c>>16)<<16|c&65535});this.hash=function(a){return m(b(a))};return this}(),x={readUTF16String:function(a,d,c){var e=0,k=1,b=0;c=Math.min(c||a.length,a.length);254==a[0]&&
255==a[1]?(d=!0,e=2):255==a[0]&&254==a[1]&&(d=!1,e=2);d&&(k=0,b=1);d=[];for(var p=0;e<c;p++){var m=a[e+k],n=(m<<8)+a[e+b],e=e+2;if(0==n)break;else 216>m||224<=m?d[p]=String.fromCharCode(n):(m=(a[e+k]<<8)+a[e+b],e+=2,d[p]=String.fromCharCode(n,m))}a=new String(d.join(""));a.bytesReadCount=e;return a},readUTF8String:function(a,d){var c=0;d=Math.min(d||a.length,a.length);239==a[0]&&187==a[1]&&191==a[2]&&(c=3);for(var e=[],k=0;c<d;k++){var b=a[c++];if(0==b)break;else if(128>b)e[k]=String.fromCharCode(b);
else if(194<=b&&224>b){var p=a[c++];e[k]=String.fromCharCode(((b&31)<<6)+(p&63))}else if(224<=b&&240>b){var p=a[c++],m=a[c++];e[k]=String.fromCharCode(((b&255)<<12)+((p&63)<<6)+(m&63))}else if(240<=b&&245>b){var p=a[c++],m=a[c++],n=a[c++],b=((b&7)<<18)+((p&63)<<12)+((m&63)<<6)+(n&63)-65536;e[k]=String.fromCharCode((b>>10)+55296,(b&1023)+56320)}}e=new String(e.join(""));e.bytesReadCount=c;return e},readNullTerminatedString:function(a,d){var c=[];d=d||a.length;for(var e=0;e<d;){var k=a[e++];if(0==k)break;
c[e-1]=String.fromCharCode(k)}c=new String(c.join(""));c.bytesReadCount=e;return c}},z={version:"ID3v1",_genres:"Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";"),
loadData:function(a,d){var c=a.getLength();a.loadRange([c-128,c],d)},getID3DataRange:function(a,d){var c=a.getLength();d(c-128,c)},readTagsFromData:function(a,d){var c={version:"1.1"},e=a.getLength()-128;if(0>e)return c;if(!d||d.title)c.title=a.getStringAt(e+3,30).replace(/\0|\s+$/g,"");if(!d||d.artist)c.artist=a.getStringAt(e+33,30).replace(/\0|\s+$/g,"");if(!d||d.album)c.album=a.getStringAt(e+63,30).replace(/\0|\s+$/g,"");if(!d||d.year)c.year=a.getStringAt(e+93,4).replace(/\0|\s+$/g,"");if(!d||
d.track||track.comment)if(c.year=a.getStringAt(e+93,4).replace(/\0|\s+$/g,""),0==a.getByteAt(e+97+28)){if(!d||d.track)c.comment=a.getStringAt(e+97,28).replace(/\0|\s+$/g,"");if(!d||d.track)c.track=a.getByteAt(e+97+29)}else c.comment="",c.track=0;if(!d||d.genre)e=a.getByteAt(e+97+30),c.genre=255>e?this._genres[e]:"";return c}},D={version:"ID3v2",_shortcuts:{title:["TIT2","TT2"],artist:["TPE1","TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON",
"TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},_readFrameData:{_pictureType:"32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";"),_getTextEncoding:function(a){switch(a){case 0:return"iso-8859-1";
case 1:return"utf-16";case 2:return"utf-16be";case 3:return"utf-8"}return null},APIC:function(a,d,c,e,k){k=k||"3";e=a;var b=this._getTextEncoding(c.getByteAt(a)),p=null;switch(k){case "2":p=c.getStringAt(a+1,3);a+=4;break;case "3":case "4":p=c.getStringWithCharsetAt(a+1,d-(a-e),b),a+=1+p.bytesReadCount}k=c.getByteAt(a,1);k=this._pictureType[k];b=c.getStringWithCharsetAt(a+1,d-(a-e),b);a+=1+b.bytesReadCount;return{format:p.toString(),type:k,description:b.toString(),data:c.getBytesAt(a,e+d-a)}},PIC:function(a,
d,c,e){return this.APIC(a,d,c,e,"2")},COMM:function(a,d,c){var e=a,k=this._getTextEncoding(c.getByteAt(a)),b=c.getStringAt(a+1,3),p=c.getStringWithCharsetAt(a+4,d-4,k);a+=4+p.bytesReadCount;a=c.getStringWithCharsetAt(a,e+d-a,k);return{language:b,short_description:p.toString(),text:a.toString()}},COM:function(a,d,c){return this.COMM(a,d,c)},T:function(a,d,c){var e=this._getTextEncoding(c.getByteAt(a));return c.getStringWithCharsetAt(a+1,d-1,e).toString()},TCON:function(a,d,c){return this.T.apply(this,
arguments).replace(/^\(\d+\)/,"")},TCO:function(a,d,c){return this.TCON(a,d,c)},USLT:function(a,d,c){var e=a,k=this._getTextEncoding(c.getByteAt(a)),b=c.getStringAt(a+1,3),p=c.getStringWithCharsetAt(a+4,d-4,k);a+=4+p.bytesReadCount;a=c.getStringWithCharsetAt(a,e+d-a,k);return{language:b,descriptor:p.toString(),lyrics:a.toString()}},ULT:function(a,d,c){return this.USLT(a,d,c)}},_getTagsFromShortcuts:function(a){var d={},c;for(c in a)if(a.hasOwnProperty(c)&&this._shortcuts[c])for(var e=0;e<this._shortcuts[c].length;e++)this._shortcuts[c][e]&&
(d[this._shortcuts[c][e]]=1);else a.hasOwnProperty(c)&&(d[c]=1);return d},_readSynchsafeInteger32At:function(a,d){var c=d.getByteAt(a),e=d.getByteAt(a+1),k=d.getByteAt(a+2);return d.getByteAt(a+3)&127|(k&127)<<7|(e&127)<<14|(c&127)<<21},_readFrameFlags:function(a,d){return{message:{tag_alter_preservation:a.isBitSetAt(d,6),file_alter_preservation:a.isBitSetAt(d,5),read_only:a.isBitSetAt(d,4)},format:{grouping_identity:a.isBitSetAt(d+1,7),compression:a.isBitSetAt(d+1,3),encription:a.isBitSetAt(d+1,
2),unsynchronisation:a.isBitSetAt(d+1,1),data_length_indicator:a.isBitSetAt(d+1,0)}}},_readFrames:function(a,d,c,e,k){var b={};e=e.major;for(k=this._getTagsFromShortcuts(k||{title:1,artist:1,album:1,track:1,year:1,genre:1});a<d;){var p=null,m=a,n=null,q,s,l;switch(e){case 2:q=c.getStringAt(m,3);s=c.getInteger24At(m+3,!0);l=6;break;case 3:q=c.getStringAt(m,4);0===q.charCodeAt(3)&&(q=q.substr(0,3));s=c.getLongAt(m+4,!0);l=10;break;case 4:q=c.getStringAt(m,4),0===q.charCodeAt(3)&&(q=q.substr(0,3)),s=
this._readSynchsafeInteger32At(m+4,c),l=10}if(!q||""==q)break;a+=l+s;if(k[q]&&(2<e&&(n=this._readFrameFlags(c,m+8)),m+=l,n&&n.format.data_length_indicator&&(this._readSynchsafeInteger32At(m,c),m+=4,s-=4),!n||!n.format.unsynchronisation)){this._readFrameData[q]?p=this._readFrameData[q]:this._readFrameData[q[0]]&&(p=this._readFrameData[q[0]]);var h=null;p&&(h=p.call(this._readFrameData,m,s,c,n));b[q]=h}}return b},loadData:function(a,d){var c=this._readSynchsafeInteger32At;a.loadRange([0,10],function(){a.loadRange([0,
c(6,a)],d)})},getID3DataRange:function(a,d){var c=this._readSynchsafeInteger32At;a.loadRange([0,10],function(){d(6,c(6,a)+10)})},readTagsFromData:function(a,d){var c=0,e=a.getByteAt(c+3);if(4<e)return{version:"2."+e};var k=a.getByteAt(c+4),b=a.isBitSetAt(c+5,7),p=a.isBitSetAt(c+5,6),m=a.isBitSetAt(c+5,5),n=this._readSynchsafeInteger32At(c+6,a),c=c+10;if(p)var q=a.getLongAt(c,!0),c=c+(q+4);k={version:"2."+e+"."+k,major:e,revision:k,flags:{unsynchronisation:b,extended_header:p,experimental_indicator:m},
size:n};c=b?{}:this._readFrames(c,n-10,a,k,d);c.version="2."+e;for(var s in this._shortcuts)if(this._shortcuts.hasOwnProperty(s)&&(!d||d[s]))for(e=this._shortcuts[s],b=0,n=e.length;b<n;b++)e[b]&&c[e[b]]&&(c[s]||(c[s]=c[e[b]]),delete c[e[b]]);return c}},A=function(a){return this[a]},B=function(a,d){var c="";d||(d=this.length);for(;a<d;a++)c+=String.fromCharCode(this[a]);return c},C=function(a,d){var c=d||"",e=a.size||d.length,k=d?[0,d.length]:[0,-1];this.getRawData=function(){return c};this.getByteAt=
function(b){0<=b-k[0]&&(b-=k[0]);return c.charCodeAt(b)&255};this.getBytesAt=function(b,a){for(var c=Array(a),d=0;d<a;d++)c[d]=this.getByteAt(b+d);return c};this.getLength=function(){return e};this.getLengthLoaded=function(){return c.length};this.isBitSetAt=function(b,a){return 0!=(this.getByteAt(b)&1<<a)};this.getSByteAt=function(b){b=this.getByteAt(b);return 127<b?b-256:b};this.getShortAt=function(b,a){var c=a?(this.getByteAt(b)<<8)+this.getByteAt(b+1):(this.getByteAt(b+1)<<8)+this.getByteAt(b);
0>c&&(c+=65536);return c};this.getSShortAt=function(b,a){var c=this.getShortAt(b,a);return 32767<c?c-65536:c};this.getLongAt=function(a,c){var d=this.getByteAt(a),e=this.getByteAt(a+1),k=this.getByteAt(a+2),s=this.getByteAt(a+3),d=c?(((d<<8)+e<<8)+k<<8)+s:(((s<<8)+k<<8)+e<<8)+d;0>d&&(d+=4294967296);return d};this.getSLongAt=function(a,c){var d=this.getLongAt(a,c);return 2147483647<d?d-4294967296:d};this.getInteger24At=function(a,c){var d=this.getByteAt(a),e=this.getByteAt(a+1),k=this.getByteAt(a+
2),d=c?((d<<8)+e<<8)+k:((k<<8)+e<<8)+d;0>d&&(d+=16777216);return d};this.getStringAt=function(a,c){for(var d=[],e=a,k=0;e<a+c;e++,k++)d[k]=String.fromCharCode(this.getByteAt(e));return d.join("")};this.getStringWithCharsetAt=function(a,c,d){a=this.getBytesAt(a,c);switch(d.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":d=x.readUTF16String(a,d);break;case "utf-8":d=x.readUTF8String(a);break;default:d=x.readNullTerminatedString(a)}return d};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};
this.loadRange=function(b,d){if(u.FileReader){var m=new FileReader;if(b&&(1==b.length&&(b=[b[0],e-b[0]-1]),k[0]<=b[0]&&k[1]>=b[1])){d&&d(!0);return}if("undefined"==typeof m.onloadend)d&&d(!1);else{m.onloadend=function(a){a.target.readyState==FileReader.DONE&&(c=a.target.result,u.ArrayBuffer&&c instanceof u.ArrayBuffer&&(c=new Uint8Array(c),c.substring=B,"function"!==typeof c.substring&&(c.__proto__.substring=B),c.charCodeAt=A,"function"!==typeof c.charCodeAt&&(c.__proto__.charCodeAt=A)),k=[b[0],b[0]+
c.length],d&&d(!0),m=null)};"undefined"!=typeof m.onerror&&(m.onerror=function(a){d&&d(!1)});var n=a;b&&2==b.length?a.slice?n=a.slice(b[0],b[1]):a.webkitSlice?n=a.webkitSlice(b[0],b[1]):a.mozSlice&&(n=a.mozSlice(b[0],b[1])):b=[0,a.length-1];try{u.ArrayBuffer&&"function"===typeof m.readAsArrayBuffer?m.readAsArrayBuffer(n):m.readAsBinaryString(n)}catch(q){d&&d(!1)}}}else d&&d(!1)}},y={_loadFile:function(a,d,c){a.loadRange([0,10],function(e){if(e){var k=a.getStringAt(0,3);"ID3"==k?d(D):z.loadData(a,
function(){var b=a.getLengthLoaded()-128;0>b&&(b=0);k=a.getStringAt(b,3);"TAG"==k?d(z):d(null)})}else c?c("readerror"):d(null)})},loadTags:function(a){function d(d){e(c,d,a.bytesToRead,a.maxFrames,function(b){b&&b.framesInspected?a.success&&a.success(b):a.error&&a.error("invalidmp3")})}var c=a.dataReader||new C(a.file,a.stringData),e=this._getFileData;a.bytesToRead&&("number"!==typeof a.bytesToRead||isNaN(a.bytesToRead)||1>a.bytesToRead)?a.error&&a.error("invalidbytes"):(a.bytesToRead||(a.bytesToRead=
65536),a.maxFrames&&("number"!==typeof a.maxFrames||isNaN(a.maxFrames)||1>a.maxFrames)?a.error&&a.error("invalidframes"):(a.maxFrames||(a.maxFrames=50),this._loadFile(c,function(e){e?e.loadData(c,function(){d(e.readTagsFromData(c,a.tags))}):d({})},a.error)))},_getFileData:function(a,d,c,e,k){var b=[[0,0,0,0,0],[32,32,32,32,8],[64,48,40,48,16],[96,56,48,56,24],[128,64,56,64,32],[160,80,64,80,40],[192,96,80,96,48],[224,112,96,112,56],[256,128,112,128,64],[288,160,128,144,80],[320,192,160,160,96],[352,
224,192,176,112],[384,256,224,192,128],[416,320,256,224,144],[448,384,320,256,160]],p=[[11025,12E3,8E3],[0,0,0],[22050,24E3,16E3],[44100,48E3,32E3]];d||(d={});d.sampleRate=null;d.bitRate=null;d.framesInspected=0;var m=a.getLength();a.loadRange([m-c,m],function(n){if(n){for(var q=a.getRawData(),s=q.length,l=[],h=n=0,f=0,u=null,g,v,r,t=0;t<s-4&&!(255==(q.charCodeAt(t)&255)&&224==(q.charCodeAt(t+1)&224)&&(r={},r.version=(q.charCodeAt(t+1)&24)>>3,r.layer=Math.abs(((q.charCodeAt(t+1)&6)>>1)-4),v=(q.charCodeAt(t+
2)&12)>>2,g=(q.charCodeAt(t+2)&240)>>4,r.padding=(q.charCodeAt(t+2)&2)>>1,r.verify=(q.charCodeAt(t+1)&31)<<2+v,1!==r.version&&0<r.layer&&3>v&&15!=g&&0!=g&&(null===u||u===r.verify)?(r.sampleRate=p[r.version][v],r.bitRate=1===(r.version&1)?b[g][r.layer-1]:b[g][(r.layer&1)+3],1===r.layer?r.frameLength=4*(12E3*r.bitRate/r.sampleRate+r.padding):(f=3===r.layer&&(r.version&-2)===r.version?72:144,r.frameLength=f*r.bitRate*1E3/r.sampleRate+r.padding),h+=r.bitRate,l.push(r),n++,u=r.verify,f=Math.floor(r.frameLength),
t+=f-1):(l=[],h=n=0,u=null,0<f&&(t-=f,f=0))),n>=e);t++);d.framesInspected=n;if(3<n||m<c&&t>=s-4)q=l.shift(),d.sampleRate=q.sampleRate,d.bitRate=Math.ceil(h/n)}k(d)})},calculateAudioHash:function(a){if(u.binl_md5){var d=a.dataReader||new C(a.file,a.stringData),c=function(c,k){var b=0,p=16384,m=d.getLength(),n;6>=c&&k&&k<m&&(b=k);var q=function(b,c,e){p=16384;b+p>m-128&&(p=m-b-128);d.loadRange([b,b+p],function(f){f?(n=d.getRawData(),c=w.update(c,n),b+p<m-128?q(b+p,c,e):(b+=p,d.loadRange([b,b+128],function(b){b?
e(w.finalize(c)):a.error?a.error("readerror"):a.success&&a.success("")}))):a.error?a.error("readerror"):a.success&&a.success("")})};q(b,w.init(),function(b){a.success&&a.success(b)})};this._loadFile(d,function(e){e?e.getID3DataRange(d,c):a.success&&a.success("")},function(d){"unsupported"==d?c(-1,null):a.error?a.error(d):a.success&&a.success("")})}else a.error?a.error("nomd5"):a.success&&a.success("")}};"undefined"!==typeof module?module.exports=y:(u.ID3=y,"function"==typeof define&&"object"==typeof define.amd&&
define.amd&&define("id3",function(){return y}))})(this);
