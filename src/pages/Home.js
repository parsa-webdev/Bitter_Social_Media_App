import React from "react";
import { useSelector } from "react-redux";
import AddBitts from "../components/AddBitts";
import Bitts from "../components/Bitts";
import { Link } from "react-router-dom";
import { Typography, Box, Button, Container } from "@material-ui/core";

export default function Home() {
  const { isLoggedIn, verifyingUser } = useSelector((state) => state.auth);

  return (
    <div>
      {verifyingUser ? null : isLoggedIn ? (
        <>
          <AddBitts />
          <Bitts />
        </>
      ) : (
        <>
          {" "}
          <Container maxWidth="sm">
            <Box
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              marginY={9}
              marginBottom={7}
            >
              <Typography variant="h2">Welcome to Bitter</Typography>
              <Typography variant="body1" color="textSecondary">
                Social media app like Twitter to share your bitter thoughts.
              </Typography>
              <Typography variant="body1" color="textSecondary">
                You need to SIGNUP or LOGIN to be able to share bitts.
              </Typography>
              <Box marginY={3} display="flex" justifyContent="center">
                <Box paddingX={1}>
                  <Button
                    to="/signup"
                    component={Link}
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
                  </Button>
                </Box>
                <Box paddingX={1}>
                  <Button
                    to="/login"
                    component={Link}
                    variant="outlined"
                    color="primary"
                  >
                    Log In
                  </Button>
                </Box>
              </Box>
            </Box>
            <Bitts />
          </Container>
        </>
      )}
    </div>
  );
}
