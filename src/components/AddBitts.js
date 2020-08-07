import React, { useState } from "react";
import { addBitts } from "../redux/actions/bittActions";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default function AddBitt() {
  const dispatch = useDispatch();
  const [bitt, setMyBitt] = useState("");
  const [adding, setAdding] = useState(false);

  const { error, success } = useSelector((state) => state.bitts);

  const clearInput = () => {
    setMyBitt("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addBitts(bitt, clearInput, setAdding));
  };

  const buttonDisabled = () => {
    if (bitt === "") {
      // Form would be disabled if fields are empty
      return true;
    } else if (adding) {
      // Form would be disabled if fields are not empty and authenticating is true
      return true;
    } else {
      // Form would be disabled if fields are not empty and authenticating is false
      return false;
    }
  };
  return (
    <Container maxWidth="sm">
      <Box marginTop={6} marginBottom={3}>
        <form onSubmit={onSubmit}>
          <TextField
            id="standard-multiline-flexible"
            label="Bitts"
            multiline
            value={bitt}
            placeholder="Where is your mind?"
            value={bitt}
            onChange={(e) => setMyBitt(e.target.value)}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" my={1.5}>
                <Typography
                  color={bitt.length > 280 ? "error" : "primary"}
                  variant="h6"
                >
                  {bitt.length} / 280
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                my={1.5}
              >
                <Button
                  type="submit"
                  disabled={buttonDisabled()}
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  {adding ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress size={30} />
                    </Box>
                  ) : (
                    "Add Bitt"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}
        </form>
      </Box>
    </Container>
  );
}
