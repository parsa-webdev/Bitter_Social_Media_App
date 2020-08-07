import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../services/firebase";
import EachBitt from "../components/EachBitt";
import { getAllBitts } from "../redux/actions/bittActions";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { useDispatch } from "react-redux";

export default function User({ match }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bitts, setBitts] = useState([]);
  const fetchData = async () => {
    setLoading(true);

    const authorDoc = await db.collection("users").doc(match.params.id).get();

    if (!authorDoc.exists) {
      setLoading(false);
      return setNotFound(true);
    }

    setName(`${authorDoc.data().firstName} ${authorDoc.data().lastName}`);

    let allBitts = [];

    const bittsSnapshot = await db
      .collection("bitts")
      .where("author", "==", match.params.id)
      .get();
    bittsSnapshot.forEach((doc) => {
      allBitts = [
        {
          ...doc.data(),
          id: doc.id,
          authorName: {
            firstName: authorDoc.data().firstName,
            lastName: authorDoc.data().lastName,
          },
          // isAuthor: true,
        },
        ...allBitts,
      ];
    });

    setBitts(allBitts);

    setLoading(false);
  };

  useEffect(() => {
    dispatch(getAllBitts());
    fetchData();
  }, []);
  return (
    <Box marginTop={3}>
      <Container maxWidth="sm">
        <>
          {isLoggedIn ? (
            notFound ? (
              <h3>User not found</h3>
            ) : loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Box marginY={6}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary">
                    {name}
                  </Typography>
                </Box>
                <Box marginTop={6}>
                  {bitts.map((i) => (
                    <EachBitt i={i} key={i.id} publicContent={true} />
                  ))}
                </Box>
              </Box>
            )
          ) : null}
        </>
      </Container>
    </Box>
  );
}
