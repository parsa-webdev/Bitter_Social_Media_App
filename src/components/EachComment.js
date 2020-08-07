import React from "react";
import { Typography, IconButton, Box } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
export default function EachComment({ userInfo, removeComment, comment }) {
  return (
    <Box
      my={2}
      display="flex"
      paddingBottom={1}
      borderColor="grey.500"
      borderTop={0}
    >
      <Box display="flex" alignItems="center">
        <Typography varient="h6" color="inherit">
          <b>
            {comment.authorName.firstName} {comment.authorName.lastName}
          </b>
          <br />
          {comment.commentTxt}
        </Typography>
      </Box>

      <Box
        flex="1"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        {comment.author === userInfo.userID ? (
          <IconButton onClick={() => removeComment(comment.id)}>
            <Close fontSize="small" />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
}
