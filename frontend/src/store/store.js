import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import courseReducer from "./slice/selectedCourseSlice";
import lectureReducer from "./slice/selectedLectureSlice";
import cartReducer from "./slice/cartSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage

const appReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  lecture: lectureReducer,
  cart: cartReducer,
});

const rootReducer = (state, action) => {
  // Clear all state on logout
  if (action.type === "user/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};


// Persist everything by default
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
