const reducer = (state = 0, action) => {
  if (action.type === "login") {
    return action.playload;
  } else if (action.type === "logout") {
    return false;
  } else {
    return false;
  }
};


export default reducer;