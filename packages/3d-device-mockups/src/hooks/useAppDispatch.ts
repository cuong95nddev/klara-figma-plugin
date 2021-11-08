import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
