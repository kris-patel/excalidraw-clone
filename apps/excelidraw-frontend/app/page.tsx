import Link from "next/link";

function App() {
  return (
    <div>
      landing page
      <Link href={"/signin"}> signin </Link>
    </div>
  );
}

export default App;

