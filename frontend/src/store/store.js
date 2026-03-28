import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer} from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers'; 

//encrypt localStorage root
const encryptor = encryptTransform({
  secretKey: 'a6dd65cf9ed618803736778e77e379c9',
  onError: function (error) {
    console.log(error);
  },
});
// Configuration for redux-persist
const persistConfig = {
    key: 'root', // Key for the storage object
    storage, // The storage type (localStorage)
    // Whitelist specifies which slices of the state to persist
    whitelist: ['counter','user'], // Only the 'counter' state will be saved
    //blacklist: ['user'] // Use blacklist to ignore specific reducers
    transforms: [encryptor]
  };
  
  // Wrap your root reducer with persistReducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const store = configureStore({
       reducer: persistedReducer,
     middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
      serializableCheck: {
        // Ignore the actions dispatched by redux-persist themselves 
        // if they are causing issues *within* redux-persist's own flow.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        
        // OR explicitly ignore specific paths if you *must* store a function (not recommended):
        // ignoredPaths: ['register', 'rehydrate'], 
      },
    }),
   });
  const persistor = persistStore(store);
  
  export { store, persistor };