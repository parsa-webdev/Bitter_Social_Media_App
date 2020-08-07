import React, { useState, useEffect } from "react";
import {
  delBitts,
  likeBitts,
  unLikeBitts,
  addComments,
  delComments,
} from "../redux/actions/bittActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comments from "./Comments";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Button,
  TextField,
  Divider,
} from "@material-ui/core";
import { Favorite, FavoriteBorder, Delete } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
  },
  comment: {
    backgroundColor: theme.palette.warning.light,
  },
}));

export default function EachBitt({ i, publicContent }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { userLikes, comments } = useSelector((state) => state.bitts);
  const { userInfo, isLoggedIn } = useSelector((state) => state.auth);
  const [deleting, setDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [commentTxt, setCommentTxt] = useState("");

  const deleteBitt = (id) => {
    dispatch(delBitts({ id, setDeleting }));
  };

  const addLikes = (id, likes) => {
    dispatch(likeBitts({ id, likes, setLiked, setLiking }));
  };

  const removeLikes = (id, likes) => {
    const likeDoc = userLikes.find((like) => like.bittsID === i.id);
    dispatch(
      unLikeBitts({ id, likes, likeId: likeDoc.id, setLiked, setLiking })
    );
  };

  const removeComment = (id) => {
    dispatch(delComments({ id }));
  };

  const submitComment = (e) => {
    e.preventDefault();
    dispatch(
      addComments({ id: i.id, commentTxt, setCommenting, setCommentTxt })
    );
  };

  const buttonDisabled = () => {
    if (liking || commenting) {
      // Form would be disabled if fields are empty
      return true;
    } else {
      // Form would be disabled if fields are not empty and authenticating is false
      return false;
    }
  };

  const fullName = `${i.authorName.firstName} ${i.authorName.lastName}`;

  const filteredComments = comments.filter(
    (comment) => comment.bittsID === i.id
  );

  useEffect(() => {
    const filteredLikes = userLikes.filter((like) => like.bittsID === i.id);

    if (filteredLikes.length > 0) {
      setLiked(true);
    }
  }, []);

  return (
    <Box marginBottom={3}>
      <Paper square={false} elevation={3}>
        <Box padding={3}>
          {deleting ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box display="flex">
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="h5"
                    component={Link}
                    color="primary"
                    to={`/${fullName.replace(/\s/g, "").toLowerCase()}/${
                      i.author
                    }`}
                    className={classes.link}
                  >
                    {i.authorName.firstName} {i.authorName.lastName}
                  </Typography>
                </Box>

                <Box display="flex" flex="1" justifyContent="flex-end">
                  {publicContent ? null : i.isAuthor ? (
                    <IconButton onClick={() => deleteBitt(i.id)}>
                      <Delete fontSize="small" color="secondary" />
                    </IconButton>
                  ) : null}
                </Box>
              </Box>
              <Box marginY={2}>
                <Typography variant="body1">{i.bittTxt}</Typography>
              </Box>

              <Box display="flex">
                <Box>
                  {liked ? (
                    <IconButton
                      variant="contained"
                      onClick={() => removeLikes(i.id, i.likes)}
                      disabled={buttonDisabled()}
                    >
                      <Favorite fontSize="medium" color="secondary" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => addLikes(i.id, i.likes)}
                      disabled={buttonDisabled()}
                    >
                      <FavoriteBorder fontSize="medium" color="primary" />
                    </IconButton>
                  )}
                </Box>

                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box paddingX={1}>
                    {" "}
                    <Typography variant="body1">{i.likes}</Typography>{" "}
                  </Box>
                </Box>
              </Box>

              <Box marginY={2}>
                <form onSubmit={submitComment}>
                  <Box maxWidth="lg">
                    <TextField
                      id="outlined-multiline-flexible"
                      multiline
                      type="text"
                      value={commentTxt}
                      onChange={(e) => setCommentTxt(e.target.value)}
                      required
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                  <Box display="flex" marginY={0.5}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      disabled={buttonDisabled()}
                      type="submit"
                    >
                      Comment
                    </Button>
                  </Box>
                </form>
              </Box>

              <Box marginBottom={1} marginTop={3}>
                <Typography variant="h5">
                  Comments ({filteredComments.length})
                </Typography>
              </Box>
              <Divider />
              <Comments
                filteredComments={filteredComments}
                userInfo={userInfo}
                removeComment={removeComment}
                commenting={commenting}
              />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
