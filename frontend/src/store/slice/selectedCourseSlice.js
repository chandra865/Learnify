import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCourse: null, // Only storing the selected course
};

const selectedCourseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
});

export const { setSelectedCourse, clearSelectedCourse } = selectedCourseSlice.actions;
export default selectedCourseSlice.reducer;
