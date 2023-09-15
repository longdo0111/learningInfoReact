class VoiceService {
    
    // get voices list
    getVoiceList() {
        let promise = new Promise((resolve, reject) => {
            // let respVoice = responsiveVoice();
            let voicelist =  window.responsiveVoice.getVoices();
            if(voicelist.length > 0){
                resolve(voicelist);
            } else {
                reject("Can not get voice list");
            }
        });
        return promise;
    }

    //validation audio
    supportsAudioType(type) {

        let audio;
        // Allow user to create shortcuts, i.e. just "mp3"
        let formats = {
          mp3: 'audio/mpeg',
          mp4: 'audio/mp4',
          aif: 'audio/x-aiff'
        };
        if (!audio) {
          audio = document.createElement('audio')
        }
  
        if (audio.canPlayType)
          return audio.canPlayType(formats[type] || type);
        return true;
      }

    //get voice
    playSynthesisVoices(text, voice) {
        let utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = voice;
        window.speechSynthesis.speak(utterThis);
      }

    //speak on the sentence
    playAudio(text, voice) {
        try {
          if (!this.supportsAudioType('mp3'))
            this.playSynthesisVoices(text, voice);
          else
            window.responsiveVoice.speak(text, voice, {rate: '1.0'});
        } catch (err) {
          try {
            window.responsiveVoice.speak(text);
          } catch (err) {
            this.playSynthesisVoices(text, voice);
          }
        }
    }
}
export default new VoiceService();