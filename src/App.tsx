import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Distance from "./Distance";

export default function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Get My Distance
        </Typography>
        <Typography variant="h6" component="h4" align="center" gutterBottom>
          Airports Distance Calculator
        </Typography>
        <Distance />
      </Box>
    </Container>
  );
}
