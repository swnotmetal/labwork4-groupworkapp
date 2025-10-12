import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
    targetLocation: [number, number] | null
    zoom: number
}

const MapController = ({ targetLocation, zoom}: MapControllerProps)=> {
    const map = useMap()

    useEffect(() => {
        if(targetLocation) {
            map.flyTo(targetLocation, zoom)
        }
    }, [targetLocation,zoom, map])

    return null //nothing is rendered
}

export default MapController
