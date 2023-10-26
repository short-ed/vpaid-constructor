# ГЕнерация vpaid.js

1. Нужно сгенерировать информацию по слайдам

Ожидаемый результат:

```javascript
const creativeConstructorData = {
  textOnButton: 'Смотреть',
  textOnLink: 'Смотреть',
  fields: [
    'image',
    'title',
    'button'
  ]
  slides: [
    {
      img: 'assets/1.jpg',
      title: 'Чебурашка',
      url: 'https://ad.datadrivenpromotion.com/creative/click?cnd=cHI9MzY1JmNhPTE0MTYmY3I9NjUyNSZ1cj05MTEx&erid=',
    },
    {
      img: 'assets/3.jpg',
      title: 'Хвостатые пришельцы',
      url: 'https://ad.datadrivenpromotion.com/creative/click?cnd=cHI9MzY1JmNhPTE0MTYmY3I9NjUyNyZ1cj05MTEz&erid=',
    },
    {
      img: 'assets/2.jpg',
      title: 'Белль и Себастьян: Новое поколение',
      url: 'https://ad.datadrivenpromotion.com/creative/click?cnd=cHI9MzY1JmNhPTE0MTYmY3I9NjUyOCZ1cj05MTE0&erid=',

    },
    {
      img: 'assets/4.jpg',
      title: 'Везунчик',
      url: 'https://ad.datadrivenpromotion.com/creative/click?cnd=cHI9MzY1JmNhPTE0MTYmY3I9NjUyOSZ1cj05MTE1&erid=',
    },
  ],
}
```

```javascript
const creativeConstructorData = {
  // сгенерированный creativeConstructorData
}

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

VpaidVideoPlayer.prototype.createCarousel = function(slides) {

  const carousel = createElement('div', 'avc-carousel')
  const carouselInner = createElement('div', 'avc-carousel-inner')

  slides.forEach((slide, index) => {
    const isLink = 'url' in slide
    const carouselItem = createElement(isLink ? 'a' : 'div', 'avc-carousel-item')
    if (isLink) {
      carouselItem.href = slide.url
      carouselItem.target = '_blank'
    }
    const img = createElement('img', 'avc-carousel-item-img')
    img.src = this.fileLocation + slide.img
    carouselItem.appendChild(img)
    if ('title' in slide) {
      const title = createElement('div', 'avc-carousel-item-title')
      title.innerText = slide.title
      carouselItem.appendChild(title)
    }
    if ('url' in slide) {
      const url = createElement('div', 'avc-carousel-item-link')
      url.innerText = 'Смотреть'
      carouselItem.appendChild(url)
    }

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

  const carousel = this.createCarousel(creativeConstructorData.slides)

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

  style.textContent = `

  `

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
```

```css
    .avc-overlay {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000000
    }
  
    .avc-overlay .avc-carousel {
      position: absolute;
      z-index: 2;
      left: 0;
      right: 0;
      bottom: 0;
      transform: translateY(100%);
      transition: all 0.35s ease;
    }
    
    .avc-overlay:hover .avc-carousel {
      transform: translateY(0);
    }
    
    .avc-overlay .avc-carousel:after {
      content: '';
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      bottom: 0;
      top: 20px;
      backdrop-filter: blur(10px);
      border-top: 1px solid #ffffff25;
      transition: all 0.35s ease 0.2s;
      transform: translateY(50%);
    }
    
    .avc-overlay:hover .avc-carousel:after {
      transform: translateY(0);
    }
    
    .avc-overlay .avc-carousel-inner {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 1em;  
      padding: 12px;
    }
   
    
    .avc-overlay .avc-carousel-item {
      position: relative;
      transition: all 0.35s ease;
      text-decoration: none;
    }
    
    .avc-overlay .avc-carousel-item {
        display: flex;
        flex-direction: column;
        overflow: hidden; 
        grid-row: span 2;
        padding: 0;
        margin: 0 !important;
    }
    
    .avc-overlay .avc-carousel-item:hover {
      transform: translateY(calc(var(--description-height)* -1));
    }
    
    .avc-overlay .avc-carousel-item-img {
      max-width: 100%;
      border-radius: 4px;
      overflow: hidden;

    }
    
    .avc-overlay .avc-carousel-item-title {
      text-align: center;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      padding: 8px 0;
      transition: all 0.35s ease 0.1s;
    }
    
    .avc-overlay .avc-carousel-item-description {
      text-align: center;
      color: white;
      font-size: 12px;
      padding: 8px 0;
      min-height: 28px;
      opacity: 0;
      
      transition: all 0.35s ease 0.1s;
      
    }
    
    .avc-overlay .avc-carousel-item:hover .avc-carousel-item-description {
      opacity: 1;
                  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 1));

    }
    
    .avc-overlay .avc-carousel-item-link {
      text-align: center;
      color: white;
      font-size: 12px;
      padding: 6px 0;
      
      border-radius: 4px;

      line-height: 1;
      transition: all 0.35s ease;
      background-color: #bdaaaa2d;
      border: 1px solid #ffffff25;
      backdrop-filter: blur(6px);
      text-decoration: none;
    }
    
    .avc-carousel-button-play {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 3;
      
      display: block;
      width: 24px;
      height: 24px;
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='white' d='M8 5v14l11-7z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 24px 24px;
      background-position: center; 
      border: none;
      outline: none;
      cursor: pointer;
    }
    
    .avc-carousel-button-play.active {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='white' d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/%3E%3C/svg%3E");
    }
    
    .avc-carousel-button-mute {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 3;
      
      display: block;
      width: 24px;
      height: 24px;
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='white' d='M7 9v6h4l5 5V4L11 9H7z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 24px 24px;
      background-position: center; 
      border: none;
      outline: none;
      cursor: pointer;
    }
    
    .avc-carousel-button-mute.active {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='white' d='M7 9v6h4l5 5V4L11 9H7z'/%3E%3C/svg%3E");
    }
    
    .avc-carousel-button-mute.active:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      
      width: 18px;
      height: 2px;
      background-color: #ffffff;
      border: 1px solid black;
      border-radius: 50%;
    }
```
