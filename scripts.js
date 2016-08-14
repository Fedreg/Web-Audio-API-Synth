
//start new audio session. Do this only once
var context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)

var compressor = context.createDynamicsCompressor();
	compressor.threshold.value = -24;
	compressor.knee.value = 40;
	compressor.ratio.value = 12;
	compressor.reduction.value = -20;
	compressor.attack.value = 0;
	compressor.release.value = 0.25;
	compressor.connect(context.destination);


//main function for crearing sound
function playSound(note) {
	oscillator = context.createOscillator();
	
	//create volume controller
	var gainNode = context.createGain();
	
	//connect signal to audio to gain; gain to compressor (compressor to output)
 	oscillator.connect(gainNode);
 	gainNode.connect(compressor); 	
 	
 	//adjusts frequency played by 50%, 100% or 200% 
	var octave = document.getElementById('octave').value;

	//sets oscillator frequency
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	//oscillator wave type
 	oscillator.type = document.getElementById('waveSelect').value;

 	
 	//initialize gain at 0 and ramp up to full volume very quikcly (prevents audible 'pop')
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, 0.1);
 	
 	//starts oscillator. Delayed start can be achieved by adding time(in secs) after currentTime
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
 		//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		compressor.connect(gainNode);
		gainNode.connect(delay);
		delay.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
	//distortion curve taken from MDN which they in turn took from Stack Overflow
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
	
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
		//decrease gain
 		quickFadeOut;
	} 
	
	if (document.getElementById('toggleDelay').value == 'true'){delayNode();}	
	if (document.getElementById('toggleDistortion').value == 'true'){distortionNode();}
 	
 	//determines note duration
 	var sustain = parseFloat(document.getElementById('sustain').value);
 	
 	//stops oscillator by exponentially ramping down sound over .015 seconds to avoid audible click
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);

	//append the word "note" to the object.name note to identify the correct key div
	var divId = "n" + String(note);
	var element = document.getElementById(divId);
    
	//change background color for durarion of note length

 	//for testing
 	console.log('playSound Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime.toFixed(2));
}

 //controls 2nd keyboard.  Same logic as playSound()
function playSoundb(note) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octaveb').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectb').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, .1);
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayb').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortionb').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustainb').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "b";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#3ce4f7';
    setTimeout(function () {
    	if (currentColor != 'rgb(60, 228, 247)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*B* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//third keyboard
function playSoundc(note) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octavec').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectc').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, .1);
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayc').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortionc').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustainc').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "c";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#fa0a8b';
    setTimeout(function () {
    	if (currentColor != 'rgb(250, 10, 139)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*C* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//fourth keyboard
function playSoundd(note) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octaved').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectd').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, .1);
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayd').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortiond').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustaind').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "d";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#ad3cf7';
    setTimeout(function () {
    	if (currentColor != 'rgb(173, 60, 247)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*D* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//change key color on keypress
function keyCol(color) {
	var currentColor = element.style.backgroundColor;
	element.style.backgroundColor = color;
	
	setTimeout(function () {
		if (currentColor != 'rgb(60, 247, 172)') {
    		element.style.backgroundColor = currentColor
  	  	}
 	}, 1000 * sustain);    
}

//Vue
new Vue({ el: '#keyboarda', methods: {play: function(note){playSound(note)}}})
new Vue({ el: '#keyboardb', methods: {play: function(note){playSound(note)}}})
new Vue({ el: '#keyboardc', methods: {play: function(note){playSound(note)}}})
new Vue({ el: '#keyboardd', methods: {play: function(note){playSound(note)}}})


//Frequencies in Hz of notes to be played. 
var frequencies = {
 	'n1': 130.81, //c
 	'n2': 139.00, //c#
 	'n3': 146.83, //d
 	'n4': 156.00, //d#
 	'n5': 164.81, //e
 	'n6': 174.61, //f
 	'n7': 185.00, //f#
 	'n8': 196.00, //g
 	'n9': 208.00, //g#
 	'n10': 220.00, //a
 	'n11': 233.00, //a#
 	'n12': 246.94, //b
 	'n13': 261.63, //c
 	'n14': 277.00, //c#
 	'n15': 293.66, //d
 	'n16': 311.00, //d#
 	'n17': 329.63, //e
 	'n18': 349.23, //f
 	'n19': 370.00, //f#
 	'n20': 392.00, //g
 	'n21': 415.00, //g#
 	'n22': 440.00, //a
 	'n23': 466.00, //a#
 	'n24': 493.88, //b
 	'n25': 523.25, //c
 };

/**
 *	UI
 */
 

//hides the chromatic notes of the keyboard
function ezMode() {
	var chromaticNotes = document.getElementsByClassName('black-keys');
		
	for (var i = 0; i < chromaticNotes.length; i++) {
		if (chromaticNotes[i].style.display == 'block')
		chromaticNotes[i].style.display = 'none';
		
		else 
		chromaticNotes[i].style.display = 'block';
	}
}

//change UI color theme
function themeChange() {
	var skin = document.getElementById('wrapper');
	var nav = document.getElementById('navigation');
	var toggleTheme = document.getElementById('theme');
	var burger = document.getElementById('burger');	
	var select = document.getElementsByTagName('select');
	
	for (var i = 0; i < select.length; i++) {

		if (toggleTheme.value == 'true') {
			skin.style.background = 'linear-gradient(to bottom right, #ddd 40%, #bbb)';
			nav.style.backgroundColor = '#fff';
			burger.style.color ='#555';
			select[i].style.color ='#000';
		}
		
		else {
			skin.style.background = 'linear-gradient(to bottom right, #333 40%, #000)';
			nav.style.backgroundColor = '#000';
			burger.style.color ='#777';
			select[i].style.color ='#fff';
			
		}console.log(i);
	}
}
	

//check for touchscreen and provide correct event for listener
function ifTouch() {
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    	return 'touchstart';
    
    else {
    	return 'click';
	}
} 