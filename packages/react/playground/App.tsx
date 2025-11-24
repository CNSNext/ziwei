import "./App.css";
import { colorPalette, ZiWeiSimulator } from "../src";

export default function App() {
  return (
    <div>
      {/* <ZiWei side={800} name="xx" date="1998-1-23-1" gender="Yang" language="zh-Hant" /> */}
      <ZiWeiSimulator
        side={800}
        ziweiBranchKey="Zi"
        birthYearStemKey="Jia"
        mainPalaceBranchKey="Yin"
        language="zh-Hant"
        options={{
          showPalaceName: false,
          showSelf: false,
          showStem: false,
          showBranch: false,
          showTransformation: false,
          showLaiYin: false,
        }}
        config={{
          palaceHoroscopeFill: "transparent",
          ziweiPalaceFill: colorPalette.w8,
        }}
      />
    </div>
  );
}
