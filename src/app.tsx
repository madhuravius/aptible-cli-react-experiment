import { helpText } from "./constants";
import { NotLoggedIn } from "./errors";
import { fetchAllApps, selectAppsForTableSearch } from "app-ui/src/deploy";
import { useQuery } from "app-ui/src/fx";
import { selectAccessToken, selectToken } from "app-ui/src/token";
import { AppState } from "app-ui/src/types";
import { Newline, Text, render } from "ink";
import { useSelector } from "react-redux";

type Props = {
  command: "apps" | "info" | string | undefined;
};

export default function App({ command }: Props) {
  if (!command) {
    return <Text>{helpText}</Text>;
  }
  useQuery(fetchAllApps());
  const token = useSelector((s: AppState) => selectToken(s));
  const apps = useSelector((s: AppState) =>
    selectAppsForTableSearch(s, { search: "" }),
  );

  if (!token) {
    return <NotLoggedIn />;
  }

  if (command === "apps") {
    return (
      <Text>
        aptible <Text color="green">{command}</Text>
        <Newline />
        <Text>{apps.length} apps found</Text>
      </Text>
    );
  }

  return <Text>{helpText}</Text>;
}
