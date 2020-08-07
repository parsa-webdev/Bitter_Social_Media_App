import {
  BITTS_LOADING,
  ADD_BITTS,
  BITT_ERROR,
  BITT_SUCCESS,
  SET_BITTS,
  DEL_BITTS,
  SET_LIKES,
  ADD_LIKES,
  LIKE_BITTS,
  UNLIKE_BITTS,
  DELETE_LIKES,
  ADD_COMMENTS,
  SET_COMMENTS,
  DELETE_COMMENTS,
  REMOVE_COMMENTS,
} from "../actions/types";

const initialState = {
  bitts: [],
  userLikes: [],
  comments: [],
  dataLoading: true,
  success: "",
  error: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case BITTS_LOADING:
      return {
        ...state,
        dataLoading: true,
        error: "",
        success: "",
      };

    case BITT_SUCCESS:
      return {
        ...state,
        success: action.payload,
        error: "",
      };
    case BITT_ERROR:
      return {
        ...state,
        error: action.payload,
        dataLoading: false,
      };
    case SET_BITTS:
      return {
        ...state,
        bitts: action.payload.sort(
          (a, b) => b.created.seconds - a.created.seconds
        ),
        dataLoading: false,
      };
    case ADD_BITTS:
      return {
        ...state,
        bitts: [action.payload, ...state.bitts],
        dataLoading: false,
      };
    case DEL_BITTS:
      return {
        ...state,
        bitts: [...state.bitts].filter((bitt) => bitt.id !== action.payload),
      };
    case DELETE_LIKES:
      return {
        ...state,
        userLikes: [...state.userLikes].filter(
          (like) => like.bittsID !== action.payload
        ),
      };
    case ADD_LIKES:
      return {
        ...state,
        userLikes: [...state.userLikes, action.payload],
      };
    case SET_LIKES:
      return {
        ...state,
        userLikes: action.payload,
      };
    case LIKE_BITTS:
      return {
        ...state,
        bitts: [...state.bitts].map((bitt) => {
          if (bitt.id === action.payload) {
            return { ...bitt, likes: bitt.likes + 1 };
          } else {
            return bitt;
          }
        }),
      };
    case UNLIKE_BITTS:
      return {
        ...state,
        bitts: [...state.bitts].map((bitt) => {
          if (bitt.id === action.payload) {
            return { ...bitt, likes: bitt.likes - 1 };
          } else {
            return bitt;
          }
        }),
      };
    case SET_COMMENTS:
      return {
        ...state,
        comments: action.payload,
      };
    case ADD_COMMENTS:
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    case DELETE_COMMENTS:
      return {
        ...state,
        comments: [...state.comments].filter(
          (comment) => comment.bittsID !== action.payload
        ),
      };
    case REMOVE_COMMENTS:
      return {
        ...state,
        comments: [...state.comments].filter(
          (comment) => comment.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
