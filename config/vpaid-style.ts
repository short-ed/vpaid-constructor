export const vpaidStyleConfig = `
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
  top: 0;
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
  font-weight: bold;
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

.avc-overlay .avc-carousel-item-button {
  text-align: center;
  color: white;
  font-size: 12px;
  padding: 6px 0;
  margin: 6px 0;
  
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
}`