import InputComponent from "./InputComponent/InputComponent";

import AuthenticationProvider from "./AuthenticationProvider/AuthenticationProvider"
import BookmarkCard from "./BookmarkCard/BookmarkCard";
import Header from "./Header/Header";
import Loader from "./Loader/Loader";
import LoginForm from "./LoginForm/LoginForm";
import Pager from "./Pager/Pager";
import TagCloud from "./TagCloud/TagCloud";
import UserNavigationBar from "./UserNavigationBar/UserNavigationBar";

export {
  AuthenticationProvider,
  Header,
  Loader,
  UserNavigationBar,
  BookmarkCard,
  InputComponent,
  LoginForm,
  Pager,
  TagCloud,
  
};

import * as inputComponentTypes from './InputComponent/types'
export type AutocompleteType = inputComponentTypes.AutocompleteType