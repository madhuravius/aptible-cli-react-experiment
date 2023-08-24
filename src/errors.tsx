import { Text } from "ink";

export const NotLoggedIn = () => (
  <Text>
    <Text color="red">Error: </Text>
    <Text>
      You are not logged in! Currently no login mechanic is provided, please
      login with the regular Aptible CLI first.
    </Text>
  </Text>
);
