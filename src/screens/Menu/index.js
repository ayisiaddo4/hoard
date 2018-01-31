import { DrawerNavigator, StackNavigator } from "react-navigation";
import { Dimensions } from "react-native";
import Dashboard from "screens/Dashboard";
import ICO from 'screens/ICO';
import Wallet from "screens/Wallet";
import Settings from "screens/Settings";
import CoinInformation from "screens/CoinInformation";
import withHeader from "hocs/withHeader";
import Menu from "./Menu";

const itemWithHeader = (title, screen) => {
  return StackNavigator({ Main: { screen: withHeader(title, screen) } });
};

const RouteConfigs = {
  Wallet: {
    screen: StackNavigator({
      Main: { screen: withHeader("Wallet", Wallet) },
      CoinInformation: { screen: CoinInformation }
    })
  },
  Dashboard: {
    screen: itemWithHeader("Dashboard", Dashboard)
  },
  ICO:  {
    screen: itemWithHeader("ICO", ICO)
  },
  Settings: {
    screen: itemWithHeader("Settings", Settings)
  }
};

const drawerNavigatorConfig = {
  drawerPosition: "right",
  drawerWidth: Dimensions.get("window").width,
  contentComponent: Menu
};

export default DrawerNavigator(RouteConfigs, drawerNavigatorConfig);
