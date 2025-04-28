import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import courseReducer from "./slice/selectedCourseSlice";
import lectureReducer from "./slice/selectedLectureSlice";
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

// Combine all slices
const rootReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  lecture: lectureReducer,
});

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
