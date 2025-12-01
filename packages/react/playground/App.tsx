import "./App.css";
import { colorPalette, ZiWeiSimulator } from "../src";

export default function App() {
  return (
    <div>
      {/* <ZiWei side={800} name="xx" date="1998-1-23-1" gender="Yang" language="zh-Hant" /> */}
      <ZiWeiSimulator
        side={800}
        birthYearStemKey="Gui"
        ziweiBranchKey="Shen"
        mainPalaceBranchKey="Shen"
        language="zh-Hant"
        options={{
          showPalaceName: false,
          showSelf: true,
          showStem: true,
          showBranch: true,
          showTransformation: true,
          showLaiYin: false,
        }}
        config={{
          palaceHoroscopeFill: "transparent",
          ziweiPalaceFill: colorPalette.w8,
          palaceRectStrokeWidth: 0,
        }}
      />
    </div>
  );
}
