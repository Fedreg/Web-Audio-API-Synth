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

Vue.component('keyboard', {
	template: '#keyboard-template',
	props: ['frequency', 'octave', 'sustain'],
	data: function() {
    	return {
      		frequencies: []
    	};
  	},
  	events: {
  	 	listenner: 
  	 		function(num){
  	 			var e = "k" + num;
  	 			this.$els[e].click();
  	 			//console.log(e)
  	 		}
  	 	},	
	methods: {
  		play: function (note){
			//console.log("note: " + note + " octave: " + octave + " sustain: " + sustain );
			
			var octave = this.octave;
	 		var sustain = Number(this.sustain);
	 		var colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			var oscillator = context.createOscillator();
			var gainNode = context.createGain();
			var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, 0.1);
	 		var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
	 		var currentDiv = event.currentTarget;
	 					
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = 'sine';
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime + .05);

	 		//change background color for durarion of note length
			currentDiv.style.backgroundColor = colorChanger;
			setTimeout(function () {
	    		currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
	 		}, 1000 * sustain);  
		}
	}
});

Vue.component('bkeyboard', {
	template: '#bkeyboard-template',
	props: ['chord', 'octave', 'sustain'],
	data: function() {
    	return {
      		chords: {}
    	};
  	},
  	events: {
  	 	listennerb: 
  	 		function(num){
  	 			for (var i = 0; i < num.length; i++) {
  	 				
  	 				var e = "kb" + num[i];
  	 				this.$els[e].click();
  	 				console.log(e)
  	 			}
  	 		}
  	 	},	
	methods: {
  		play: function (note){
			//console.log("note: " + note + " octave: " + octave + " sustain: " + sustain );
			
			var octave = this.octave;
	 		var sustain = Number(this.sustain);
	 		var colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			var oscillator = context.createOscillator();
			var gainNode = context.createGain();
			var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, 0.1);
	 		var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
	 		var currentDiv = event.currentTarget;
	 					
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = 'sine';
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime + .05);

	 		//change background color for durarion of note length
			currentDiv.style.backgroundColor = colorChanger;
			setTimeout(function () {
	    		currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
	 		}, 1000 * sustain);  
		}
	}
});

var vm = new Vue({
	el: '#app',
	methods: {
		sendnote: function(){
			var stringnote = this.stringnote
			var chords = this.chords
			var chPlay = stringnote.match(/([a-g]+#)|([A-G]+#)|[A-G]|[a-g]/g)
			var nPlay = stringnote.match(/\b(0?[1-9]|1[0-9]|2[0-5])\b/g)
			console.log(chPlay)
			console.log(nPlay)
			console.log(chords[chPlay])
			
			vm.$broadcast('listennerb', chords[chPlay])
			vm.$broadcast('listenner', nPlay)
			
		}
	},
	data: {
		stringnote: '',
		chords: {
			'C':  [1,5,8],
			'c':  [1,4,8],
			'C#': [2,6,9],
			'c#': [2,5,9],
			'D':  [3,7,10],
			'd':  [3,6,10],
			'D#': [4,8,11],
			'd#': [4,7,11],
			'E':  [5,9,12],
			'e':  [5,8,12],
			'F':  [6,10,13],
			'f':  [6,9,13],
			'F#': [7,11,14],
			'f#': [7,10,14],
			'G':  [8,12,15],
			'g':  [8,11,15],
			'G#': [9,13,16],
			'g#': [9,12,16],
			'A':  [10,14,17],
			'a':  [10,13,17],
			'A#': [11,15,18],
			'a#': [11,14,18],
			'B':  [12,16,19],
			'b':  [12,15,19],
		}
	}
});

/*//start new audio session. Do this only once
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

//var bus = new Vue();

Vue.component('keyboard', {
	template: '#keyboard-template',
	props: ['frequency', 'octave', 'sustain'],
	data: function() {
    	return {
      		frequencies: []
    	};
  	},
  	events: {
  	 	//listenner: //function(msg){
  	 		//this.note = stringnote;
  	 		//console.log(msg);
  			//bus.$on('test', function(msg) {

  				//console.log(msg)})
  				//var a = bus.$els.k1;
  				//a.dispatchEvent(event);
  				
  			//}.bind(this))
	  		
	  		/*this.play(Math.pow(1.059463, note) * 130.81);
			playNoteOnChild: function(note) {
	  		var vEl = "k" + note;
	  		console.log(vEl);
	  		var currentDiv = "this.$els." + vEl;
		    console.log(currentDiv);
		    //change background color for durarion of note length
		    var sustain = parseInt(this.sustain);
		  	var colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);//this.color;
			currentDiv.style.backgroundColor = colorChanger;
			setTimeout(function () {
		  		currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
		 	}, 1000 * sustain);
  		
  	},
	methods: {
	
	
  	 	//listenner: //function(msg){
  	 		//this.note = stringnote;
  	 		//console.log(msg);
  		//	bus.$on('play', function(msg) {
			//	play(220);
  				//console.log(msg)}),
  		play: function (ev, note){
			//console.log("note: " + note + " octave: " + octave + " sustain: " + sustain );
			
			var octave = this.octave;
	 		var sustain = Number(this.sustain);
	 		var colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			var oscillator = context.createOscillator();
			var gainNode = context.createGain();
			var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, 0.1);
	 		var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);			
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = 'sine';
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime + .05);

	 		//references current element to change its color
	 		var currentDiv = event.currentTarget;
	 		//change background color for durarion of note length
			currentDiv.style.backgroundColor = colorChanger;
			setTimeout(function () {
	    		currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
	 		}, 1000 * sustain);  
		}
		
	}
});

Vue.component('musplayer', {
	template: '#musplayer-template',
	props: ['stringnote'],
	//data: {		
		//function() {
			//return stringnote;
		//}
	//},
	methods: { 
		sendnote: function() {
			var stringnote = this.stringnote;
			vm.play();
			//bus.$emit('play', stringnote)
			//console.log(stringnote)
			
		} 
	}		
});

var vm = new Vue({
	el: '#app',
	methods: {
		
	    //playString: function(ev, note) {
	    	//play(ev, note);}
		/*playString: function () {
			var stringnote = this.stringnote;
			var noteArr = [];
			var interval = Math.random() * 1000;

			for (var i = 0; i < stringnote.length; i++) {
				noteArr.push(stringnote.charCodeAt(i)%15+1);
			} 

			playAllNotes(0);	
			
			function playAllNotes(index) {
				var note = noteArr[index];
				if (noteArr.length > index) {
					setTimeout(function() {
					    vm.$broadcast('playNoteOnChild', note);
					  		console.log(note);
					    playAllNotes(++index);
					}, Math.random() * 1000);
				}
			}
		}
	},
	data: {
		stringnote: '',
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
		 ]	//f3 = 440 * (1.059463..)3 = 523.3 Hz | f -9 = 440 * (1.059463..)-9 = 261.6 Hz 
	}
});*/