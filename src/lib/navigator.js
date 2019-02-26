/**
|--------------------------------------------------
| React Navigation Service
| https://github.com/react-navigation/react-navigation/issues/1439#issuecomment-303661539
|--------------------------------------------------

It is hard to dispatch actions from outside of the
parent Navigator. This is a service to help dispatch
actions from side effects in Redux Sagas, but it could
be used anywhere.

In /src/App.js, we've added a ref in <RoutingStack>.

Usage:
// from some/other/component.js
import NavigatorService from "lib/navigator";

// Navigate to a route defined in App.js's RoutingStack:
NavigatorService.navigate("Menu");


// Navigate to a nested route:
 NavigatorService.navigateDeep([
  { routeName: "Menu" },
  { routeName: "Dashboard" }
]);
*/

import {
  NavigationActions,
  StackActions,
  DrawerActions,
} from 'react-navigation';

let _container; // eslint-disable-line

function setContainer(container) {
  _container = container;
}

function closeDrawer() {
  _container.dispatch(DrawerActions.closeDrawer());
}

function openDrawer() {
  _container.dispatch(DrawerActions.openDrawer());
}

function resetNavigate(routeName, params) {
  _container.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        StackActions.navigate({
          routeName,
          params,
        }),
      ],
    })
  );
}

function resetTo(...routes) {
  _container._navigation.reset([buildDeepNavigation(routes)]);
}

function back() {
  _container.dispatch(NavigationActions.back());
}

function navigate(routeName, params) {
  _container.dispatch(
    NavigationActions.navigate({
      type: 'Navigation/NAVIGATE',
      routeName,
      params,
    })
  );
}

function buildDeepNavigation(actions) {
  return actions.reduceRight(
    (prevAction, action) =>
      action &&
      NavigationActions.navigate({
        routeName: action.routeName,
        params: action.params,
        action: prevAction,
      }),
    undefined
  );
}

function navigateDeep(actions) {
  _container.dispatch(buildDeepNavigation(actions));
}

function getCurrentRoute() {
  if (!_container || !_container.state.nav) {
    return null;
  }

  return _container.state.nav.routes[_container.state.nav.index] || null;
}

export default {
  setContainer,
  navigateDeep,
  navigate,
  resetNavigate,
  resetTo,
  back,
  closeDrawer,
  openDrawer,
  getCurrentRoute,
};
