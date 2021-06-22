import React, { Component } from "react";
import { render } from "react-dom";
/* import { GoogleMap, withScriptjs, withGoogleMap} from "react-google-maps"; */


export default class App extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return <h1>Testing react code</h1>;
    }
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
/* 
function Map(){
    return 
    (<Googlemap defaultZoom ={10} defaultCenter ={{ lat:53.349804, lng: -6.260310 }}
         /> 
        ); 
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function App(){
    return (
        <div style= {{ width: "100vw", height: "100vh" }}>
            <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places`} 
            loadingElement={<div style={{height: "100%"}} />}
            containerElement={<div style={{height: "100%"}} />}
            mapElement={<div style={{height: "100%"}} />}
            />
        </div>
    )
} */