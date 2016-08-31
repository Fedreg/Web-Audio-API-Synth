//start new audio session. Do this only once
const context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)
//compressor evens out min/max volume
const compressor = context.createDynamicsCompressor();
compressor.threshold.value = -54;
compressor.knee.value = 40;
compressor.ratio.value = 50;
compressor.reduction = -40;
compressor.attack.value = -60;
compressor.release.value = 5.25;
compressor.connect(context.destination);

Vue.component('keyboard', {
	template: '#keyboard-template',
	props: ['chord', 'octave', 'sustain' , 'wave'],
	data: function() {
    	return {
      		chords: {}
    	};
  	},
  	events: {
  	 	listenner: 
  	 		function(num){ // for notes
  	 			if (num != null) {
  	  	 			var e = "k" + num;var f = (Number(num) + 12);
  		 			var g = "k" + f
  	 				this.$els[e].click();
  	 			
  	 				if (f < 26) {
  	 					this.$els[g].click();
  	 					console.log(f + " clicked")
  	 				}
  	 			}	
  	 		},
  	 	listenner2: //for chords
  	 		function(num){
  	 			if(num != null) {
  	 				for (var i = 0; i < 3; i++) {
  	 					var e = "k" + num[i];
  	 					this.$els[e].click();
  	 				}
  	 			}
  	 		}
  	 	},	
	methods: {
  		play: function (note){			
			var octave = this.octave;
	 		var sustain = Number(this.sustain);
	 		var wave = this.wave;
	 		const colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			const oscillator = context.createOscillator();
			const gainNode = context.createGain();
			const quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, .1);
	 		const quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
	 		var currentDiv = event.currentTarget;
	 		
	 		gainNode;			
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = 'square';
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime);
		 	oscillator.stop(context.currentTime + sustain + .05);

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
  	 		function(num){ // for notes
  	 			if (num != null) {
  	  	 			var e = "kb" + num;var f = (Number(num) + 12);
  		 			var g = "kb" + f
  	 				this.$els[e].click();
  	 			
  	 				if (f < 26) {
  	 					this.$els[g].click();
  	 					console.log(f + " clicked")
  	 				}
  	 			}	
  	 		},
  	 	listennerb2: //for chords
  	 		function(num){
  	 			if(num != null) {
  	 				for (var i = 0; i < 3; i++) {
  	 					var e = "kb" + num[i];
  	 					this.$els[e].click();
  	 				}
  	 			}
  	 		}
  	 	},	
	methods: {
  		play: function (note){			
			var octave = this.octave;
	 		var sustain = Number(this.sustain);
	 		const colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			const oscillator = context.createOscillator();
			const gainNode = context.createGain();
			const quickFadeIn = gainNode.gain.setTargetAtTime(.4, context.currentTime, .1);
	 		const quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);	
	 		var currentDiv = event.currentTarget;
	 					
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = 'square';
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime);
		 	oscillator.stop(context.currentTime + sustain + .05);
		 	
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
			var stringnoteb = this.stringnoteb
			const chords = this.chords
			var musicToPlay = stringnote.split(' ')
			var musicToPlay2 = stringnoteb.split(' ')		
			var tempo = 100			
			var mp1 = this.$els.mp1
			var mp2 = this.$els.mp2
			playAllNotes(0);
			playAllNotesb(0);
						
			function playAllNotes(index) {
				if (musicToPlay.length > index) {	
					mp1.style.opacity = '0'
					mp2.style.opacity = '0'
	
					setTimeout(function() {
					
						if (/\b([a-g]+#)|([A-G]+#)|[A-G]|[a-g]\b/g.test(musicToPlay[index])) {
							vm.$broadcast('listenner2', chords[musicToPlay[index]])
							playAllNotes(++index);
						}	
							
						else if (/\b(0?[1-9]|1[0-9]|2[0-5])\b/g.test(musicToPlay[index])) {
							vm.$broadcast('listenner', musicToPlay[index])
							playAllNotes(++index);
						}
						
						else
						playAllNotes(++index);

					}, tempo); 
				} 
				
				else {
					setTimeout(function() {
						mp1.style.opacity = '100'
						mp2.style.opacity = '100'
					}, tempo + 1000)
		
				}
			}
			
			function playAllNotesb(index) {
				if (musicToPlay2.length > index) {
					mp1.style.opacity = '0'
					mp2.style.opacity = '0'
	
					setTimeout(function() {
					
												
						if (/([a-g]+#)|([A-G]+#)|[A-G]|[a-g]/g.test(musicToPlay2[index])) {
							vm.$broadcast('listennerb2', chords[musicToPlay2[index]])
							playAllNotesb(++index);
						}	
							
						else if (/\b(0?[1-9]|1[0-9]|2[0-5])\b/g.test(musicToPlay2[index])) {
							vm.$broadcast('listennerb', musicToPlay2[index])
							playAllNotesb(++index);
						}    
						
						else
						playAllNotesb(++index);

					}, tempo); 
				}
				
				else {
					setTimeout(function() {
						mp1.style.opacity = '100'
						mp2.style.opacity = '100'
					}, tempo + 1000)
				}
			}
		} 
	},
	data: {
		stringnoteb: '',
		stringnote: '',
		chords: {
			'C':  [1,17,20],
			'c':  [1,16,20],
			'C#': [2,18,21],
			'c#': [2,17,21],
			'D':  [3,19,22],
			'd':  [3,18,22],
			'D#': [4,20,23],
			'd#': [4,19,23],
			'E':  [5,21,24],
			'e':  [5,20,24],
			'F':  [6,22,25],
			'f':  [6,21,25],
			'F#': [7,23,14],
			'f#': [7,22,14],
			'G':  [8,24,15],
			'g':  [8,23,15],
			'G#': [9,25,16],
			'g#': [9,24,16],
			'A':  [10,14,5],
			'a':  [10,13,5],
			'A#': [11,15,6],
			'a#': [11,14,6],
			'B':  [12,16,7],
			'b':  [12,15,7],
		}
	}
});

