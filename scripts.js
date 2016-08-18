//start new audio session. Do this only once
var context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)


  		//compressor evens out min/max volume
		var compressor = context.createDynamicsCompressor();
		compressor.threshold.value = -54;
		compressor.knee.value = 40;
		compressor.ratio.value = 12;
		compressor.reduction.value = -40;
		compressor.attack.value = 0;
		compressor.release.value = 0.25;
		compressor.connect(context.destination);


//Vue
Vue.component('keyboard', {
	template: '#keyboard-template',
	props: ['frequency', 'octave', 'sustain', 'color'],
	data: function() {
    	return {
      		frequencies: []
    	};
  	},
	methods: {
	
		play(note){
		//adjusts frequency played by 50%, 100% or 200% 
		var octave = this.octave;
 		//determines note duration
 		var sustain = parseInt(this.sustain);
 		//determines color to change to 
 		var colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);//this.color;		//produces sound
		var oscillator = context.createOscillator();
		//oscillator wave type (sine, triangle, square, or sawtooth)
	 	oscillator.type = 'square';
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
 		//references current element to change its color
 		var currentDiv = event.currentTarget;
 		//change background color for durarion of note length
		currentDiv.style.backgroundColor = colorChanger;
		setTimeout(function () {
    			currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
 		}, 1000 * sustain);  
	}}
});
	
var vm = new Vue({
	el: '#app',
	data: {
		frequencies: [
		 	{note: 130.81}, //c
		 	{note: 146.83}, //d
		 	{note: 164.81}, //e
		 	{note: 174.61}, //f
		 	{note: 196.00}, //g
		 	{note: 220.00}, //a
		 	{note: 246.94}, //b
		 	{note: 261.63}, //c
		 	{note: 293.66}, //d
		 	{note: 329.63}, //e
		 	{note: 349.23}, //f
		 	{note: 392.00}, //g
		 	{note: 440.00}, //a
		 	{note: 493.88}, //b
		 	{note: 523.25}, //c
		 ]
	}
});
