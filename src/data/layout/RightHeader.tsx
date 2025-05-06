import { FileText, Server, User } from "react-feather";

//Notifications
export const NotificationsData = [
  {
    id: 1,
    image: "3.jpg",
    color: "danger",
    icon: "heart",
    name: "Emay Walter",
    text: "liked your post",
    time: "10 minutes ago",
  },
  {
    id: 2,
    image: "4.jpg",
    color: "info",
    icon: "share-alt",
    name: "Allie Grater",
    text: "shared your post",
    time: "5 hours ago",
  },
  {
    id: 3,
    image: "7.jpg",
    color: "success",
    icon: "wechat",
    name: "Colin Sik",
    text: "commented on your post",
    time: "yesterday",
  },
];
export const BookmarkData = [
  {
    icon: "file",
    title: "File Manager",
    pathName: "/applications/file-manager",
  },
  {
    icon: "task",
    title: "Tasks",
    pathName: "/applications/task",
  },
  {
    title: "Social App",
    icon: "social",
    pathName: "/applications/socialapp",
  },
];

//ChatHeader
export const chatHeaderData = [
  {
    id: 1,
    image: "1.jpg",
    text: "Hello.how are you?",
  },
  {
    id: 2,
    image: "3.jpg",
    text: "Hi, i'm fine.what about you?",
  },
  {
    id: 3,
    image: "1.jpg",
    text: "I am facing js issue can you help me?",
  },
  {
    id: 4,
    image: "3.jpg",
    text: "Sure, i will help you.",
  },
];

//CartHeader
export const cartHeaderData = [
  {
    id: 1,
    image: "img2.jpg",
    name: "Beauty cosmetic",
    price: 20,
    quantity: 2,
  },
  {
    id: 2,
    image: "img-1.jpg",
    name: "Simple shoes",
    price: 30,
    quantity: 1,
  },
];

//Profile
export const profileHeaderData = [
  {
    id: 1,
    link: `others/auth/sign_up_one`,
    icon: "user",
    text: "Account",
  },
  {
    id: 2,
    link: `/applications/letter-box`,
    icon: "stroke-email",
    text: "Inbox",
  },
  {
    id: 3,
    link: `applications/task`,
    icon: "notepad",
    text: "Taskboard",
  },
  {
    id: 4,
    link: `applications/users/edit-profile`,
    icon: "settings",
    text: "Settings",
  },
];

export interface languageDataType {
  languageParameter: string;
  languageName: string;
  languageIconClassName: string;
  subTitle?: string;
}
export let languageData = [
  {
    languageParameter: "en",
    languageName: 'English',
    languageIconClassName: "us",
    subTitle: "US",
  },
  {
    languageParameter: "du",
    languageName: 'Deutsch',
    languageIconClassName: "de",
  },
  {
    languageParameter: "es",
    languageName: 'Español',
    languageIconClassName: "es",
  },
  {
    languageParameter: "fr",
    languageName: 'Français',
    languageIconClassName: "fr",
  },
  {
    languageParameter: "pt",
    languageName: 'Português',
    languageIconClassName: "pt",
    subTitle: "BR",
  },
  {
    languageParameter: "cn",
    languageName: '简体中文',
    languageIconClassName: "cn",
  },
  {
    languageParameter: "ae",
    languageName: "لعربي",
    languageIconClassName: "ae",
    subTitle: "ae",
  },
];

