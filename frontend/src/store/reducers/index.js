import { combineReducers } from 'redux';
import { userReducer } from './userReducer';


const rootReducer = combineReducers({
  user: userReducer.reducer,      // Save an authentificated user data state. 

});

export default rootReducer;