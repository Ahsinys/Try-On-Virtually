import { useApp } from '../context/AppContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <MainTabs /> : <AuthStack />;
}
