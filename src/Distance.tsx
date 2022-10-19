import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Map from "./Map";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Unstable_Grid";
import InputSearch from "./InputSearch";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_MAP_API_KEY;
function loadScript(
  src: string,
  position: HTMLElement | null,
  id: string,
  cb: any
) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  script.onload = () => {
    cb();
  };
  position.appendChild(script);
}

export default function Distance() {
  const [mapService, setLoaded] = useState<any | null>(null);
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [origin, setOrigin] = useState<any | null>(null);
  const [destination, setDestination] = useState<any | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [coords, setCoords] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);

  const getDistance = async () => {
    if (!origin || !destination) return;
    const request = {
      origins: [origin.description],
      destinations: [destination.description],
      travelMode: (window as any).google.maps.TravelMode.DRIVING,
      unitSystem: (window as any).google.maps.UnitSystem.METRIC,
      avoidHighways: true,
      avoidTolls: true,
    };

    mapService.getDistanceMatrix(request, (resp: any) => {
      console.log(resp);
      if (resp.rows[0].elements[0].status === "ZERO_RESULTS") {
        setError(true);
        return;
      }
      const meterDistance = resp.rows[0].elements[0].distance.value;
      const nm = meterDistance / 1852;
      setError(false);
      setDistance(nm.toFixed(2));
      setCoords(resp);
    });
  };
  useEffect(() => {
    if (typeof window !== "undefined" && !apiLoaded) {
      if (!document.querySelector("#google-maps")) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&types=airport&components=country:us`,
          document.querySelector("head"),
          "google-maps",
          () => {
            setApiLoaded(true);
            const service = new (
              window as any
            ).google.maps.DistanceMatrixService();
            setLoaded(service);
          }
        );
      }
    }
  }, []);
  return (
    <>
      <Box sx={{ flexGrow: 1, paddingTop: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={4.5}>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <InputSearch
                id="fromInput"
                label="Airport A"
                refString={destination ? destination.description : destination}
                updateValue={(value) => {
                  setOrigin(value);
                }}
              />
              <InputSearch
                id="toInput"
                label="Airport B"
                refString={origin ? origin.description : origin}
                updateValue={(value) => {
                  setDestination(value);
                }}
              />
              <Button
                variant="outlined"
                onClick={(e: any): void => {
                  getDistance();
                }}
                disabled={!origin || !destination}
              >
                GET DISTANCE
              </Button>
              {error && (
                <Typography
                  variant="subtitle1"
                  component="div"
                  align="left"
                  gutterBottom
                  bgcolor="red"
                  color="white"
                  fontWeight="bold"
                  textAlign="center"
                >
                  No Results
                </Typography>
              )}
              {distance && !error && (
                <Typography
                  variant="subtitle1"
                  component="div"
                  align="left"
                  gutterBottom
                  fontSize="24px"
                  paddingY="8px"
                  borderBottom={"3px solid green"}
                >
                  Distance in nautical miles: <strong>{distance}</strong>
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid xs={12} sm={7} smOffset={0.5}>
            {apiLoaded && <Map coords={coords} />}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
