import React, { createContext, useContext } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

//  Code taken from component documentation at:
//  https://www.npmjs.com/package/react-html5-camera-photo
//
//  Credit this site for significant portions of this code


function Cam (props) {

  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    // console.log('takePhoto');
    if (!window.localStorage.images){
      window.localStorage.setItem("images", JSON.stringify([]));
    }
    var temp = JSON.parse(window.localStorage.images)
    temp.push(dataUri)
    window.localStorage.setItem("images", JSON.stringify(temp))
    console.log(window.localStorage.images)
  }
 
  function handleTakePhotoAnimationDone (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }
 
  function handleCameraError (error) {
    console.log('handleCameraError', error);
  }
 
  function handleCameraStop (stream) {
    console.log('handleCameraStop');
    console.log(stream);
  }

  function handleCameraStart (stream) {
    console.log('handleCameraStart');
  }
 
  
  return (
    <Camera
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
      onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
      onCameraError = { (error) => { handleCameraError(error); } }
      idealFacingMode = {FACING_MODES.ENVIRONMENT}
      idealResolution = {{width: 640, height: 480}}
      imageType = {IMAGE_TYPES.JPG}
      imageCompression = {0.97}
      isMaxResolution = {true}
      isImageMirror = {false}
      isSilentMode = {false}
      isDisplayStartCameraError = {true}
      isFullscreen = {false}
      sizeFactor = {1}
      onCameraStart = { (stream) => { handleCameraStart(stream); } }
      onCameraStop = { (stream) => { handleCameraStop(stream); } }
    />
  );
}
 
export default Cam;