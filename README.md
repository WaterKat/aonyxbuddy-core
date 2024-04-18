# AonyxBuddy

## AonyxLimited
### By WaterKat

AonyxBuddy is a plugin for StreamElements that takes user-generated responses to events in a stream. It allows users to interact with their Twitch channels in new ways, as well as serve as a management tool for new streamers.

## Features

- AonyxBuddy will respond to Twitch events with provided responses:
  - New Follows
  - New Subscribers
  - Gifted Subs
  - Cheer Events
  - Raid Events
  - First Chat of the Stream (Welcome)
- AonyxBuddy can also be interacted with commands:
  - AonyxBuddy will respond to its given name or "aonyxbuddy".
  - For example, `!aonyxbuddy say hello world!` can be used as well as `!sol say hello world!` if "sol" has been assigned as its name.
  - Commands:
    - "say": will speak the text following the command.
        - it is possible to assign aliases in the configuration, allowing commands such as ```!!: hello world!```
        to work properly as an alias for ```!aonyxbuddy say hello world!```
    - "skip" followed by "$args": will have different behaviors:
      - none (no arguments): will cut off the current spoken message, or if none is being spoken, will skip the next incoming speech event.
      - number (a valid integer above 0): will cut off the current spoken message and will add the skip count.
      - "all": will cut off the current spoken message and will skip all queued messages.

## Getting Started
Dependencies 
    - Bun 1.1.3

The following would be placed within the JS field of a custom stream elements widget.

a configuration must be provided of type IClientConfig within ```src/config/iclient-config.ts```
```
const AonyxBuddyConfig = {
    owner_id: 'aonyxbuddy',
    nickname: 'sol',
    blacklist: [],
    botlist: [
        'nightbot',
        'streamelements',
        'soundalerts',
        'streamlabs',
        'kofistreambot',
    ],
    blockedWords: ["your", "bad", "words", "here"],
    spriteRendering: {
        canvas: {
            size: {
                x: 256,
                y: 256
            },
            antialiasing: true
        },
        defaultFPS: 24,
        sprites: {
            base: "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/idle.gif",
            talking: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/0.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/1.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/2.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/3.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/4.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/5.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/6.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/7.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/8.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/9.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/10.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/11.png"
            ]
        }
    },
    nicknames: {
        'aonyxbuddy': ['a nickname goes here'],
    },
    tts: { voice: 'Brian' },
    responses: {
        voice: {
            follow: [
                "Thanks for following, ${nickname}! Lets build a community together!",
                "Welcome, ${nickname}! Thank you for the follow",
                "Hey ${nickname}! Your support means a lot!",
                "Welcome in ${nickname}. Grab a seat!",
                "${nickname}, welcome in. Join us in our digital trek.",
                "Hello World! Welcome in ${nickname}",
                "New connection detected, hello ${nickname}!"
            ],
            subscriber: [
                "It means so much for you to subscribe ${nickname}. Let's develop a greater community together!",
                "${subscriber.length} month${subscriber.plural} of support! Thank you so much ${nickname} it means so much! heart",
                "Hello chat! ${nickname} has subscribed for ${subscriber.length} month${subscriber.plural}. Thank you for your commitment.",
                "Secure connection established! Thank you for your subscription ${nickname}! Your content should be delivered shortly, smile!",
                "PING . . . PONG! Thank you for your month${subscriber.plural} subscription ${nickname}. Your support will keep us journeying through cyberspace!"
            ],
            "gift-single": ['Thank you for gifting a subscription, ${nickname}. ${gift.receiver} enjoy your stay.'],
            "gift-bulk-sent": ['Thank you for gifting ${gift.count} subscriptions ${nickname}.'],
            "gift-bulk-received": [],
            raid: [
                "Incoming DDOS? No! its ${nickname} bringing ${raid.count} raider${raid.plural}. Welcome!",
                "SELECT FROM ${nickname} JOIN waterkat. Join us ${raid.count} raider${raid.plural}. Welcome in!",
                "New network detected! Establishing connection with ${nickname}, and their ${raid.count} raider${raid.plural}!",
                "Incoming stream! Parsing ${raid.count} new connection${raid.plural}. Thank you for joining ${nickname}!",
                "${raid.count} new viewer${raid.plural} detected. Thank your ${nickname} for bringing your community!"
            ],
            cheer: ["Thank you for the cheer! ${nickname}"],
            chat: [],
            command: [],
            redeem: [],
            "chat-first": [
                "Client connected, hello ${nickname}!",
                "Beep boop, Hi ${nickname}!",
                "Hello! Take a seat ${nickname}!",
                "Thanks for joining us ${nickname}!",
                "Hello world! says ${nickname}",
                "${nickname}, welcome in",
            ],
            "event-subscriber-message": [
                "${nickname} says... ${message.text}"
            ],
            "command-say": [
                "${message.text}"
            ],
        }
    }
}
```

as well as the contents of the app.js file build by bun with 
```bun run build```

The following css will allow the canvas to render flush to the widget
```css
* {
	padding: 0;
  	margin: 0;
}
```

# Test contents
The following default js contents would be produced by the getting started section. This would go in the js widget field.
```js
const AonyxBuddyConfig = {
    owner_id: 'aonyxbuddy',
    nickname: 'sol',
    blacklist: [],
    botlist: [
        'nightbot',
        'streamelements',
        'soundalerts',
        'streamlabs',
        'kofistreambot',
    ],
    blockedWords: ["your", "bad", "words", "here"],
    spriteRendering: {
        canvas: {
            size: {
                x: 256,
                y: 256
            },
            antialiasing: true
        },
        defaultFPS: 24,
        sprites: {
            base: "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/idle.gif",
            talking: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/0.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/1.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/2.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/3.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/4.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/5.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/6.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/7.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/8.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/9.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/10.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/11.png"
            ]
        }
    },
    nicknames: {
        'aonyxbuddy': ['a nickname goes here'],
    },
    tts: { voice: 'Brian' },
    responses: {
        voice: {
            follow: [
                "Thanks for following, ${nickname}! Lets build a community together!",
                "Welcome, ${nickname}! Thank you for the follow",
                "Hey ${nickname}! Your support means a lot!",
                "Welcome in ${nickname}. Grab a seat!",
                "${nickname}, welcome in. Join us in our digital trek.",
                "Hello World! Welcome in ${nickname}",
                "New connection detected, hello ${nickname}!"
            ],
            subscriber: [
                "It means so much for you to subscribe ${nickname}. Let's develop a greater community together!",
                "${subscriber.length} month${subscriber.plural} of support! Thank you so much ${nickname} it means so much! heart",
                "Hello chat! ${nickname} has subscribed for ${subscriber.length} month${subscriber.plural}. Thank you for your commitment.",
                "Secure connection established! Thank you for your subscription ${nickname}! Your content should be delivered shortly, smile!",
                "PING . . . PONG! Thank you for your month${subscriber.plural} subscription ${nickname}. Your support will keep us journeying through cyberspace!"
            ],
            "gift-single": ['Thank you for gifting a subscription, ${nickname}. ${gift.receiver} enjoy your stay.'],
            "gift-bulk-sent": ['Thank you for gifting ${gift.count} subscriptions ${nickname}.'],
            "gift-bulk-received": [],
            raid: [
                "Incoming DDOS? No! its ${nickname} bringing ${raid.count} raider${raid.plural}. Welcome!",
                "SELECT FROM ${nickname} JOIN waterkat. Join us ${raid.count} raider${raid.plural}. Welcome in!",
                "New network detected! Establishing connection with ${nickname}, and their ${raid.count} raider${raid.plural}!",
                "Incoming stream! Parsing ${raid.count} new connection${raid.plural}. Thank you for joining ${nickname}!",
                "${raid.count} new viewer${raid.plural} detected. Thank your ${nickname} for bringing your community!"
            ],
            cheer: ["Thank you for the cheer! ${nickname}"],
            chat: [],
            command: [],
            redeem: [],
            "chat-first": [
                "Client connected, hello ${nickname}!",
                "Beep boop, Hi ${nickname}!",
                "Hello! Take a seat ${nickname}!",
                "Thanks for joining us ${nickname}!",
                "Hello world! says ${nickname}",
                "${nickname}, welcome in",
            ],
            "event-subscriber-message": [
                "${nickname} says... ${message.text}"
            ],
            "command-say": [
                "${message.text}"
            ],
        }
    } 
}
  
  var d0=Object.create;var{defineProperty:p,getPrototypeOf:l0,getOwnPropertyNames:m0}=Object;var v0=Object.prototype.hasOwnProperty;var p0=(Y,J,$)=>{$=Y!=null?d0(l0(Y)):{};const W=J||!Y||!Y.__esModule?p($,"default",{value:Y,enumerable:!0}):$;for(let H of m0(Y))if(!v0.call(W,H))p(W,H,{get:()=>Y[H],enumerable:!0});return W};var x=(Y,J)=>()=>(J||Y((J={exports:{}}).exports,J),J.exports);var u=x((n)=>{Object.defineProperty(n,"__esModule",{value:!0});n.loop=n.conditional=n.parse=void 0;var i0=function Y(J,$){var W=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},H=arguments.length>3&&arguments[3]!==void 0?arguments[3]:W;if(Array.isArray($))$.forEach(function(X){return Y(J,X,W,H)});else if(typeof $==="function")$(J,W,H,Y);else{var U=Object.keys($)[0];if(Array.isArray($[U]))H[U]={},Y(J,$[U],W,H[U]);else H[U]=$[U](J,W,H,Y)}return W};n.parse=i0;var s0=function Y(J,$){return function(W,H,U,X){if($(W,H,U))X(W,J,H,U)}};n.conditional=s0;var o0=function Y(J,$){return function(W,H,U,X){var K=[],Z=W.pos;while($(W,H,U)){var N={};if(X(W,J,H,N),W.pos===Z)break;Z=W.pos,K.push(N)}return K}};n.loop=o0});var d=x((J0)=>{Object.defineProperty(J0,"__esModule",{value:!0});J0.readBits=J0.readArray=J0.readUnsigned=J0.readString=J0.peekBytes=J0.readBytes=J0.peekByte=J0.readByte=J0.buildStream=void 0;var t0=function Y(J){return{data:J,pos:0}};J0.buildStream=t0;var e=function Y(){return function(J){return J.data[J.pos++]}};J0.readByte=e;var e0=function Y(){var J=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return function($){return $.data[$.pos+J]}};J0.peekByte=e0;var E=function Y(J){return function($){return $.data.subarray($.pos,$.pos+=J)}};J0.readBytes=E;var J1=function Y(J){return function($){return $.data.subarray($.pos,$.pos+J)}};J0.peekBytes=J1;var Y1=function Y(J){return function($){return Array.from(E(J)($)).map(function(W){return String.fromCharCode(W)}).join("")}};J0.readString=Y1;var $1=function Y(J){return function($){var W=E(2)($);return J?(W[1]<<8)+W[0]:(W[0]<<8)+W[1]}};J0.readUnsigned=$1;var W1=function Y(J,$){return function(W,H,U){var X=typeof $==="function"?$(W,H,U):$,K=E(J),Z=new Array(X);for(var N=0;N<X;N++)Z[N]=K(W);return Z}};J0.readArray=W1;var H1=function Y(J,$,W){var H=0;for(var U=0;U<W;U++)H+=J[$+U]&&Math.pow(2,W-U-1);return H},U1=function Y(J){return function($){var W=e()($),H=new Array(8);for(var U=0;U<8;U++)H[7-U]=!!(W&1<<U);return Object.keys(J).reduce(function(X,K){var Z=J[K];if(Z.length)X[K]=H1(H,Z.index,Z.length);else X[K]=H[Z.index];return X},{})}};J0.readBits=U1});var H0=x(($0)=>{Object.defineProperty($0,"__esModule",{value:!0});$0.default=void 0;var T=u(),Q=d(),f={blocks:function Y(J){var $=0,W=[],H=J.data.length,U=0;for(var X=Q.readByte()(J);X!==$;X=Q.readByte()(J)){if(!X)break;if(J.pos+X>=H){var K=H-J.pos;W.push(Q.readBytes(K)(J)),U+=K;break}W.push(Q.readBytes(X)(J)),U+=X}var Z=new Uint8Array(U),N=0;for(var F=0;F<W.length;F++)Z.set(W[F],N),N+=W[F].length;return Z}},Q1=T.conditional({gce:[{codes:Q.readBytes(2)},{byteSize:Q.readByte()},{extras:Q.readBits({future:{index:0,length:3},disposal:{index:3,length:3},userInput:{index:6},transparentColorGiven:{index:7}})},{delay:Q.readUnsigned(!0)},{transparentColorIndex:Q.readByte()},{terminator:Q.readByte()}]},function(Y){var J=Q.peekBytes(2)(Y);return J[0]===33&&J[1]===249}),F1=T.conditional({image:[{code:Q.readByte()},{descriptor:[{left:Q.readUnsigned(!0)},{top:Q.readUnsigned(!0)},{width:Q.readUnsigned(!0)},{height:Q.readUnsigned(!0)},{lct:Q.readBits({exists:{index:0},interlaced:{index:1},sort:{index:2},future:{index:3,length:2},size:{index:5,length:3}})}]},T.conditional({lct:Q.readArray(3,function(Y,J,$){return Math.pow(2,$.descriptor.lct.size+1)})},function(Y,J,$){return $.descriptor.lct.exists}),{data:[{minCodeSize:Q.readByte()},f]}]},function(Y){return Q.peekByte()(Y)===44}),A1=T.conditional({text:[{codes:Q.readBytes(2)},{blockSize:Q.readByte()},{preData:function Y(J,$,W){return Q.readBytes(W.text.blockSize)(J)}},f]},function(Y){var J=Q.peekBytes(2)(Y);return J[0]===33&&J[1]===1}),R1=T.conditional({application:[{codes:Q.readBytes(2)},{blockSize:Q.readByte()},{id:function Y(J,$,W){return Q.readString(W.blockSize)(J)}},f]},function(Y){var J=Q.peekBytes(2)(Y);return J[0]===33&&J[1]===255}),M1=T.conditional({comment:[{codes:Q.readBytes(2)},f]},function(Y){var J=Q.peekBytes(2)(Y);return J[0]===33&&J[1]===254}),z1=[{header:[{signature:Q.readString(3)},{version:Q.readString(3)}]},{lsd:[{width:Q.readUnsigned(!0)},{height:Q.readUnsigned(!0)},{gct:Q.readBits({exists:{index:0},resolution:{index:1,length:3},sort:{index:4},size:{index:5,length:3}})},{backgroundColorIndex:Q.readByte()},{pixelAspectRatio:Q.readByte()}]},T.conditional({gct:Q.readArray(3,function(Y,J){return Math.pow(2,J.lsd.gct.size+1)})},function(Y,J){return J.lsd.gct.exists}),{frames:T.loop([Q1,R1,M1,F1,A1],function(Y){var J=Q.peekByte()(Y);return J===33||J===44})}],k1=z1;$0.default=k1});var X0=x((U0)=>{Object.defineProperty(U0,"__esModule",{value:!0});U0.deinterlace=void 0;var B1=function Y(J,$){var W=new Array(J.length),H=J.length/$,U=function G(M,A){var O=J.slice(A*$,(A+1)*$);W.splice.apply(W,[M*$,$].concat(O))},X=[0,4,2,1],K=[8,8,4,2],Z=0;for(var N=0;N<4;N++)for(var F=X[N];F<H;F+=K[N])U(F,Z),Z++;return W};U0.deinterlace=B1});var q0=x((Z0)=>{Object.defineProperty(Z0,"__esModule",{value:!0});Z0.lzw=void 0;var C1=function Y(J,$,W){var H=4096,U=-1,X=W,K,Z,N,F,G,M,A,z,O,k,C,I,j,L,b,S,D=new Array(W),_=new Array(H),h=new Array(H),R=new Array(H+1);I=J,Z=1<<I,G=Z+1,K=Z+2,A=U,F=I+1,N=(1<<F)-1;for(O=0;O<Z;O++)_[O]=0,h[O]=O;var C,z,w,j,L,S,b;C=z=w=j=L=S=b=0;for(k=0;k<X;){if(L===0){if(z<F){C+=$[b]<<z,z+=8,b++;continue}if(O=C&N,C>>=F,z-=F,O>K||O==G)break;if(O==Z){F=I+1,N=(1<<F)-1,K=Z+2,A=U;continue}if(A==U){R[L++]=h[O],A=O,j=O;continue}if(M=O,O==K)R[L++]=j,O=A;while(O>Z)R[L++]=h[O],O=_[O];if(j=h[O]&255,R[L++]=j,K<H){if(_[K]=A,h[K]=j,K++,(K&N)===0&&K<H)F++,N+=K}A=M}L--,D[S++]=R[L],k++}for(k=S;k<X;k++)D[k]=0;return D};Z0.lzw=C1});var Q0=x((N0)=>{var D1=function(Y){return Y&&Y.__esModule?Y:{default:Y}};Object.defineProperty(N0,"__esModule",{value:!0});N0.decompressFrames=N0.decompressFrame=N0.parseGIF=void 0;var w1=D1(H0()),L1=u(),j1=d(),P1=X0(),I1=q0(),T1=function Y(J){var $=new Uint8Array(J);return L1.parse(j1.buildStream($),w1.default)};N0.parseGIF=T1;var h1=function Y(J){var $=J.pixels.length,W=new Uint8ClampedArray($*4);for(var H=0;H<$;H++){var U=H*4,X=J.pixels[H],K=J.colorTable[X]||[0,0,0];W[U]=K[0],W[U+1]=K[1],W[U+2]=K[2],W[U+3]=X!==J.transparentIndex?255:0}return W},G0=function Y(J,$,W){if(!J.image){console.warn("gif frame does not have associated image.");return}var H=J.image,U=H.descriptor.width*H.descriptor.height,X=I1.lzw(H.data.minCodeSize,H.data.blocks,U);if(H.descriptor.lct.interlaced)X=P1.deinterlace(X,H.descriptor.width);var K={pixels:X,dims:{top:J.image.descriptor.top,left:J.image.descriptor.left,width:J.image.descriptor.width,height:J.image.descriptor.height}};if(H.descriptor.lct&&H.descriptor.lct.exists)K.colorTable=H.lct;else K.colorTable=$;if(J.gce){if(K.delay=(J.gce.delay||10)*10,K.disposalType=J.gce.extras.disposal,J.gce.extras.transparentColorGiven)K.transparentIndex=J.gce.transparentColorIndex}if(W)K.patch=h1(K);return K};N0.decompressFrame=G0;var _1=function Y(J,$){return J.frames.filter(function(W){return W.image}).map(function(W){return G0(W,J.gct,$)})};N0.decompressFrames=_1});var r=["al-filtered-word","dyke","fag","fag1t","faget","fagg1t","faggit","faggot","fagg0t","fagit","fags","fagz","faig","faigs","femboy","Fudge Packer","gook","g00k","jap ","japs","Lezzian","Lipshits","Lipshitz","n1gr","nastt","nigger","nigur","niiger","niigr","polac","polack","polak","Poonani","qweir","retard","chink","nazi","nigga","nigger","shemale","w00se","amcik","andskota","ayir","butt-pirate","cazzo","chraa","chuj","daygo","dego","dike","dupa","dziwka","Ekrem","Ekto","enculer","faen","fag","fanculo","fanny","feg","Flikker","gook","honkey","hui","injun","kanker","kike","klootzak","kraut","knulle","kuk","kuksuger","Kurac","kurwa","kusi","kyrpa","lesbo","mamhoon","mibun","monkleigh","mouliewop","muie","mulkku","muschi","nazis","nepesaurio","nigger","orospu","paska","perse","picka","pierdol","pillu","pimmel","pizda","poontsee","pula","pule","rautenberg","schaffer","scheiss","schlampe","sharmuta","sharmute","shipal","shiz","skribz","skurwysyn","sphencter","spic","spierdalaj","suka","vittu","wetback","wichser","wop","yed","zabourah"];var y={owner_id:"aonyxbuddy",nickname:"sol",blacklist:[],botlist:["nightbot","streamelements","soundalerts","streamlabs","kofistreambot"],blockedWords:r,spriteRendering:{canvas:{size:{x:256,y:256},antialiasing:!0},defaultFPS:24,sprites:{base:"https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/idle.gif",talking:["https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/0.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/1.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/2.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/3.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/4.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/5.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/6.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/7.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/8.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/9.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/10.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/11.png"],mute:["https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/empty.png","https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/mute.png"]}},nicknames:{aonyxbuddy:["myself"]},tts:{voice:"Brian"},responses:{voice:{follow:["Thanks for following, ${nickname}! Lets build a community together!","Welcome, ${nickname}! Thank you for the follow","Hey ${nickname}! Your support means a lot!","Welcome in ${nickname}. Grab a seat!","${nickname}, welcome in. Join us in our digital trek.","Hello World! Welcome in ${nickname}","New connection detected, hello ${nickname}!"],subscriber:["It means so much for you to subscribe ${nickname}. Let's develop a greater community together!","${subscriber.length} month${subscriber.plural} of support! Thank you so much ${nickname} it means so much! heart","Hello chat! ${nickname} has subscribed for ${subscriber.length} month${subscriber.plural}. Thank you for your commitment.","Secure connection established! Thank you for your subscription ${nickname}! Your content should be delivered shortly, smile!","PING . . . PONG! Thank you for your month${subscriber.plural} subscription ${nickname}. Your support will keep us journeying through cyberspace!"],"gift-single":["Thank you for gifting a subscription, ${nickname}. ${gift.receiver} enjoy your stay."],"gift-bulk-sent":["Thank you for gifting ${gift.count} subscriptions ${nickname}."],"gift-bulk-received":[],raid:["Incoming DDOS? No! its ${nickname} bringing ${raid.count} raider${raid.plural}. Welcome!","SELECT FROM ${nickname} JOIN waterkat. Join us ${raid.count} raider${raid.plural}. Welcome in!","New network detected! Establishing connection with ${nickname}, and their ${raid.count} raider${raid.plural}!","Incoming stream! Parsing ${raid.count} new connection${raid.plural}. Thank you for joining ${nickname}!","${raid.count} new viewer${raid.plural} detected. Thank your ${nickname} for bringing your community!"],cheer:["Thank you for the cheer! ${nickname}"],chat:[],command:[],redeem:[],"chat-first":["Client connected, hello ${nickname}!","Beep boop, Hi ${nickname}!","Hello! Take a seat ${nickname}!","Thanks for joining us ${nickname}!","Hello world! says ${nickname}","${nickname}, welcome in"],"event-subscriber-message":["${nickname} says... ${message.text}"],"command-say":["${message.text}"]}}},i=y;var r0=function(){if(typeof providedConfig!=="undefined")return providedConfig;return i},Z3=r0();function s(Y){const J=document.createElement("canvas");return J.width=Y.size.x,J.height=Y.size.y,J.style.width=`${Y.size.x}px`,J.style.height=`${Y.size.y}px`,J.style.margin="0 0",J.style.padding="0 0",J.style.imageRendering=Y.antialiasing?"smooth":"pixelated",J}function o(Y){const J=Y.dimensions??{},$=J.sx??0,W=J.sy??0,H=J.sw??Y.bitmap.width,U=J.sh??Y.bitmap.height,X=J.dx??0,K=J.dy??0,Z=J.dw??Y.ctx.canvas.clientWidth,N=J.dh??Y.ctx.canvas.clientWidth;Y.ctx.drawImage(Y.bitmap,$,W,H,U,X,K,Z,N)}function a(Y,J){const $=J?.dimensions??{},W=$.x??0,H=$.y??0,U=$.w??Y.canvas.clientWidth,X=$.h??Y.canvas.clientHeight;Y.clearRect(W,H,U,X)}var g=p0(Q0(),1);async function F0(Y){try{const J=(await Promise.all(Y.urls.map((H)=>c1(H)))).filter((H)=>H!==void 0);if(J.length<1)return;return(await Promise.all(J.flatMap(async(H)=>{if(H.type==="image/gif")return b1(H);else if(H.type==="image/png"||H.type==="image/jpeg")return{bitmap:await u1(H),delay:Y.delay};else return}))).filter((H)=>H!==void 0).flat()}catch(J){console.warn(J);return}}async function b1(Y){try{const $=await new Response(Y).arrayBuffer(),W=g.parseGIF($),H=g.decompressFrames(W,!0),U=W.lsd.width,X=W.lsd.height,Z=new OffscreenCanvas(U,X).getContext("2d");return(await Promise.all(H.map(async(G)=>{const M=new ImageData(G.patch,G.dims.width,G.dims.height),A=await createImageBitmap(M);return Z.drawImage(A,G.dims.left,G.dims.top),createImageBitmap(Z.getImageData(0,0,U,X))}))).map((G,M)=>({bitmap:G,delay:H[M].delay}))}catch(J){console.warn(J);return}}async function y1(Y){try{return await(await fetch(Y)).blob()}catch(J){console.warn(J);return}}async function E1(Y){try{const J=Y.substring(Y.indexOf(":")+1,Y.indexOf(";")),$=Y.substring(Y.indexOf(",")+1),W=atob($),H=new Array(W.length);for(let X=0;X<W.length;X++)H[X]=W.charCodeAt(X);const U=new Uint8Array(H);return new Blob([U],{type:J})}catch(J){console.warn(J);return}}async function c1(Y){try{const J=await(f1(Y)?E1(Y):y1(Y));if(!J||!g1.includes(J.type))return;return J}catch(J){console.warn(J);return}}async function u1(Y){try{return await createImageBitmap(Y)}catch(J){console.warn(J);return}}var f1=(Y)=>Y.startsWith("data:image"),g1=["image/png","image/jpeg","image/gif"];async function A0(Y){const J=await Promise.all(Y.renderDatas.map(($)=>F0({urls:$.urls??[],delay:$.delay})));Y.renderDatas.forEach(($,W)=>{$.bitmaps=J[W]??[]})}function l(Y,J){const $=J.renderDatas.map((W)=>{const H=J.params.find((K)=>K.name===W.name),U=d1(W.paramInfo.min,W.paramInfo.max,l1(W.paramInfo.min,W.paramInfo.max,H?H.value:W.paramInfo.default)),X=Math.floor(W.bitmaps.length*U);return{name:W.name,bitmapBundle:W.bitmaps[X<W.bitmaps.length?X:W.bitmaps.length-1]}});a(Y),$.forEach((W)=>{o({ctx:Y,bitmap:W.bitmapBundle.bitmap})})}function R0(Y,J){const $=J.renderDatas.map((W)=>({name:W.name,value:W.paramInfo.default}));l(Y,{...J,params:$})}var d1=(Y,J,$)=>Math.min(J,Math.max(Y,$)),l1=(Y,J,$)=>($-Y)/(J-Y);function M0(Y){if(typeof Y!=="object")return!1;if(typeof Y.canvas!=="object")return!1;if(typeof Y.defaultFPS!=="number")return!1;if(typeof Y.sprites!=="object")return!1;return!0}function z0(Y){const J=m1(Y.sprites,Y.defaultFPS);return{canvas:Y.canvas,renderDatas:J,params:J.map(($)=>({name:$.name,value:$.paramInfo.default}))}}function m1(Y,J){const $=1000/J;return Object.keys(Y).map((W)=>({name:W,paramInfo:{min:0,max:1,default:0},delay:$,urls:typeof Y[W]==="string"?[Y[W]]:Y[W].map((H)=>H),bitmaps:[]}))}async function k0(Y){try{const J=M0(Y)?z0(Y):Y,$=s(Y.canvas),W=$.getContext("2d");return document.body.appendChild($),await A0(J),R0(W,J),{canvas:$,ctx:W,config:J}}catch(J){console.warn(J);return}}async function B0(Y){const J=Y?.context??new AudioContext,$=Y?.analyzer??J.createAnalyser();$.fftSize=Y?.fftSize??2048,$.connect(J.destination);const W=J.createBuffer(1,1,J.sampleRate),H=J.createBufferSource();H.buffer=W,H.connect($),H.start(),await new Promise((K)=>{setInterval(()=>{if(J.resume(),J.state!=="suspended")K()},Y?.suspensionInterval??500)}),H.disconnect();const U=[];return{context:J,analyzer:$,sourceNodes:U,QueueAudioBuffer(K){if(K instanceof Promise)U.push(K.then((Z)=>{const N=J.createBufferSource();return N.buffer=Z,N.connect($),N}));else{const Z=J.createBufferSource();Z.buffer=K,Z.connect($),U.push(new Promise((N)=>N(Z)))}},async PlayQueue(){while(U.length>0){try{const K=await U[0];await new Promise((Z)=>{K.start(),K.addEventListener("ended",()=>{Z()})})}catch(K){console.error(K)}U.shift()}},StopAndClearQueue(){while(U.length>0)U.pop()?.then((K)=>K.stop())},GetAmplitude(){if(U.length<1)return 0;const K=new Uint8Array($.fftSize/2);return $.getByteTimeDomainData(K),K.reduce((N,F)=>{const G=Math.abs(N-128);return G>F?G:F},0)/128},GetFrequencyData(K,Z=!1,N){if(!K){const A=new Uint8Array($.frequencyBinCount);$.getByteFrequencyData(A);const O=new Array(A.length);for(let k=0;k<A.length;k++)O[k]=A[k]/255;return O}if(K<1||isNaN(K)||!isFinite(K))return[];const F=new Uint8Array($.frequencyBinCount),G=Math.min(N??F.length,F.length);$.getByteFrequencyData(F);const M=new Array(K);for(let A=0;A<K;A++){let O=0;if(Z)O=Math.sqrt(A/K)*G;else O=A*G/K;O=Math.max(Math.floor(O),0);let k=0;if(Z)k=Math.sqrt((A+1)/K)*G;else k=(A+1)*G/K;k=Math.min(Math.floor(k),G),M[A]=F.slice(O,k).reduce((I,D)=>I+D,0),M[A]/=(k-O)*256}return M}}}async function c(Y,J,$="Brian",W={normalize:!0,downmix_to_mono:!0}){if(!J||J.length<1)throw new Error("Text must be provided");const H="https://api.streamelements.com/kappa/v2/speech"+`?voice=${$}`+`&text=${encodeURIComponent(J.trim())}`;return v1(Y,H,W)}async function v1(Y,J,$){const H=await(await fetch(J)).arrayBuffer(),U=await Y.decodeAudioData(H);if($)return p1(Y,U,$);return U}function p1(Y,J,$){if(!$)return J;const W=[];for(let Z=0;Z<J.numberOfChannels;Z++)W.push(J.getChannelData(Z));let H=1;if($.normalize){H=0;for(let Z=0;Z<W.length;Z++)for(let N=0;N<W[Z].length;N++){const F=Math.abs(W[Z][N]);if(F>H)H=F}}const U=$.normalize?H/H:1,X=Y.createBuffer($.downmix_to_mono?1:J.numberOfChannels,J.length,J.sampleRate),K=[];for(let Z=0;Z<X.numberOfChannels;Z++)K.push(X.getChannelData(Z));for(let Z=0;Z<W[0].length;Z++)for(let N=0;N<W.length;N++)if($.downmix_to_mono)K[0][Z]+=W[N][Z]*U/W.length;else K[N][Z]=W[N][Z]*U;return X}var q;(function(O){O["TS_TYPE"]="al-aonyxbuddy-data";O["FOLLOW"]="follow";O["SUBSCRIBER"]="subscriber";O["GIFT_SINGLE"]="gift-single";O["GIFT_BULK_SENT"]="gift-bulk-sent";O["GIFT_BULK_RECEIVED"]="gift-bulk-received";O["RAID"]="raid";O["CHEER"]="cheer";O["CHAT"]="chat";O["CHAT_FIRST"]="chat-first";O["COMMAND"]="command";O["REDEEM"]="redeem";O["IGNORE"]="ignore";O["OTHER"]="other"})(q||(q={}));var P=(Y)=>typeof Y.message!=="undefined";function m(Y){function J(H){return{text:H??"",emotes:[]}}function $(H){const U=H;return{tstype:q.TS_TYPE,type:q.CHAT,username:U.data.nick,nickname:U.data.displayName??U.data.nick,message:{text:U.data.text,emotes:U.data.emotes.map((K)=>({type:K.type,name:K.name}))},permissions:{chatter:!0,follower:!1,subscriber:U.data.tags.subscriber==="1",vip:U.data.tags.vip==="1",moderator:U.data.tags.mod==="1",streamer:U.data.channel===U.data.nick}}}function W(H){if(H.type==="subscriber"){if(H.bulkGifted||H.isCommunityGift||H.gifted)H.type="gift"}const U=H;let X;const K={tstype:q.TS_TYPE,username:U.name};switch(U.type){case"follower":X={...K,type:q.FOLLOW};break;case"subscriber":X={...K,type:q.SUBSCRIBER,length:U.amount,message:J(U.message)};break;case"gift":if(+U.bulkGifted>0)X={...K,username:U.sender,type:q.GIFT_BULK_SENT,count:+U.amount||1};else if(+U.isCommunityGift>0)X={...K,username:U.sender,type:q.GIFT_BULK_RECEIVED,receiver:U.name};else X={...K,username:U.sender,type:q.GIFT_SINGLE,receiver:U.name};break;case"raid":X={...K,type:q.RAID,count:+U.amount||0};break;case"cheer":X={...K,type:q.CHEER,amount:U.amount||0,message:J(U.message)};break;default:return}return X}if(Y.type!=="message")return W(Y);else return $(Y)}function C0(Y){if(!window){console.warn(new Error("Window not found, this can only run in a browser"));return}function J($){if(!$||!$.detail||!$.detail.event)return;if(typeof $.detail.event.itemId!=="undefined")$.detail.listener="redemption-latest";const W={...$.detail.event,type:$.detail.listener.split("-")[0]},H=m(W);if(H)Y(H)}return window.addEventListener("onEventReceived",J),{RemoveListener:()=>window.removeEventListener("onEventReceived",J)}}function w0(Y){if(!window){console.warn(new Error("Window not found, this can only run in a browser"));return}function J($){if(!$||!$.detail)return;if($.detail.tstype!==q.TS_TYPE)return;Y($.detail)}return window.addEventListener(q.TS_TYPE,J),{RemoveListener:()=>window.removeEventListener(q.TS_TYPE,J)}}class V{value;logs;constructor(Y,J=[]){this.value=Y,this.logs=J}map(Y){const J=Y(this.value);return new V(J.getValue(),[...this.logs,...J.getLogs()])}log(Y){return new V(this.value,[...this.logs,Y])}getValue(){return this.value}getLogs(){return this.logs}}function L0(Y){if(!Y||!Y.blacklist)return function(J){return new V(J,["blacklist was not defined"])};return function(J){const $=Y.blacklist.includes(J.username);return new V($?{tstype:J.tstype,type:q.IGNORE,username:J.username,reason:"blacklist"}:J,[`blacklist was ${$}`])}}function j0(Y){if(!Y||!Y.identifiers||Y.identifiers.length===0||!Y.actions||Y.actions.length===0)return function(J){return new V(J,["options not provided or empty"])};return function(J){if(!P(J))return new V(J,["Not a message event"]);const $=J.message.text.replace(r1," ").replace(i1,"").trim(),H=Y.identifiers.find((M)=>$.startsWith(M));if(!H)return new V(J,["No valid identifier"]);const U=$.substring(H.length).trim(),Z=(Y.actions??[]).map((M)=>({action:M.split("@")[0],aliases:M.split("@").join(",").split(",")})).find((M)=>M.aliases.some((A)=>U.startsWith(A)));if(!Z)return new V(J,["No valid alias"]);const N=Z.action,F=U.substring(Z.aliases.find((M)=>U.startsWith(M))?.length??0).trim(),G={tstype:J.tstype,type:q.COMMAND,username:J.username,nickname:J.nickname,identifier:H,group:H,action:N,args:F};return new V(G,["Command processed"])}}var r1=/\s+/,i1=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g;function P0(Y){if(!Y||!Y.botlist||Y.botlist.length===0||!Y.allow||Y.allow.length===0)return function(J){return new V(J,["options not defined or empty"])};return function(J){const $=Y.botlist.includes(J.username),W=Y.allow.includes(J.type),H=[`is ${$?"bot":"not bot"}`+` and is ${W?"allowed":"not allowed"}`];if($&&!W)return new V({tstype:q.TS_TYPE,username:J.username,type:q.IGNORE,reason:"botlist"},H);else return new V(J,H)}}var s1=function(Y,J,$){let W=J;for(let H=0;H<Y.length;H++)W=J.replace(Y[H],$);return W},o1=function(Y,J,$){let W=J;for(let H=0;H<Y.length;H++)W=W.replace(new RegExp(Y[H].replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),"ig"),$);return W};function I0(Y){if(!Y||!Y.wordsToFilter||Y.wordsToFilter.length===0)return function(J){return new V(J,["options not defined"])};return function(J){if(!P(J))return new V(J,["Not a message event"]);const W={...JSON.parse(JSON.stringify(J)),message:{text:s1(Y.wordsToFilter,J.message.text,Y.replacement),emotes:J.message.emotes.map((H)=>({type:H.type,name:H.name}))}};return new V(W,["Filtered case sensitive"])}}function D0(Y){if(!Y||!Y.wordsToFilter||Y.wordsToFilter.length===0)return function(J){return new V(J,["options not defined"])};return function(J){if(!P(J))return new V(J,["Not a message event"]);const W={...JSON.parse(JSON.stringify(J)),message:{text:o1(Y.wordsToFilter,J.message.text,Y.replacement),emotes:J.message.emotes.map((H)=>({type:H.type,name:H.name}))}};return new V(W,["Filtered case insensitive"])}}function T0(Y){if(!Y||!Y.filter)return function(J){return new V(J,["options not defined or not set to filter emojis"])};return function(J){if(!P(J))return new V(J,["event is not a message event"]);const W={...JSON.parse(JSON.stringify(J)),message:{text:J.message.text.replace(a1,Y.replacement),emotes:J.message.emotes.map((H)=>({type:H.type,name:H.name}))}};return new V(W,["filtered emojis"])}}var a1=/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;function h0(Y){if(!Y||!Y.filter)return function(J){return new V(J,["options not defined or filter is false"])};return function(J){if(!P(J))return new V(J,["event is not a message event"]);const W={...JSON.parse(JSON.stringify(J)),message:{text:J.message.text.replace(n1,Y.replacement??""),emotes:J.message.emotes.map((H)=>({type:H.type,name:H.name}))}};return new V(W,["Cheermotes filtered"])}}var n1=/Cheer\d+/g;function _0(Y){if(!Y||!Y.nicknameMap||Object.keys(Y.nicknameMap).length===0)return($)=>new V($,["options not defined or nicknameMap is empty"]);const J=Y.randomBetween01Func??Math.random;return function($){const W=JSON.parse(JSON.stringify($));return new V({...W,nickname:Y.nicknameMap[$.username]&&Y.nicknameMap[$.username].length>0?Y.nicknameMap[$.username][Math.floor(J()*Y.nicknameMap[$.username].length)]:$.username},["nickname assigned"])}}function S0(Y){if(!Y||!Y.permissionRequirements||!Y.permissions)return(J)=>new V(J,["options not defined"]);return function(J){if(!(J.type in Y.permissionRequirements))return new V(J,["no permissions required"]);const W=t1(J.username,Y.permissions),H=Y.permissionRequirements[J.type];if(W<H)return new V({tstype:J.tstype,username:J.username,type:q.IGNORE,reason:"permissions"},[`permissions not met by ${J.username} for ${J.type}`]);else return new V(J,["permissions met"])}}var B;(function(X){X[X["STREAMER"]=100]="STREAMER";X[X["MODERATOR"]=80]="MODERATOR";X[X["VIP"]=60]="VIP";X[X["SUBSCRIBER"]=40]="SUBSCRIBER";X[X["FOLLOWER"]=20]="FOLLOWER";X[X["CHATTER"]=0]="CHATTER"})(B||(B={}));var t1=(Y,J)=>typeof J[Y]!=="undefined"?J[Y]:B.CHATTER;function x0(Y){if(!Y||!Y.lowercase)return(J)=>new V(J,["options not defined or lowercase not set"]);return function(J){return new V({...J,username:Y.lowercase?J.username.toLowerCase():J.username},["validated"])}}function b0(Y){if(!Y)return function(J){return new V({tstype:J.tstype,type:q.IGNORE,username:J.username,reason:"condition"},["options were not defined"])};return function(J){return new V(Y?.condition?J:{tstype:J.tstype,type:q.IGNORE,username:J.username,reason:"condition"},[`condition was ${Y.condition}`])}}function y0(Y){const J=b0(Y.conditionOptions),$=x0(Y.validateOptions),W=L0(Y.blacklistOptions),H=j0(Y.commandOptions),U=P0(Y.botlistOptions),X=I0(Y.caseSensitiveOptions),K=D0(Y.caseInsensitiveOptions),Z=T0(Y.emojisOptions),N=h0(Y.cheerOptions),F=_0(Y.nicknamesOptions),G=S0(Y.permissionsOptions);return function(M){return new V(M).log("ProcessEvent:\n").log("ValidateEvent: ").map($).log("FilterBlacklist: ").map(W).log("ProcessCommand: ").map(H).log("FilterBotlist: ").map(U).log("ProcessCaseSensitive: ").map(X).log("ProcessCaseInsensitive: ").map(K).log("FilterEmojis: ").map(Z).log("FilterCheermotes: ").map(N).log("GetNicknames: ").map(F).log("FilterPermissions: ").map(G)}}function v(Y){if(typeof Y!=="object")return!1;if(typeof Y.owner_id!=="string")return!1;if(typeof Y.nickname!=="string")return!1;if(typeof Y.nicknames!=="object")return!1;if(typeof Y.blacklist!=="object")return!1;if(typeof Y.botlist!=="object")return!1;if(typeof Y.blockedWords!=="object")return!1;return!0}function E0(Y){return{caseInsensitiveOptions:{wordsToFilter:Y.blockedWords,replacement:""},validateOptions:{lowercase:!0},caseSensitiveOptions:{wordsToFilter:[],replacement:""},commandOptions:{identifiers:["!aonyxbuddy",`!${Y.nickname}`,"!!"],actions:["debug","say@:","mute","unmute","skip@>"]},nicknamesOptions:{nicknameMap:Y.nicknames,randomBetween01Func:Math.random},blacklistOptions:{blacklist:Y.blacklist},emojisOptions:{filter:!0,replacement:""},botlistOptions:{botlist:Y.botlist,allow:[q.COMMAND]},permissionsOptions:{permissionRequirements:{[q.TS_TYPE]:B.CHATTER,[q.CHAT]:B.CHATTER,[q.CHAT_FIRST]:B.FOLLOWER,[q.CHEER]:B.CHATTER,[q.SUBSCRIBER]:B.CHATTER,[q.FOLLOW]:B.CHATTER,[q.RAID]:B.CHATTER,[q.GIFT_BULK_RECEIVED]:B.CHATTER,[q.GIFT_BULK_SENT]:B.CHATTER,[q.GIFT_SINGLE]:B.CHATTER,[q.COMMAND]:B.MODERATOR,[q.REDEEM]:B.CHATTER,[q.IGNORE]:B.CHATTER,[q.OTHER]:B.CHATTER},permissions:{[Y.owner_id]:B.STREAMER,aonyxbuddy:B.MODERATOR}},cheerOptions:{filter:!0,replacement:""},conditionOptions:{condition:!0}}}function e1(Y){return Math.floor(Math.random()*Y.length)}function f0(Y){if(!Y.responses[Y.key])return"";if(Y.responses[Y.key].length<1)return"";return Y.responses[Y.key][e1(Y.responses[Y.key])]}function J3(Y){return{nickname:Y.nickname??Y.username,"subscriber.length":Y.type===q.SUBSCRIBER?Y.length.toString():"","subscriber.plural":Y.type===q.SUBSCRIBER?(Y.length??0)>1?"s":"":"","gift.receiver":Y.type===q.GIFT_BULK_RECEIVED?Y.receiver??"":"","gift.count":Y.type===q.GIFT_BULK_SENT?Y.count.toString()??"":"","raid.count":Y.type===q.RAID?Y.count.toString()??"":"","raid.plural":Y.type===q.RAID?(Y.count??0)>1?"s":"":"","cheer.amount":Y.type===q.CHEER?Y.amount.toString()||"":"","cheer.plural":Y.type===q.CHEER?(Y.amount??0)>1?"s":"":"","message.text":P(Y)?Y.message.text??"":""}}function c0(Y,J){return $3(J3(Y),f0(J))}function Y3(Y,J,$){const W=new RegExp(`\\\$\\{\\s*${J}\\s*\\}`,"g");return Y.replace(W,$)}function $3(Y,J){let $=J;for(let W in Y)$=Y3($,W,Y[W]);return $}var g0;(function(G){G["NICKNAME"]="nickname";G["SUBSCRIBER_LENGTH"]="subscriber.length";G["SUBSCRIBER_LENGTH_PLURAL"]="subscriber.plural";G["GIFT_RECEIVER"]="gift.receiver";G["GIFT_COUNT"]="gift.count";G["GIFT_COUNT_PLURAL"]="gift.count.plural";G["RAID_COUNT"]="raid.count";G["RAID_COUNT_PLURAL"]="raid.plural";G["CHEER_COUNT"]="cheer.amount";G["CHEER_COUNT_PLURAL"]="cheer.plural";G["MESSAGE_TEXT"]="message.text"})(g0||(g0={}));async function u0(Y){const{audioQueue:J,renderer:$}={audioQueue:await B0({fftSize:32}),renderer:await k0(Y.spriteRendering)};if(!$||!J){console.error("Failed to initialize renderer or audioQueue. Exiting.");return}const W=$.config.params.find((R)=>R.name==="talking"),H=$.config.params.find((R)=>R.name==="mute");let U=!0,X=0,K=[0];const Z=setInterval(()=>{if(!W||!U){clearInterval(Z);return}const R=J.GetFrequencyData();if(R.length>K.length)K=new Array(R.length).fill(0);K=R.map((z,w)=>Math.max(z,K[w])),R.forEach((z,w)=>z/=K[w]);const C=Math.abs(R.reduce((z,w,j)=>{const L=j<R.length/4?1:-1;return z+w*L},0));X=Math.max(C,X),W.value=C/X},1000/Y.spriteRendering.defaultFPS);function N(){if(!$||!U)return;if(l($.ctx,$.config),Y.spriteRendering.defaultFPS>0)setTimeout(()=>{requestAnimationFrame(N)},1000/Y.spriteRendering.defaultFPS);else requestAnimationFrame(N)}N();let F=!1;const G=[];function M(){if(G.length>0&&!F&&U){F=!0;const R=G.shift();if(R)R().then(()=>{F=!1,M()})}}const A=v(Y)?E0(Y):Y,O=y0(A);console.log("ProcessEvent:",A,v(Y));function k(R){if(console.log("Command:",R),R.type!==q.COMMAND){console.error("HandleCommand: event is not a command.");return}switch(R.action.toLocaleLowerCase()){case"debug":break;case"say":G.push(()=>new Promise((z,w)=>{J.QueueAudioBuffer(c(J.context,R.args)),J.PlayQueue().then(z).catch(w)})),M();break;case"skip":if(R.args.trim().length<1)J.StopAndClearQueue();else if(!isNaN(+R.args.trim())){const z=Math.max(0,+R.args-1);G.splice(0,z),J.StopAndClearQueue()}else if(R.args.trim()==="all")G.splice(0,G.length),J.StopAndClearQueue();break}}function I(R){if(!U)return;const C=O(R),z=C.getValue();if(console.log("Event:",z,C.getLogs()),z.type===q.COMMAND)return k(z);const w=c0(z,{responses:Y.responses.voice,key:z.type,randomBetween01Func:Math.random});if(!w||w.length<0)return;const j=()=>new Promise((L,S)=>{J.QueueAudioBuffer(c(J.context,w)),J.PlayQueue().then(L).catch(S)});G.push(j),M()}const D=C0(I),_=w0(I);if(!D&&!_){console.error("Failed to initialize event listener. Exiting.");return}const h=()=>new Promise((R,C)=>{J.QueueAudioBuffer(c(J.context,`A-onyx Buddy systems online. ${Y.nickname}, is active.`)),J.PlayQueue().then(R).catch(C)});return G.push(h),M(),{Stop:()=>{U=!1,clearInterval(Z),J.StopAndClearQueue(),D?.RemoveListener(),_?.RemoveListener()}}}if(typeof window!=="undefined")console.log("AonyxBuddy created, refer to window.aonyxbuddy for access."),window.aonyxbuddy=u0(typeof AonyxBuddyConfig!=="undefined"?AonyxBuddyConfig:y);else console.warn("AonyxBuddy: No window object found."),u0(typeof AonyxBuddyConfig!=="undefined"?AonyxBuddyConfig:y);

  

```

---

&copy; 2024 AonyxLimited. All rights reserved.
