import App from "./app.js";
import { helpText } from "./constants.js";
import { NotLoggedIn } from "./errors.js";
import AsyncLocalStorage from "@createnextapp/async-local-storage";
import type { Store } from "@reduxjs/toolkit";
import { rootEntities, setupStore } from "app-ui/src/app";
import { bootup } from "app-ui/src/bootup";
import { setToken } from "app-ui/src/token/index.js";
import type { AppState } from "app-ui/src/types";
import fs from "fs";
import { Text, render } from "ink";
import meow from "meow";
import os from "os";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


const fetchTokens = () => {
  try {
    const tokenString = fs.readFileSync(`${os.homedir()}/.aptible/tokens.json`, "utf8");
    const tokenData = JSON.parse(tokenString)[import.meta.env.VITE_AUTH_URL]
    const { id: tokenId, sub: userUrl } = JSON.parse(atob(tokenData.split(".")[1]))
    return {
      accessToken: tokenData,
      tokenId,
      userUrl,
    }
  } catch (_) {
    return null;
  }
};

const cli = meow(helpText, {
  importMeta: import.meta,
});

export const CLI = ({ store, tokens}: { store: Store<AppState>, tokens: any }) => {
  store.dispatch(setToken(tokens));
  return (
    <Provider store={store}>
      <App command={cli.input.at(0)} />
    </Provider>
  );
};

export const persistConfig = {
  key: "root",
  storage: AsyncLocalStorage,
};
export const init = ({ tokens }: { tokens: any }) => {
  const { store, persistor } = setupStore({
    initState: {
      entities: rootEntities,
    },
    bypassPersistConfig: persistConfig,
  });
  (window as any).reduxStore = store;
  store.dispatch(bootup());

  render(
    <PersistGate persistor={persistor}>
      <CLI store={store} tokens={tokens} />
    </PersistGate>,
  );
};

try {
  const tokens = fetchTokens();
  if (!tokens) {
    render(<NotLoggedIn />);
  } else {
    init({ tokens });
  }
} catch (e) {
  console.log("error with CLI!", e);
}
