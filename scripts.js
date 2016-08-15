//start new audio session. Do this only once
var context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)

//Vue
Vue.component('keyboard', {
	template: '#keyboard-template',
	props: ['frequency'],
	data: function() {
    	return {
      		frequencies: []
    	};
  	},
	methods: {
		play(note){
		console.log(note);//for testing
		
		//adjusts frequency played by 50%, 100% or 200% 
		var octave = 4;
 		//determines note duration
 		var sustain = 1;
		//compressor evens out min/max volume
		var compressor = context.createDynamicsCompressor();
		compressor.threshold.value = -24;
		compressor.knee.value = 40;
		compressor.ratio.value = 12;
		compressor.reduction.value = -20;
		compressor.attack.value = 0;
		compressor.release.value = 0.25;
		compressor.connect(context.destination);
		//produces sound
		var oscillator = context.createOscillator();
		//oscillator wave type (sine, triangle, square, or sawtooth)
	 	oscillator.type = 'triangle';
		//create volume controller
		var gainNode = context.createGain();
		//connect signal to audio to gain; gain to compressor (compressor to output)
	 	oscillator.connect(gainNode);
	 	gainNode.connect(compressor); 	
		//sets oscillator frequency
	 	oscillator.frequency.value = note * octave;
	 	console.log(oscillator.frequency.value);
	 	//initialize gain at 0 and ramp up to full volume very quikcly (prevents audible 'pop')
	 	gainNode.gain.value = 0
	 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, 0.1);
	 	oscillator.start(context.currentTime + .05);
 		var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
		}
	}
});
	
var vm = new Vue({
	el: '#app',
	data: {
		frequencies: [
		 	{note: 130.81}, //c
		 	{note: 139.00}, //c#
		 	{note: 146.83}, //d
		 	{note: 156.00}, //d#
		 	{note: 164.81}, //e
		 	{note: 174.61}, //f
		 	{note: 185.00}, //f#
		 	{note: 196.00}, //g
		 	{note: 208.00}, //g#
		 	{note: 220.00}, //a
			{note: 233.00}, //a#
		 	{note: 246.94}, //b
		 	{note: 261.63}, //c
		 ]
	}
});
