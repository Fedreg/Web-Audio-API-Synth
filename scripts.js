//start new audio session. Do this only once
var context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)

var compressor = context.createDynamicsCompressor();
	compressor.threshold.value = -50;
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
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.25, context.currentTime, 0.1);
 	
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
		    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
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
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.0015);
 	oscillator.stop(context.currentTime + sustain + .05);
 	
	//change key color on keypress

	//append the word "note" to the object.name note to identify the correct key div
	var divId = "note" + String(note);
	var element = document.getElementById(divId);
    
	//change background color for durarion of note length
	var currentColor = element.style.backgroundColor;
	element.style.backgroundColor = '#3cf7ac';
	
	setTimeout(function () {
		if (currentColor != 'rgb(60, 247, 172)') {
    		element.style.backgroundColor = currentColor
  	  	}
 	}, 1000 * sustain);    

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
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.25, context.currentTime, .1);
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
		    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
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
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.0015);
 	
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

//triggers playSound() to create note
document.getElementById('noteC_1').addEventListener(ifTouch() ,function() { playSound('C_1');});
document.getElementById('noteC#1').addEventListener(ifTouch() ,function() { playSound('C#1');});
document.getElementById('noteD_1').addEventListener(ifTouch() ,function() { playSound('D_1');});
document.getElementById('noteD#1').addEventListener(ifTouch() ,function() { playSound('D#1');});
document.getElementById('noteE_1').addEventListener(ifTouch() ,function() { playSound('E_1');});
document.getElementById('noteF_1').addEventListener(ifTouch() ,function() { playSound('F_1');});
document.getElementById('noteF#1').addEventListener(ifTouch() ,function() { playSound('F#1');});
document.getElementById('noteG_1').addEventListener(ifTouch() ,function() { playSound('G_1');});
document.getElementById('noteG#1').addEventListener(ifTouch() ,function() { playSound('G#1');});
document.getElementById('noteA_1').addEventListener(ifTouch() ,function() { playSound('A_1');});
document.getElementById('noteA#1').addEventListener(ifTouch() ,function() { playSound('A#1');});
document.getElementById('noteB_1').addEventListener(ifTouch() ,function() { playSound('B_1');});
document.getElementById('noteC_2').addEventListener(ifTouch() ,function() { playSound('C_2');});
document.getElementById('noteC#2').addEventListener(ifTouch() ,function() { playSound('C#2');});
document.getElementById('noteD_2').addEventListener(ifTouch() ,function() { playSound('D_2');});
document.getElementById('noteD#2').addEventListener(ifTouch() ,function() { playSound('D#2');});
document.getElementById('noteE_2').addEventListener(ifTouch() ,function() { playSound('E_2');});
document.getElementById('noteF_2').addEventListener(ifTouch() ,function() { playSound('F_2');});
document.getElementById('noteF#2').addEventListener(ifTouch() ,function() { playSound('F#2');});
document.getElementById('noteG_2').addEventListener(ifTouch() ,function() { playSound('G_2');});
document.getElementById('noteG#2').addEventListener(ifTouch() ,function() { playSound('G#2');});
document.getElementById('noteA_2').addEventListener(ifTouch() ,function() { playSound('A_2');});
document.getElementById('noteA#2').addEventListener(ifTouch() ,function() { playSound('A#2');});
document.getElementById('noteB_2').addEventListener(ifTouch() ,function() { playSound('B_2');});
document.getElementById('noteC_3').addEventListener(ifTouch() ,function() { playSound('C_3');});

//lower keyboard
document.getElementById('noteC_1b').addEventListener(ifTouch() ,function() { playSoundb('C_1');});
document.getElementById('noteC#1b').addEventListener(ifTouch() ,function() { playSoundb('C#1');});
document.getElementById('noteD_1b').addEventListener(ifTouch() ,function() { playSoundb('D_1');});
document.getElementById('noteD#1b').addEventListener(ifTouch() ,function() { playSoundb('D#1');});
document.getElementById('noteE_1b').addEventListener(ifTouch() ,function() { playSoundb('E_1');});
document.getElementById('noteF_1b').addEventListener(ifTouch() ,function() { playSoundb('F_1');});
document.getElementById('noteF#1b').addEventListener(ifTouch() ,function() { playSoundb('F#1');});
document.getElementById('noteG_1b').addEventListener(ifTouch() ,function() { playSoundb('G_1');});
document.getElementById('noteG#1b').addEventListener(ifTouch() ,function() { playSoundb('G#1');});
document.getElementById('noteA_1b').addEventListener(ifTouch() ,function() { playSoundb('A_1');});
document.getElementById('noteA#1b').addEventListener(ifTouch() ,function() { playSoundb('A#1');});
document.getElementById('noteB_1b').addEventListener(ifTouch() ,function() { playSoundb('B_1');});
document.getElementById('noteC_2b').addEventListener(ifTouch() ,function() { playSoundb('C_2');});
document.getElementById('noteC#2b').addEventListener(ifTouch() ,function() { playSoundb('C#2');});
document.getElementById('noteD_2b').addEventListener(ifTouch() ,function() { playSoundb('D_2');});
document.getElementById('noteD#2b').addEventListener(ifTouch() ,function() { playSoundb('D#2');});
document.getElementById('noteE_2b').addEventListener(ifTouch() ,function() { playSoundb('E_2');});
document.getElementById('noteF_2b').addEventListener(ifTouch() ,function() { playSoundb('F_2');});
document.getElementById('noteF#2b').addEventListener(ifTouch() ,function() { playSoundb('F#2');});
document.getElementById('noteG_2b').addEventListener(ifTouch() ,function() { playSoundb('G_2');});
document.getElementById('noteG#2b').addEventListener(ifTouch() ,function() { playSoundb('G#2');});
document.getElementById('noteA_2b').addEventListener(ifTouch() ,function() { playSoundb('A_2');});
document.getElementById('noteA#2b').addEventListener(ifTouch() ,function() { playSoundb('A#2');});
document.getElementById('noteB_2b').addEventListener(ifTouch() ,function() { playSoundb('B_2');});
document.getElementById('noteC_3b').addEventListener(ifTouch() ,function() { playSoundb('C_3');});

//Frequencies in Hz of notes to be played. 
var frequencies = {
 	'C_1': 130.81,
 	'C#1': 139.00,
 	'D_1': 146.83,
 	'D#1': 156.00,
 	'E_1': 164.81,
 	'F_1': 174.61,
 	'F#1': 185.00,
 	'G_1': 196.00,
 	'G#1': 208.00,
 	'A_1': 220.00,
 	'A#1': 233.00,
 	'B_1': 246.94,
 	'C_2': 261.63,
 	'C#2': 277.00,
 	'D_2': 293.66,
 	'D#2': 311.00,
 	'E_2': 329.63,
 	'F_2': 349.23,
 	'F#2': 370.00,
 	'G_2': 392.00,
 	'G#2': 415.00,
 	'A_2': 440.00,
 	'A#2': 466.00,
 	'B_2': 493.88,
 	'C_3': 523.25,
 };

/**
 *	UI
 */
 	 
//reveals 2nd keyboard
function displayKeyboard2(lowersynth, uppersynth, menub) {
	var bottom = document.getElementById(lowersynth);
	var top = document.getElementById(uppersynth);
	var bod = document.getElementById(bod);
	var menub = document.getElementById(menub);

	if (bottom.style.display == 'block') {
		bottom.style.display = 'none';
		top.style.paddingTop = '20%';
		menub.style.display = 'none';
	}

	else {
		bottom.style.display = 'block';
		top.style.paddingTop = '5%';
		menub.style.display = 'block';
	}	
}

//hides the chromatic notes of the keyboard
function ezMode() {
	var chromaticNotes = document.getElementsByClassName('black-keys');
		
	for (var i = 0; i < chromaticNotes.length; i++) {
		if (chromaticNotes[i].style.display == 'block') {
			chromaticNotes[i].style.display = 'none';
			document.getElementById('noteC_2').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('noteC_2b').style.backgroundColor = 'rgba(0,0,0,.2)';
		}
		
		else {
			chromaticNotes[i].style.display = 'block';
			document.getElementById('noteC_2').style.backgroundColor = 'rgba(0,0,0,0)';
			document.getElementById('noteC_2b').style.backgroundColor = 'rgba(0,0,0,0)';	
		}
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