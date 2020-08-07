import React from "react";
import UserDetail from "../components/UserDetail";
import { useSelector } from "react-redux";

export default function User({ match }) {
  const { verifyingUser } = useSelector((state) => state.auth);

  return <div>{verifyingUser ? null : <UserDetail match={match} />}</div>;
}
