import Navigation from "../components/navigation";
import Study from "../components/study";

export default function Home() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-cyan-500 to-blue-300">
      <Navigation />
      <div className="h-[calc(100vh-65px)]">
        <Study maxTest={5}/>
      </div>
    </div>
  );
}
