//start new audio session. Do this only once
var context = new window.webkitAudioContext();
 
function playSound(note) {
	oscillator = context.createOscillator();
	//create volume controller
	var gainNode = context.createGain();
	
	//connect signal to audio output(speakers by default)
 	oscillator.connect(gainNode);
 	gainNode.connect(context.destination);
 	
 	//adjusts frequency played by 50%, 100% or 200% 
	var octave = document.getElementById('octave').value;
	
	//sets oscillator frequency
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	//oscillator wave type
 	oscillator.type = document.getElementById('waveSelect').value;
 	
 	//starts oscillator. Delayed start can be achieved by adding time(in secs) after currentTime
 	oscillator.start(context.currentTime + 0.01);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
 		//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value = 0.8;
		
		//create feedback loop
		oscillator.connect(gainNode);
		gainNode.connect(delay);
		delay.connect(gainNode);
		delay.connect(context.destination);	
		
		//decrease gain
		quickFadeOut;
	}
	
	//distortion function taken from MDN which they in turn took from Stack Overflow
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 50,
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
		
		distortion.curve = makeDistortionCurve(1000);
		distortion.oversample = '4x';
		
		gainNode;
		
		oscillator.connect(gainNode);
		gainNode.connect(distortion);
		//delay.connect(distortion);
		//distortion.connect(gainNode);
		//delay.connect(context.destination);
		distortion.connect(context.destination);
		
		//decrease gain
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelay').value == 'true'){delayNode();}	
	if (document.getElementById('toggleDistortion').value == 'true'){distortionNode();}
			
 	//determines note duration
 	var sustain = parseFloat(document.getElementById('sustain').value);
 	
 	//stops oscillator by exponentially ramping down sound over .015 seconds to avoid audible click
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.0015);
 	
 	//for testing
 	console.log('playSound Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime);
}


//Frequencies in Hz of notes to be played. 
window.frequencies = {
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
 
  
//triggers playSound() to create note
document.getElementById('noteC_1').addEventListener('touchstart',function() { playSound('C_1');});
document.getElementById('noteC#1').addEventListener('touchstart',function() { playSound('C#1');});
document.getElementById('noteD_1').addEventListener('touchstart',function() { playSound('D_1');});
document.getElementById('noteD#1').addEventListener('touchstart',function() { playSound('D#1');});
document.getElementById('noteE_1').addEventListener('touchstart',function() { playSound('E_1');});
document.getElementById('noteF_1').addEventListener('touchstart',function() { playSound('F_1');});
document.getElementById('noteF#1').addEventListener('touchstart',function() { playSound('F#1');});
document.getElementById('noteG_1').addEventListener('touchstart',function() { playSound('G_1');});
document.getElementById('noteG#1').addEventListener('touchstart',function() { playSound('G#1');});
document.getElementById('noteA_1').addEventListener('touchstart',function() { playSound('A_1');});
document.getElementById('noteA#1').addEventListener('touchstart',function() { playSound('A#1');});
document.getElementById('noteB_1').addEventListener('touchstart',function() { playSound('B_1');});
document.getElementById('noteC_2').addEventListener('touchstart',function() { playSound('C_2');});
document.getElementById('noteC#2').addEventListener('touchstart',function() { playSound('C#2');});
document.getElementById('noteD_2').addEventListener('touchstart',function() { playSound('D_2');});
document.getElementById('noteD#2').addEventListener('touchstart',function() { playSound('D#2');});
document.getElementById('noteE_2').addEventListener('touchstart',function() { playSound('E_2');});
document.getElementById('noteF_2').addEventListener('touchstart',function() { playSound('F_2');});
document.getElementById('noteF#2').addEventListener('touchstart',function() { playSound('F#2');});
document.getElementById('noteG_2').addEventListener('touchstart',function() { playSound('G_2');});
document.getElementById('noteG#2').addEventListener('touchstart',function() { playSound('G#2');});
document.getElementById('noteA_2').addEventListener('touchstart',function() { playSound('A_2');});
document.getElementById('noteA#2').addEventListener('touchstart',function() { playSound('A#2');});
document.getElementById('noteB_2').addEventListener('touchstart',function() { playSound('B_2');});
document.getElementById('noteC_3').addEventListener('touchstart',function() { playSound('C_3');});
