import { vpaidStyleConfig } from "./vpaid-style";

export const vpaidJS = `
const VpaidVideoPlayer = function () {
  this.slot_ = null
  this.videoSlot_ = null
  this.eventsCallbacks_ = {}
  this.attributes_ = {
    'companions': '',
    'desiredBitrate': 256,
    'duration': 30,
    'expanded': false,
    'height': 0,
    'icons': '',
    'linear': true,
    'remainingTime': 10,
    'skippableState': false,
    'viewMode': 'normal',
    'width': 0,
    'volume': 1.0,
  }

  this.quartileEvents_ = [
    {event: 'AdVideoStart', value: 0},
    {event: 'AdVideoFirstQuartile', value: 25},
    {event: 'AdVideoMidpoint', value: 50},
    {event: 'AdVideoThirdQuartile', value: 75},
    {event: 'AdVideoComplete', value: 100},
  ]

  this.lastQuartileIndex_ = 0
  this.parameters_ = {}
  this.fileLocation = ''
  this.slideBeClicked = false
}

VpaidVideoPlayer.prototype.initAd = function (
  width,
  height,
  viewMode,
  desiredBitrate,
  creativeData,
  environmentVars) {
  this.attributes_['width'] = width
  this.attributes_['height'] = height
  this.attributes_['viewMode'] = viewMode
  this.attributes_['desiredBitrate'] = desiredBitrate
  this.slot_ = environmentVars.slot
  this.videoSlot_ = environmentVars.videoSlot

  this.parameters_ = JSON.parse(creativeData['AdParameters'])

  if (this.parameters_['fileLocation']) {
    this.fileLocation = this.parameters_['fileLocation'] + '/'
  }

  this.renderSlot_()
  this.updateVideoSlot_()
  this.videoSlot_.addEventListener(
    'timeupdate',
    this.timeUpdateHandler_.bind(this),
    false)
  this.videoSlot_.addEventListener(
    'ended',
    this.stopAd.bind(this),
    false)
  this.callEvent_('AdLoaded')
  this.callEvent_('AdImpression');
}

const createElement = (tag, className) => {
  const element = document.createElement(tag)
  element.classList.add(className)
  return element
}

VpaidVideoPlayer.prototype.createCarousel = function(carouselData) {

  const carousel = createElement('div', 'avc-carousel')
  const carouselInner = createElement('div', 'avc-carousel-inner')

  carouselData.slides.forEach((slide, index) => {
    const isLink = 'url' in slide
    const carouselItem = createElement(isLink ? 'a' : 'div', 'avc-carousel-item')
    if (isLink) {
      carouselItem.href = slide.url
      carouselItem.target = '_blank'
    }
    carouselData.fields.forEach(field => {
      if (field === 'image') {
        const img = createElement('img', 'avc-carousel-item-img')
        img.src = this.fileLocation + slide.img
        carouselItem.appendChild(img)
      } else if (field === 'title') {
        const title = createElement('div', 'avc-carousel-item-title')
        title.innerText = slide.title
        carouselItem.appendChild(title)
      } else if (field === 'button') {
        const button = createElement('div', 'avc-carousel-item-button')
        button.innerText = carouselData.textOnButton
        carouselItem.appendChild(button)
      } else if (field === 'link') {
        const link = createElement('div', 'avc-carousel-item-link')
        link.innerText = carouselData.textOnLink
        carouselItem.appendChild(link)
      } else if (field === 'description') {
        const description = createElement('div', 'avc-carousel-item-description')
        description.innerText = slide.description
        carouselItem.appendChild(description)
      }
    })

    carouselItem.addEventListener('click', (e) => {
      e.stopPropagation()
      if (this.slideBeClicked) return
      this.slideBeClicked = true
      // e.preventDefault()
      console.log(1)
      this.eventsCallbacks_['AdClickThru']('','0', false)
    })
    carouselInner.appendChild(carouselItem)
  })
  carousel.appendChild(carouselInner)
  return carousel
}

VpaidVideoPlayer.prototype.renderSlot_ = function () {
  const overlay = createElement('div', 'avc-overlay')

  overlay.addEventListener('click', this.overlayOnClick_.bind(this))

  const carousel = this.createCarousel(creativeConstructorData)

  // Create button play/pause
  const button =createElement('button', 'avc-carousel-button-play');
  button.textContent = '';
  button.addEventListener('click', (e) => {
    e.stopPropagation()
    if (this.videoSlot_.paused) {
      this.videoSlot_.play();
      button.classList.remove('active');
    } else {
      this.videoSlot_.pause();
      button.classList.add('active');
    }
  }
  );
  overlay.appendChild(button);

  // Button mute
  const buttonMute =createElement('button', 'avc-carousel-button-mute');
  buttonMute.textContent = '';
  buttonMute.addEventListener('click', (e) => {
    e.stopPropagation()
    if (this.videoSlot_.muted) {
      this.videoSlot_.muted = false;
      buttonMute.classList.remove('active');
    } else {
      this.videoSlot_.muted = true;
      buttonMute.classList.add('active');
    }
  });
  if (this.videoSlot_.muted) {
    buttonMute.classList.add('active');
  }
  overlay.appendChild(buttonMute);

  const style = document.createElement('style');

  style.textContent = \`
    ${vpaidStyleConfig}
  \`

  this.slot_.appendChild(style);
  overlay.appendChild(carousel)
  this.slot_.appendChild(overlay)
}

VpaidVideoPlayer.prototype.updateVideoSlot_ = function () {
  if (this.videoSlot_ == null) {
    this.videoSlot_ = document.createElement('video')
    this.slot_.appendChild(this.videoSlot_)
  }
  this.updateVideoPlayerSize_()

  // Добавляем видео в html
  this.videoSlot_.setAttribute('src', this.fileLocation + 'video.mp4')
  this.videoSlot_.style.backgroundColor = 'black';
}

VpaidVideoPlayer.prototype.overlayOnClick_ = function () {
  this.eventsCallbacks_['AdClickThru']('', '0', true)
}

VpaidVideoPlayer.prototype.timeUpdateHandler_ = function () {
  if (this.lastQuartileIndex_ >= this.quartileEvents_.length) {
    return
  }
  var percentPlayed =
    this.videoSlot_.currentTime * 100.0 / this.videoSlot_.duration
  if (percentPlayed >= this.quartileEvents_[this.lastQuartileIndex_].value) {
    var lastQuartileEvent = this.quartileEvents_[this.lastQuartileIndex_].event
    this.eventsCallbacks_[lastQuartileEvent]()
    this.lastQuartileIndex_ += 1
  }
}

VpaidVideoPlayer.prototype.updateVideoPlayerSize_ = function () {
  this.videoSlot_.setAttribute('width', this.attributes_['width'])
  this.videoSlot_.setAttribute('height', this.attributes_['height'])
}

VpaidVideoPlayer.prototype.handshakeVersion = function (version) {
  return ('2.0')
}

VpaidVideoPlayer.prototype.startAd = function () {
  this.videoSlot_.play()
  this.callEvent_('AdStarted')
}

VpaidVideoPlayer.prototype.stopAd = function () {
  this.log('Stopping ad')
  var callback = this.callEvent_.bind(this)
  setTimeout(callback, 75, ['AdStopped'])
}

VpaidVideoPlayer.prototype.setAdVolume = function (value) {
  this.attributes_['volume'] = value
  this.log('setAdVolume ' + value)
  this.callEvent_('AdVolumeChange')
}

VpaidVideoPlayer.prototype.getAdVolume = function () {
  this.log('getAdVolume')
  return this.attributes_['volume']
}

VpaidVideoPlayer.prototype.resizeAd = function (width, height, viewMode) {
  this.log('resizeAd ' + width + 'x' + height + ' ' + viewMode)
  this.attributes_['width'] = width
  this.attributes_['height'] = height
  this.attributes_['viewMode'] = viewMode
  this.updateVideoPlayerSize_()
  this.callEvent_('AdSizeChange')
}

VpaidVideoPlayer.prototype.pauseAd = function () {
  this.log('pauseAd')
  this.videoSlot_.pause()
  this.callEvent_('AdPaused')
}

VpaidVideoPlayer.prototype.resumeAd = function () {
  this.log('resumeAd')
  this.videoSlot_.play()
  this.callEvent_('AdResumed')
}

VpaidVideoPlayer.prototype.expandAd = function () {
  this.log('expandAd')
  this.attributes_['expanded'] = true
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  }
  this.callEvent_('AdExpanded')
}

VpaidVideoPlayer.prototype.getAdExpanded = function () {
  this.log('getAdExpanded')
  return this.attributes_['expanded']
}

VpaidVideoPlayer.prototype.getAdSkippableState = function () {
  this.log('getAdSkippableState')
  return this.attributes_['skippableState']
}

VpaidVideoPlayer.prototype.collapseAd = function () {
  this.log('collapseAd')
  this.attributes_['expanded'] = false
}

VpaidVideoPlayer.prototype.skipAd = function () {
  this.log('skipAd')
  var skippableState = this.attributes_['skippableState']
  if (skippableState) {
    this.callEvent_('AdSkipped')
  }
}

VpaidVideoPlayer.prototype.subscribe = function (
  aCallback,
  eventName,
  aContext) {
  this.log('Subscribe ' + aCallback)
  var callBack = aCallback.bind(aContext)
  this.eventsCallbacks_[eventName] = callBack
}

VpaidVideoPlayer.prototype.unsubscribe = function (eventName) {
  this.log('unsubscribe ' + eventName)
  this.eventsCallbacks_[eventName] = null
}

VpaidVideoPlayer.prototype.getAdWidth = function () {
  return this.attributes_['width']
}
VpaidVideoPlayer.prototype.getAdHeight = function () {
  return this.attributes_['height']
}
VpaidVideoPlayer.prototype.getAdRemainingTime = function () {
  return this.attributes_['remainingTime']
}
VpaidVideoPlayer.prototype.getAdDuration = function () {
  return this.attributes_['duration']
}
VpaidVideoPlayer.prototype.getAdCompanions = function () {
  return this.attributes_['companions']
}

VpaidVideoPlayer.prototype.getAdIcons = function () {
  return this.attributes_['icons']
}

VpaidVideoPlayer.prototype.getAdLinear = function () {
  return this.attributes_['linear']
}

VpaidVideoPlayer.prototype.log = function (message) {
  console.log(message)
}

VpaidVideoPlayer.prototype.callEvent_ = function (eventType) {
  if (eventType in this.eventsCallbacks_) {
    this.eventsCallbacks_[eventType]()
  }
}

var getVPAIDAd = function () {
  return new VpaidVideoPlayer()
}
`