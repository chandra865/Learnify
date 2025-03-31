import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLecture: null, // Only storing the selected course
};

const selectedLectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {
    setSelectedLecture: (state, action) => {
      state.selectedLecture = action.payload;
    },
    clearSelectedLecture: (state) => {
      state.selectedLecture = null;
    },
  },
});

export const { setSelectedLecture, clearSelectedLecture } = selectedLectureSlice.actions;
export default selectedLectureSlice.reducer;
