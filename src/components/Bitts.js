import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllBitts } from "../redux/actions/bittActions";
import EachBitt from "./EachBitt";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@material-ui/core";

export default function Bitts() {
  const dispatch = useDispatch();

  const { bitts, dataLoading } = useSelector((state) => state.bitts);

  useEffect(() => {
    dispatch(getAllBitts());
  }, []);

  return (
    <Box>
      <Container maxWidth="sm">
        {dataLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {bitts.map((i) => {
              return (
                <div key={i.id}>
                  <EachBitt i={i} />
                </div>
              );
            })}
          </>
        )}
      </Container>
    </Box>
  );
}
