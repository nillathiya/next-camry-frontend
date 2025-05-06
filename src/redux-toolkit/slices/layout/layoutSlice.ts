import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LayoutStateProps {
  isSearchBarOpen: boolean;
  bookMarkClass: boolean;
  pinedMenu: string[];
  sideBarToggle: string;
  sidebarSearchTerm: string;
  bookmarkToggle: string;
  removeSidebar: string;
  searchClass: boolean;
  selectedMenuLabel: string;
}

const initialState: LayoutStateProps = {
  isSearchBarOpen: false,
  bookMarkClass: false,
  pinedMenu: [],
  sideBarToggle: "",
  sidebarSearchTerm: "",
  bookmarkToggle: "",
  removeSidebar: "",
  searchClass: false,
  selectedMenuLabel: "",
};

const LayoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setIsSearchBarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchBarOpen = action.payload;
    },
    setBookMarkClass: (state, action: PayloadAction<boolean>) => {
      state.bookMarkClass = action.payload;
    },
    setPinedMenu: (state, action: PayloadAction<string[]>) => {
      state.pinedMenu = action.payload;
    },
    setSideBarToggle: (state, action: PayloadAction<string>) => {
      state.sideBarToggle = action.payload;
    },
    setSidebarSearchTerm: (state, action: PayloadAction<string>) => {
      state.sidebarSearchTerm = action.payload;
    },
    bookmarkToggle: (state, action: PayloadAction<string>) => {
      state.bookmarkToggle = action.payload;
    },
    setRemoveSidebar: (state, action: PayloadAction<string>) => {
      state.removeSidebar = action.payload;
    },
    setSearchClass: (state, action: PayloadAction<boolean>) => {
      state.searchClass = action.payload;
    },
    setSelectedMenuLabel: (state, action: PayloadAction<string>) => {
      state.selectedMenuLabel = action.payload;
    },
  },
});

export const {
  setIsSearchBarOpen,
  setBookMarkClass,
  setPinedMenu,
  setSideBarToggle,
  setSidebarSearchTerm,
  bookmarkToggle,
  setRemoveSidebar,
  setSearchClass,
  setSelectedMenuLabel,
} = LayoutSlice.actions;
export default LayoutSlice.reducer;