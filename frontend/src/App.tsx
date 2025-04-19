import { Button } from "react-aria-components";
import { useAuth } from "react-oidc-context";
import MoodTrend from "./components/mood-trend";
import FeelingCard from "./components/feeling-card";
import RecentEntries from "./components/recent-entries";

function App() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div className="awesome-gradient min-h-screen w-full h-full flex flex-col items-center gap-4">
        <Button className="p-2 bg-red-500" onPress={() => auth.removeUser()}>
          Logout
        </Button>
        <FeelingCard />
        <MoodTrend />
        <RecentEntries />
      </div>
    );
  }

  return (
    <>
      <Button className="p-2 bg-green-500" onPress={handleLogin}>
        Login
      </Button>
    </>
  );
}

export default App;
