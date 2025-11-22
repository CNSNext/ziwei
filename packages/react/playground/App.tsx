import "./App.css";
import { ZiWei } from "../src";

export default function App() {
  return (
    <div>
      <ZiWei
        width={window.innerWidth}
        height={window.innerWidth}
        name="xx"
        date="1998-1-23-1"
        gender="Yang"
        language="zh-Hant"
      />
    </div>
  );
}
