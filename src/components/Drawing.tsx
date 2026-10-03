import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Lesson } from "../data/types";
import { COLORS } from "../constants/theme";
import { pathLength } from "../data/shapes";

interface Props {
  lesson: Lesson;
  size: number;
  /** Index of the step being taught; paths after it are hidden. Omit to show the finished drawing. */
  step?: number;
  color?: string;
  /** Change this value to replay the stroke animation. */
  playKey?: number;
}

export function Drawing({ lesson, size, step, color = COLORS.ink, playKey = 0 }: Props) {
  const finished = step === undefined;
  const done = finished ? lesson.steps.flatMap((s) => s.paths) : lesson.steps.slice(0, step).flatMap((s) => s.paths);
  const current = finished ? [] : lesson.steps[step].paths;
  const stroke = Math.max(2.5, 600 / size);

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {done.map((d, i) => (
        <Path
          key={`d${i}`}
          d={d}
          fill="none"
          stroke={finished ? color : COLORS.muted}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {timeline(current).map(({ d, length, delay, duration }, i) => (
        <StrokeAnim
          key={`c${step}-${i}-${playKey}`}
          d={d}
          color={color}
          width={stroke + 1}
          length={length}
          delay={delay}
          duration={duration}
        />
      ))}
    </Svg>
  );
}

function timeline(paths: string[]) {
  let t = 0;
  return paths.map((d) => {
    // A small margin keeps the dash gap from showing at the end when the estimate runs short.
    const length = pathLength(d) * 1.04 + 2;
    const duration = Math.min(1300, Math.max(450, length * 5));
    const item = { d, length, delay: t, duration };
    t += duration + 120;
    return item;
  });
}

interface StrokeProps {
  d: string;
  color: string;
  width: number;
  length: number;
  delay: number;
  duration: number;
}

// Animated.createAnimatedComponent(Path) leaks a `collapsable` prop to the DOM on web, so the offset is driven through state.
function StrokeAnim({ d, color, width, length, delay, duration }: StrokeProps) {
  const [offset, setOffset] = useState(length);
  useEffect(() => {
    const value = new Animated.Value(length);
    const id = value.addListener(({ value: v }) => setOffset(v));
    const anim = Animated.timing(value, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });
    anim.start();
    return () => {
      anim.stop();
      value.removeListener(id);
    };
  }, [length, delay, duration]);

  return (
    <Path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={offset >= length - 0.5 ? 0 : 1}
      strokeDasharray={[length, length]}
      strokeDashoffset={offset}
    />
  );
}
