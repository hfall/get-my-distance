import React, { useEffect, useRef, useState, useCallback } from "react";
import icon from "./icons/airport.svg";

let globalMarkers: any[] = [];
let polyline: any = null;

function Map({ coords }: any) {
  const refEl = useRef(null);
  const [map, setMap] = useState<any>();
  const api = (window as any).google;
  const bounds = new api.maps.LatLngBounds();
  const geocoder = new api.maps.Geocoder();
  // let markers: google.maps.Marker[] = [];
  let latCache: any[] = [];
  let lngCache: any[] = [];

  const showGeocodedAddressOnMap = (asDestination: boolean) => {
    // @ts-ignore:next-line
    const handler = ({ results }: google.maps.GeocoderResponse) => {
      map.fitBounds(bounds.extend(results[0].geometry.location));
      // latCache.push(results[0].geometry.location.lat());
      // lngCache.push(results[0].geometry.location.lng());
      globalMarkers.push(
        new api.maps.Marker({
          map,
          position: results[0].geometry.location,
          // label: asDestination ? "B" : "A",
        })
      );
      // console.log(latCache, lngCache);
      return [
        results[0].geometry.location.lat(),
        results[0].geometry.location.lng(),
      ];
    };
    return handler;
  };

  const addFlowline = (latCache: number[], lngCache: number[]) => {
    const Poly = new Array();
    for (let i = 0; i < latCache.length; i++) {
      let pos = new api.maps.LatLng(latCache[i], lngCache[i]);
      Poly.push(pos);
    }
    polyline = new api.maps.Polyline({
      path: Poly,
      geodesic: true,
      strokeColor: "#DC143C",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: map,
    });
    polyline.setMap(map);
  };

  const resetMap = () => {
    for (let i = 0; i < globalMarkers.length; i++) {
      console.log("clearing: ", globalMarkers[i]);
      globalMarkers[i].setMap(null);
    }
    if (polyline) {
      polyline.setMap(null);
      polyline = null;
    }
    globalMarkers = [];
    latCache = [];
    lngCache = [];
  };

  const updateMap = () => {
    const originList = coords.originAddresses;
    const destinationList = coords.destinationAddresses;
    const cooors = [...originList, ...destinationList];

    resetMap();
    for (let i = 0; i < cooors.length; i++) {
      // const results = coords.rows[i].elements;
      geocoder
        .geocode({ address: cooors[i] })
        .then(showGeocodedAddressOnMap(false))
        .then((res: any) => {
          latCache.push(res[0]);
          lngCache.push(res[1]);

          if (i === cooors.length - 1) {
            setTimeout(() => {
              addFlowline(latCache, lngCache);
            }, 100);
          }
        });
      // for (let j = 0; j < results.length; j++) {
      //   geocoder
      //     .geocode({ address: destinationList[j] })
      //     .then(showGeocodedAddressOnMap(true))
      //     .then((res: any) => {
      //       latCache.push(res[0]);
      //       lngCache.push(res[1]);
      //     });
      // }
    }
  };

  useEffect(() => {
    if (coords) {
      updateMap();
    }
  }, [coords]);

  useEffect(() => {
    const api = (window as any).google;
    const map = new api.maps.Map(refEl.current, {
      zoom: 4,
      center: {
        lat: 40.24047041220942,
        lng: -95.16707296219492,
      },
      mapTypeId: api.maps.MapTypeId.TERRAIN,
    });
    setMap(map);
  }, []);
  return <div ref={refEl} style={{ height: "400px" }}></div>;
}

export default React.memo(Map);
