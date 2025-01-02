import { combineReducers } from "redux";
import statusReduce from "./statusReduce";

const reducers = combineReducers({
    statues : statusReduce
})

export default reducers;