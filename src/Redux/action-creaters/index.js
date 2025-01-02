export const Login = (LogStatus) => {
    return (dispatch) => {
        dispatch({ type: 'login', playload: LogStatus });
    };
};

export const Logout = (LogStatus) => {
    return (dispatch) => {
        dispatch({ type: 'logout', playload: LogStatus });
    };
};