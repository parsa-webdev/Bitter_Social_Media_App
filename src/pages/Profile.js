import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EachBitt from "../components/EachBitt";
import { getAllBitts } from "../redux/actions/bittActions";

import {
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core";

export default function Profile({}) {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.auth);
  const { bitts, dataLoading } = useSelector((state) => state.bitts);
  const filteredBitts = bitts.filter((i) => i.author === userInfo.userID);
  useEffect(() => {
    dispatch(getAllBitts());
  }, []);

  return (
    <Box marginTop={3}>
      <Container maxWidth="sm">
        <>
          {isLoggedIn ? (
            dataLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Box marginY={6}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary">
                    {userInfo.firstName} {userInfo.lastName}
                  </Typography>
                </Box>
                <Box marginTop={6}>
                  {filteredBitts.map((i) => {
                    return <EachBitt i={i} key={i.id} />;
                  })}
                </Box>
              </Box>
            )
          ) : null}
        </>
      </Container>
    </Box>
  );
}
