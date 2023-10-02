import React, { useState } from 'react'
import { GoogleMap,Marker,useLoadScript } from '@react-google-maps/api'
import '../assets/styles/components/mapGoogal.css'

const MapGoogal =({inputs,OnLocationChange}) => {

     //define default coords
     const [coords, setCoords] = useState({ lat:parseFloat(6.927079) , lng: parseFloat(79.861244) });

     const [zoom, setZoom] = useState(8);
     const [mapMarker, setMapMarker] = useState(false);

     //load gopgel map API
    const {isLoaded}=useLoadScript({
        googleMapsApiKey:"AIzaSyAXqrbE_WqGgouE09hnobUk3L-8h3OrmqY",
    })

    function handleZoomChanged() {
        setZoom(this.getZoom());

         //this refers to Google Map instance
        let newLocation = this.getCenter();
        setCoords({ lat: newLocation.lat(), lng: newLocation.lng() });
      }
  
      if (!isLoaded) return <div>Loading...</div>;

      return (
 
        <div>
            {/* check googel map is loaded or not */}
             {isLoaded&&(
            <GoogleMap
                center={coords}
                zoom={zoom}
                mapContainerClassName="map-container"
                margin={[50, 50, 50, 50]}
                options={{ zoomControl: true}}
                onZoomChanged={handleZoomChanged}
                onClick={(e)=>{
                    setMapMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                    OnLocationChange({
                        ...inputs,
                        location: {
                            "latitude": e.latLng.lat(),
                            "longitude":  e.latLng.lng()
                        }
                      })
                }}
            >
                {mapMarker && (
                     <Marker    
                     position={mapMarker}
                   />
                )}
            </GoogleMap>
        )}  
        </div>
      )
}

export default MapGoogal