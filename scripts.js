//start new audio session. Do this only once
const context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)
//compressor evens out min/max volume
const compressor = context.createDynamicsCompressor();
compressor.threshold.value = -54;
compressor.knee.value = 40;
compressor.ratio.value = 20;
compressor.reduction = -40;
compressor.attack.value = .5;
compressor.release.value = .5;
compressor.connect(context.destination);

var bus = new Vue()

//play notes when clicked as well as when sent via text input
Vue.component('keyboard', {
	template: '#keyboard-template',
	props: ['octave', 'sustain' , 'wave', 'bpm'],
  created: {
  	 	listenner: function() {
  	 		bus.$on(function(num){ // for notes
  	 			if (num != null) {
  	  	 			var e = "k" + num;
  	  	 			var f = (Number(num) + 12);
  		 				var g = "k" + f
  	 					this.$refs[e].click();
  	 			
  	 					if (f < 26) {
  	 						this.$refs[g].click();
  	 					}
  	 			}	
  	 		})
  	 	},
  	 	listenner2: function() { //for chords
  	 		bus.$on(function(num){
  	 			if(num != null) {
  	 				for (var i = 0; i < 3; i++) {
  	 					var e = "k" + num[i];
  	 					this.$refs[e].click();
  	 				}
  	 			}
  	 		})
  	 	}
  	 },
	methods: {
  		play: function (note){			
			var octave = this.octave;
			var bpm = this.bpm;
			var tempo = bpm/60;
	 		var sustain = Number(this.sustain) * 1/tempo ;
	 		var wave = this.wave;
	 		const colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			const oscillator = context.createOscillator();
			const gainNode = context.createGain();
			const quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, .1);
	 		const quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.05);
	 		var currentDiv = event.currentTarget;
	 		console.log(sustain);
	 		console.log(quickFadeOut);
	 		
	 		gainNode;			
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = wave;
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime);
		 	oscillator.stop(context.currentTime + sustain + .5);

	 		//change background color for durarion of note length
			currentDiv.style.backgroundColor = colorChanger;
			setTimeout(function () {
	    		currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
	    		currentDiv.style.transition = 'all 3s ease-in'
	 		}, 1000 * sustain);  currentDiv.style.transition = 'none'
		}
	}
});

//play notes when clicked as well as when sent via text input
Vue.component('bkeyboard', {
	template: '#bkeyboard-template',
	props: ['octaveb', 'sustainb', 'waveb', 'bpm'],
	created: {
  	 	listennerb: function() {
  	 		bus.$on(function(num){ // for notes
  	 			if (num != null) {
  	  	 			var e = "kb" + num;
  	  	 			var f = (Number(num) + 12);
  		 				var g = "kb" + f
  	 					this.$refs[e].click();
  	 			
  	 					if (f < 26) {
  	 						this.$refs[g].click();
  	 					}
  	 			}	
  	 		})
  	 	},
  	 	listennerb2: function() { //for chords
  	 		bus.$on(function(num){
  	 			if(num != null) {
  	 				for (var i = 0; i < 3; i++) {
  	 					var e = "kb" + num[i];
  	 					this.$refs[e].click();
  	 				}
  	 			}
  	 		})
  	 	}
  	 },
	methods: {
  		play: function (note){			
			var octave = this.octaveb;
			var bpm = this.bpm;
			var tempo = bpm/60;
	 		var sustain = this.sustainb * 1/tempo;
	 		var wave = this.waveb;
	 		const colorChanger = '#'+Math.floor(Math.random()*16777215).toString(16);
			const oscillator = context.createOscillator();
			const gainNode = context.createGain();
			const quickFadeIn = gainNode.gain.setTargetAtTime(.5, context.currentTime, .1);
	 		const quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.05);	
	 		var currentDiv = event.currentTarget;
	 		  	 					console.log(sustain, quickFadeOut)
	 					
			//oscillator wave type (sine, triangle, square, or sawtooth)
		 	oscillator.type = wave;
			//connect signal to audio to gain; gain to compressor (compressor to output)
		 	oscillator.connect(gainNode);
		 	gainNode.connect(compressor); 	
			oscillator.frequency.value = note * octave;
		 	gainNode.gain.value = 0
		 	oscillator.start(context.currentTime);
		 	oscillator.stop(context.currentTime + sustain + .5);
		 	
	 		//change background color for durarion of note length
			currentDiv.style.backgroundColor = colorChanger;
			setTimeout(function () {
	    		currentDiv.style.backgroundColor = 'rgba(0,0,0,0)';
	    		currentDiv.style.transition = 'all 3s ease-in';
	 		}, 1000 * sustain);  currentDiv.style.transition = 'none';
		}
	}
});

//takes text entry and sends notes to play functions
Vue.component('musplayer', {
	template: '#musplayer-template',
	props: ['bpm', 'stringnote', 'stringnoteb'],
	methods: {
		//sends notes from text entry to play function
		sendnote: function(){
			var stringnote = this.stringnote
			var stringnoteb = this.stringnoteb
			const chords = this.chords
			var musicToPlay = stringnote.split(' ')
			var musicToPlay2 = stringnoteb.split(' ')
			var bpm = this.bpm
			var tempo = 60/bpm * 1/2 * 1000//basic rhythm is in 8th notes(1/2 of a quarter note/in ms)
			var mp1 = this.$refs.mp1
			var mp2 = this.$refs.mp2
			
			playAllNotes(0);
						
			function playAllNotes(index) {
				//plays through entire length of either text entry
				if (musicToPlay.length > index || musicToPlay2.length > index) {
					mp1.style.opacity = '0'
					mp2.style.opacity = '0'
	
					setTimeout(function() {
					
						if (/\b([a-g]+#)|([A-G]+#)|[A-G]|[a-g]\b/g.test(musicToPlay[index])) {
							bus.$emit('listenner2', chords[musicToPlay[index]])
						}	
							
						if (/\b(0?[1-9]|1[0-9]|2[0-5])\b/g.test(musicToPlay[index])) {
							bus.$emit('listenner', musicToPlay[index])
						}
						
						if (/([a-g]+#)|([A-G]+#)|[A-G]|[a-g]/g.test(musicToPlay2[index])) {
							bus.$emit('listennerb2', chords[musicToPlay2[index]])
						}	
							
						if (/\b(0?[1-9]|1[0-9]|2[0-5])\b/g.test(musicToPlay2[index])) {
							bus.$emit('listennerb', musicToPlay2[index])
						}    

						if (/\s{1}/g.test(musicToPlay[index]) ||  /\s{1}/g.test(musicToPlay2[index])) 
						playAllNotes(++index);
						
						playAllNotes(++index);

					}, tempo); 
				} 
				
				else {
					setTimeout(function() {
						mp1.style.opacity = '100'
						mp2.style.opacity = '100'
					}, tempo + 1000)
					//playAllNotes(0);
				}  
			} 
		}
	}
});

var vm = new Vue({
		el: '#app',
		data: {
		wave: 'square',
		waveb: 'square',
		octave: '0',
		octaveb: '-1',
		sustain: '.5',
		sustainb: '1',
		bpm: '180',
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
})

