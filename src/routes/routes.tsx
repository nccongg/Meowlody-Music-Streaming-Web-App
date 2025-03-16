import Home from '../pages/home';
import LikedSongs from '../pages/likedSongs';
import Library from '../pages/yourLibrary';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/library', component: Library },
  { path: '/likedsongs', component: LikedSongs },
];

export { publicRoutes };
