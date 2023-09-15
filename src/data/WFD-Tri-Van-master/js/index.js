(function () {
  function WFD() {
    var vm = this;
    var sentences = [],
    sentences100 = window.dataSource100,
    sentences54 = window.dataSource54,
    sentences3rdJuly = window.dataSourcewfd3rdJuly,
	sentencesrs3rdJul = window.dataSourcers3rdJul,
	SPEED = 1.1;
    var g_currentItem = 1;
    var synthesisVoices;

    function getSentenceAt(i) {
      var sentence = sentences[i];
      var startIndex = 0;
      for (var i = 0; i < sentence.length; i++) {
        var c = sentence.charAt(i);
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
          startIndex = i;
          break;
        }
      }
      return sentence.substring(startIndex, sentence.length);
    }

    function isIgnoreGroupTitle() {
      var el = document.getElementById("chkIgnoreGroupTitle");
      return el.checked;
    }

    function isAlwaysShowAnswer() {
      var el = document.getElementById("chkAlwaysShowAnswer");
      return el.checked;
    }

    function showAnswer() {
      var txt = document.getElementById("txtAnswer");
      var ans = getSentenceAt(g_currentItem);
      ans = ans.charAt(0).toUpperCase() + ans.substr(1) + ".";
      txt.value = ans;
    }

    function onStartPractice() {
      g_currentItem = 1;
      onNext();
    }

    function clearTextField(id) {
      document.getElementById(id).value = "";
    }

    function onSpeakSentence() {
      var sel = document.getElementById("selectSentences");
      var opts = sel.options;

      for (var opt, j = 0; opt = opts[j]; j++) {
        if (opt.disabled == false && parseInt(opt.value) >= g_currentItem) {
          sel.selectedIndex = j;
          sel.onchange();
          if (isAlwaysShowAnswer())
            showAnswer();
          break;
        }
      }
    }

    function onNext() {
      clearTextField("txtAnswer");
      clearTextField("txtInput");
      //g_currentItem++;
      var x = document.getElementById("selectSentences").length;
      g_currentItem = vm.bRandomQuestion ? generateRandomNumber(1, x) : getSequenceNumber();
      onSpeakSentence();
    }

    function generateRandomNumber(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getSequenceNumber() {
      var index = 0;
      var iMaxlength = document.getElementById("selectSentences").length;
      var iIndexselected = document.getElementById("selectSentences").selectedIndex;
	  index = vm.bReverseQuestion ? --iIndexselected : ++iIndexselected;
      // index = ++iIndexselected;
      if (index >= iMaxlength || index < 0) {
        return 0;
      }
      return index;
    }
	
	function intersect_arrays (x, y) {
		return x.filter(value => -1 !== y.indexOf(value));
	}

    function getIncorrectWords(_ansWords, _inputWords){
		var i = 0;
		var arrIncorrect = [];
		for (i; i < _ansWords.length; i++) {
			if(_ansWords[i] !== _inputWords[i]) {
				arrIncorrect.push(_ansWords[i]);
			}
		}
		return arrIncorrect;
	}

    function countIncorrect() {
      var ans = document.getElementById("txtAnswer").value;
      var input = document.getElementById("txtInput").value;
      var ansWords = ans.split(" ");
      var inputWords = input.split(" ");

      ansWords = ansWords.filter(function (n) {
        return n != ""
      });
      inputWords = inputWords.filter(function (n) {
        return n != ""
      });

      var u = _.intersection(inputWords, ansWords);
	  var count = ansWords.length - u.length;
	  var arrIncorrect = getIncorrectWords(ansWords, inputWords);
	  document.getElementById("divCount").innerHTML = "Incorrect : <strong style='color: green'>" + count.toString() + "</strong>. <u>Incorrect words:</u> <strong style='color: red;'>" + arrIncorrect + "</strong>";	  
    }

    function getSynthesisVoices() {
      var voicelist = window.speechSynthesis.getVoices();
      return voicelist;
    }

    function removeOptions(selectbox) {
      var i;
      for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
      }
    }

    function loadSynthesisVoices(id) {
      var items = synthesisVoices;
      var select = document.getElementById(id);
      if (items.length > 0)
        removeOptions(select);
      for (var i = 0; i < items.length; ++i) {
        var option = document.createElement("option");
        option.innerText = items[i].name;
        option.value = items[i].name;
        select.add(option);
      }
      return select;
    }

    function populateVoiceList() {
      loadSynthesisVoices("selectVoices");
    }

    function playSynthesisVoices(text) {
      var utterThis = new SpeechSynthesisUtterance(text);
      var select = document.getElementById("selectVoices");
      var selectedOption = select[0].value;
      for (i = 0; i < synthesisVoices.length; i++) {
        if (synthesisVoices[i].name === selectedOption) {
          utterThis.voice = synthesisVoices[i];
        }
      }
      window.speechSynthesis.speak(utterThis);
    }

    function supportsAudioType(type) {

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

    function playAudio(i) {
      var text = getSentenceAt(i);
      var sel = document.getElementById("selectVoices");
      var voice = sel.options[sel.selectedIndex].value;
      try {
        if (!supportsAudioType('mp3'))
          playSynthesisVoices(text);
        else
          responsiveVoice.speak(text, voice, {rate: SPEED});
      } catch (err) {
        try {
          responsiveVoice.speak(text);
        } catch (err) {
          playSynthesisVoices(text);
        }
      }
    }

    function initializeSelectIndex(id, items) {
      var select = document.getElementById(id);
      removeOptions(select);
      for (var i = 0; i < items.length; ++i) {
        var option = document.createElement("option");
        option.innerText = i.toString();
        option.value = i.toString();
        if (getSentenceAt(i).startsWith("GROUP  ") && isIgnoreGroupTitle())
          option.disabled = true;
        select.add(option);
      }
      return select;
    }

    function initializeSelect(id, items) {
      var select = document.getElementById(id);
      for (var i = 0; i < items.length; ++i) {
        var option = document.createElement("option");
        option.innerText = items[i].name;
        option.value = items[i].name;
        select.add(option);
      }
      return select;
    }

    function loadSentences() {
      return initializeSelectIndex("selectSentences", sentences);
    }
	
	function loadSlider() {
		var values = [0.9, 1, 1.1, 1.15, 1.2, 1.3];
		$('#slider').change(function() {
			$('#sliderValue').text(values[this.value]);
			SPEED = values[this.value];
		});
	}

    function loadFunc() {
	  loadSlider();
      var oSelectSource = document.getElementById("selectSource");
      var sValue = oSelectSource.value;
	  switch (sValue) {
		case 'content50':
			entences = sentences54.sentences54;
			changeTitlePage(sentences54.pageTitle);
			break;
		case 'content100':
			sentences = sentences54.sentences54;
			changeTitlePage(sentences54.pageTitle);
			break;
		case 'content3rdJul':
			sentences = sentences3rdJuly.sentenceswfd3rdJuly;
			changeTitlePage(sentences3rdJuly.pageTitle);
			break;
		case 'contentrs3rdJul':
			sentences = dataSourcers3rdJul.sentencesrs3rdJul;
			changeTitlePage(sentencesrs3rdJul.pageTitle);
			break;
		default:
		return;
	  }    
      var select = loadSentences();
      select.onchange = function () {
        var index = parseInt(select.value);
        g_currentItem = index;
        playAudio(index);
        return false;
      };

      // get voices list
      var voicelist = responsiveVoice.getVoices();
      var selectVoices = initializeSelect("selectVoices", voicelist);
      synthesisVoices = getSynthesisVoices();
      if (!supportsAudioType('mp3')) {
        populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = populateVoiceList;
        }
      }
    }

    function setRandomQuestion() {
      vm.bRandomQuestion = document.getElementById("chkRandomQuestion").checked;
    }
	
	function reverse() {
      vm.bReverseQuestion = document.getElementById("chkReverseQuestion").checked;
    }

    function changeTitlePage(_pageTitle) {
      var oPageTitle = document.getElementById("pageTitle");
      oPageTitle.innerText = _pageTitle;
    }
	
	function clearField() {
		/* document.getElementById("divDiff").innerHTML = ""; */
		document.getElementById("divCount").innerHTML = "";
	}

    var oBody = document.getElementById("mainLoad");
    oBody.addEventListener("onload", loadFunc());

    var oBtnPlay = document.getElementById("btnPlay");
    oBtnPlay.addEventListener("click", function () {
      clearField();
	  onNext();
    });

    var oBtnRepeat = document.getElementById("btnRepeat");
    oBtnRepeat.addEventListener("click", function () {
      clearField();
	  onSpeakSentence();
    });

    var oBtnRepeat = document.getElementById("btnShowAnswer");
    oBtnRepeat.addEventListener("click", function () {
      showAnswer();
    });

    var oBtnRepeat = document.getElementById("btnCountIncorrect");
    oBtnRepeat.addEventListener("click", function () {
      countIncorrect();
    });

    var oBtnRepeat = document.getElementById("chkIgnoreGroupTitle");
    oBtnRepeat.addEventListener("click", function () {
      isIgnoreGroupTitle();
    });

    var oBtnRandom = document.getElementById("chkRandomQuestion");
    oBtnRandom.addEventListener("click", function () {
      setRandomQuestion();
    });

    var oSelectSource = document.getElementById("selectSource");
    oSelectSource.addEventListener("change", function () {
      loadFunc();
    });
	
	var oBtnReverse = document.getElementById("chkReverseQuestion");
    oBtnReverse.addEventListener("change", function () {
      reverse();
    });
	
  }
  WFD();
})();