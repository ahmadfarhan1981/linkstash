import * as inputComponentTypes from './InputComponent/types'

import AuthenticationProvider, {useAuthentication} from "./Providers/AuthenticationProvider/AuthenticationProvider"

import AlertBox from './AlertBox/AlertBox';
import ApplicationProvider from "./Providers/ApplicationProvider/ApplicationProvider";
import AuthenticatedSection from './AuthenticatedSection/AuthenticatedSection';
import BookmarkCard from "./BookmarkCard/BookmarkCard";
import Header from "./Header/Header";
import InputComponent from "./InputComponent/InputComponent";
import Loader from "./Loader/Loader";
import LoginForm from "./LoginForm/LoginForm";
import Pager from "./Pager/Pager";
import Providers from './Providers/Providers';
import TagCloud from "./TagCloud/TagCloud";
import UserNavigationBar from "./UserNavigationBar/UserNavigationBar";

export {
  AlertBox,
  ApplicationProvider,
  AuthenticationProvider,
  AuthenticatedSection,
  Header,
  Loader,
  UserNavigationBar,
  BookmarkCard,
  InputComponent,
  LoginForm,
  Pager,
  Providers,
  TagCloud,
  useAuthentication,
};

export type AutocompleteType = inputComponentTypes.AutocompleteType