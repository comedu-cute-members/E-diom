import Navigation from "../components/navigation";
import Study from "../components/study";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navigation />
      <div className="h-[calc(100vh-65px)]">
        <Study />
      </div>
    </div>
  );
}