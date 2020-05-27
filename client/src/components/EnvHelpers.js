export function envEndpointOrigin(baseEndpoint) {
    const endpoint = (process.env.REACT_APP_DEV_BUILD === "true") ?
        "http://localhost:5000/" + baseEndpoint :
        "https://cab-cs467.net:443/"  + baseEndpoint
    
    const origin   = (process.env.REACT_APP_DEV_BUILD === "true") ?
        "localhost" :
        "cab-cs467.net"

    return [endpoint, origin]
}

export function envImgSrc(baseSrc) {
    const src = (process.env.REACT_APP_DEV_BUILD === "true") ?
        "http://localhost:8000/" + baseSrc :
        "https://cab-cs467.net:443/"  + baseSrc

    return src
}
