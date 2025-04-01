import Home from '../pages/Home';
import LikedSongs from '../pages/LikedSongs';
import Library from '../pages/YourLibrary';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/library', component: Library },
  { path: '/likedsongs', component: LikedSongs },
];

export { publicRoutes };
