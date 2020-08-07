import React from "react";
import EachComment from "./EachComment";
export default function Comments({
  filteredComments,
  userInfo,
  removeComment,
  commenting,
}) {
  return (
    <>
      {commenting ? (
        <h2>Commenting...</h2>
      ) : (
        <>
          {filteredComments.map((comment) => {
            return (
              <EachComment
                key={comment.id}
                filteredComments={filteredComments}
                userInfo={userInfo}
                removeComment={removeComment}
                comment={comment}
              />
            );
          })}
        </>
      )}
    </>
  );
}
