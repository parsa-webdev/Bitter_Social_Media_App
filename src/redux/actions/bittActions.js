import {
  BITT_ERROR,
  BITTS_LOADING,
  ADD_BITTS,
  BITT_SUCCESS,
  SET_BITTS,
  DEL_BITTS,
  SET_LIKES,
  ADD_LIKES,
  LIKE_BITTS,
  DELETE_LIKES,
  ADD_COMMENTS,
  SET_COMMENTS,
  DELETE_COMMENTS,
  REMOVE_COMMENTS,
} from "./types";
import { auth, db } from "../../services/firebase";
import firebase from "firebase";

export const getAllBitts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BITTS_LOADING });

    if (getState().auth.isLoggedIn) {
      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          let likes = [];

          const likesSnapshot = await db
            .collection("likes")
            .where("author", "==", user.uid)
            .get();

          likesSnapshot.forEach((doc) => {
            likes = [...likes, { id: doc.id, ...doc.data() }];
          });

          dispatch({
            type: SET_LIKES,
            payload: likes,
          });
        }
      });
    }

    let comments = [];

    const commentsSnapshot = await db.collection("comments").get();

    commentsSnapshot.forEach((doc) => {
      comments = [...comments, { id: doc.id, ...doc.data() }];
    });

    dispatch({
      type: SET_COMMENTS,
      payload: comments,
    });

    //GET BITTS

    const bittsSnapshot = await db
      .collection("bitts")
      .orderBy("created", "asc")
      .get();

    let allBitts = [];

    bittsSnapshot.forEach((doc) => {
      allBitts = [...allBitts, { id: doc.id, ...doc.data() }];
    });

    for (const bitt of allBitts) {
      const authorDoc = await db.collection("users").doc(bitt.author).get();

      if (getState().auth.isLoggedIn) {
        await auth.onAuthStateChanged((user) => {
          if (user) {
            if (user.uid === bitt.author) {
              bitt.isAuthor = true;
            } else {
              bitt.isAuthor = false;
            }
          }
        });
      }

      bitt.authorName = {
        firstName: authorDoc.data().firstName,
        lastName: authorDoc.data().lastName,
      };
    }

    dispatch({
      type: SET_BITTS,
      payload: allBitts,
    });
  } catch (err) {
    dispatch({ type: BITT_ERROR, payload: "" });
    console.log(err);
  }
};

export const addBitts = (bittTxt, clearInput, setAdding) => async (
  dispatch
) => {
  try {
    setAdding(true);
    if (bittTxt.length > 280) {
      setAdding(false);
      return dispatch({ type: BITT_ERROR, payload: "Too many characters" });
    }
    const userID = await auth.currentUser.uid;

    const newBitt = {
      bittTxt,
      likes: 0,
      dislikes: 0,
      comments: [],
      created: firebase.firestore.Timestamp.fromDate(new Date()),
      author: userID,
    };

    const bittDoc = await db.collection("bitts").add(newBitt);

    const authorDoc = await db.collection("users").doc(newBitt.author).get();

    const authorName = {
      firstName: authorDoc.data().firstName,
      lastName: authorDoc.data().lastName,
    };

    const addedBitt = {
      id: bittDoc.id,
      ...newBitt,
      authorName,
      isAuthor: true,
    };

    dispatch({ type: ADD_BITTS, payload: addedBitt });
    dispatch({ type: BITT_SUCCESS, payload: "Bitt Added" });

    setTimeout(() => {
      dispatch({ type: BITT_SUCCESS, payload: "" });
    }, 5000);

    setAdding(false);
    clearInput();
  } catch (err) {
    setAdding(false);
    dispatch({ type: BITT_ERROR, payload: err.message });
  }
};

export const delBitts = ({ id, setDeleting }) => async (dispatch) => {
  try {
    setDeleting(true);
    const likeDocRef = await db
      .collection("likes")
      .where("bittsID", "==", id)
      .get();

    const commentDocRef = await db
      .collection("comments")
      .where("bittsID", "==", id)
      .get();

    const batch = db.batch();

    likeDocRef.forEach((doc) => {
      batch.delete(doc.ref);
    });

    commentDocRef.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    dispatch({ type: DELETE_LIKES, payload: id });
    dispatch({ type: DELETE_COMMENTS, payload: id });

    await db.collection("bitts").doc(id).delete();
    setDeleting(false);
    dispatch({ type: DEL_BITTS, payload: id });
  } catch (err) {
    dispatch({ type: BITT_ERROR, payload: err.message });
    setDeleting(false);
  }
};

export const likeBitts = ({ id, likes, setLiked, setLiking }) => async (
  dispatch,
  getState
) => {
  try {
    const authenticated = getState().auth.isLoggedIn;
    if (authenticated) {
      setLiking(true);
      let docRef = await db.collection("bitts").doc(id);

      docRef.update({
        likes: likes + 1,
      });

      dispatch({
        type: LIKE_BITTS,
        payload: id,
      });

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userLike = {
            bittsID: id,
            author: user.uid,
          };

          const doc = await db.collection("likes").add(userLike);

          userLike.id = doc.id;

          dispatch({
            type: ADD_LIKES,
            payload: userLike,
          });
        } else {
        }
      });

      setLiked(true);
      setLiking(false);
    } else {
      window.location.pathname = "/login";
    }
  } catch (err) {
    dispatch({ type: BITT_ERROR, payload: err.message });
    setLiking(false);
  }
};

export const unLikeBitts = ({
  id,
  likes,
  likeId,
  setLiked,
  setLiking,
}) => async (dispatch) => {
  try {
    setLiking(true);
    let docRef = db.collection("bitts").doc(id);

    await docRef.update({
      likes: likes - 1,
    });

    dispatch({ type: UNLIKE_BITTS, payload: id });

    const documentRef = await db.collection("likes").doc(likeId);

    await documentRef.delete();

    dispatch({ type: DELETE_LIKES, payload: likeId });
    setLiked(false);
    setLiking(false);
  } catch (err) {
    dispatch({ type: BITT_ERROR, payload: err.message });
    setLiking(false);
  }
};

export const addComments = ({
  id,
  commentTxt,
  setCommenting,
  setCommentTxt,
}) => async (dispatch, getState) => {
  try {
    const authenticated = getState().auth.isLoggedIn;
    if (authenticated) {
      setCommenting(true);

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDoc = await db.collection("users").doc(user.uid).get();

          const newComment = {
            bittsID: id,
            author: user.uid,
            authorName: {
              firstName: userDoc.data().firstName,
              lastName: userDoc.data().lastName,
            },
            commentTxt,
          };

          const commentDoc = await db.collection("comments").add(newComment);

          newComment.id = commentDoc.id;

          dispatch({
            type: ADD_COMMENTS,
            payload: newComment,
          });
        }
      });

      setCommentTxt("");
      setCommenting(false);
    } else {
      window.location.pathname = "/login";
    }
  } catch (err) {
    dispatch({ type: BITT_ERROR, payload: err.message });
    setCommenting(false);
  }
};

export const delComments = ({ id }) => async (dispatch) => {
  try {
    await db.collection("comments").doc(id).delete();

    dispatch({ type: REMOVE_COMMENTS, payload: id });
  } catch (err) {
    dispatch({ type: BITT_ERROR, payload: err.message });
  }
};
