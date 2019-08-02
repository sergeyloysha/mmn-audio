var Player = (function (WaveSurfer) {
  var data = {
    waveform: null,
    player: null,
    audio: {
      source: null,
      percent: null,
      duration: null
    },
    waveFront: null,
    waveBack: null
  }

  var selectors = {
    waveform: '.b-player__waveform',
    player: '.b-player',
    waveBack: '.b-player__wave_back',
    waveFront: '.b-player__wave_front',
    button: '.b-player__control-button',
    handle: '.b-player__handle'
  }

  var classes = {
    buttonPause: 'b-player__control-button_pause'
  }

  var setDefaults = function () {
    data.waveFront.children[0].style.width =
      data.waveBack.children[0].getBoundingClientRect().width + 'px'
    data.waveFront.children[0].style.height =
      data.waveBack.children[0].getBoundingClientRect().height + 'px'
  }

  var isPlaying = function () {
    return (
      data.audio.source.currentTime > 0 &&
      !data.audio.source.paused &&
      !data.audio.source.ended
    )
  }

  var registerNodes = function () {
    data.waveBack = document.querySelector(selectors.waveBack)
    data.waveFront = document.querySelector(selectors.waveFront)
    data.button = document.querySelector(selectors.button)
    data.handle = document.querySelector(selectors.handle)
  }

  var updateProgress = function () {
    data.waveFront.style.width = data.audio.percent + '%'
    data.handle.style.left = data.audio.percent - 0.05 + '%'
    data.waveform.seekTo(data.audio.percent / 100)
  }

  var onResize = function () {
    setDefaults()
  }

  var onClickPlayButton = function () {
    if (isPlaying()) {
      data.button.classList.remove(classes.buttonPause)
      data.audio.source.pause()
    } else {
      data.button.classList.add(classes.buttonPause)
      data.audio.source.play()
    }
  }

  var onPlay = function () {
    data.audio.percent =
      (data.audio.source.currentTime.toString() /
        data.audio.source.duration.toString()) *
      100
    data.audio.duration = data.audio.source.duration.toString()
    updateProgress()
  }

  var getCoords = function (elem) {
    const box = elem.getBoundingClientRect()

    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset
    }
  }

  var onMouseDownHandle = function (e) {
    var handleCoords = getCoords(data.handle)
    var wavesCoords = getCoords(data.waveBack)
    var shiftX = e.pageX - handleCoords.left

    document.onmousemove = function (e) {
      var newLeft = e.pageX - shiftX - wavesCoords.left

      if (newLeft < 0) {
        newLeft = 0
      }

      var rightEdge = data.waveBack.offsetWidth - data.handle.offsetWidth

      if (newLeft > rightEdge) {
        newLeft = rightEdge
      }

      data.audio.source.currentTime =
        (data.audio.duration / 100) * (newLeft / rightEdge) * 100
    }

    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null
    }

    return false
  }

  var regisetEvents = function () {
    window.addEventListener('resize', onResize)
    data.audio.source.addEventListener('timeupdate', onPlay)
    data.button.addEventListener('click', onClickPlayButton)
    data.handle.addEventListener('mousedown', onMouseDownHandle)
    data.handle.addEventListener('dragstart', function () {
      return false
    })
  }

  var init = function () {
    data.audio.source = new Audio('src/audio.mp3')
    data.audio.source.loop = true
    registerNodes()
    regisetEvents()

    data.player = document.querySelector(selectors.player)
    data.player.style.display = 'block'
    setDefaults()

    data.waveform = WaveSurfer.create({
      container: selectors.waveform,
      waveColor: '#F7F7F7',
      progressColor: '#E2E2E2',
      barWidth: 4,
      barHeight: 1, // the height of the wave
      barGap: null,
      responsive: true
    })
    data.waveform.load('src/audio.mp3')

    // onClickPlayButton();
  }

  return {
    init
  }
})(window.WaveSurfer)
