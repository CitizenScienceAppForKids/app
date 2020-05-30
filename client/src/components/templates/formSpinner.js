// Outline from https://github.com/Lemoncode/react-promise-tracker
import React, { Component } from 'react'
import { usePromiseTracker } from "react-promise-tracker"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

export const LoadingSpinnerComponent = (props) => {
const { promiseInProgress } = usePromiseTracker()

  return (
    <div style={{zIndex: '2', position: 'fixed', top: '50%', left: '50%'}} >
    {
      (promiseInProgress === true) ?
        <Loader
         type="Puff"
         color="#00BFFF"
         height={100}
         width={100}
         timeout={3000} //3 secs
        />
      :
        null
    }
  </div>
  )
}