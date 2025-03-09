import { useColorScheme } from "react-native"

function useColors () {

    const isDark = useColorScheme() == "dark"

    const mainBlue = isDark ? "#57ada4" : "#468c8a"

    const errorRed = isDark ? "hsla(0, 100%, 62%, 0.702)" : "hsla(0, 100%, 50%, 0.42)"

    const placeholder = isDark ? "#c6c6c6c8" : "#a3a3a3ff"

    const text = isDark ? "white" : "black"

    const antiText = !isDark ? "white" : "black"

    const ligthText = isDark ? "#ffffffe1" : "#000000bc"

    const label = isDark ? "#dddddd" : "#0000007e"

    const background = isDark ? "#1f1f1f" : "#e4f0e2"

    const ligthBackground = isDark ? "#2a2b2a" : "#ffffff"

    return Colors = {
        mainBlue,
        ligthBackground,
        placeholder,
        errorRed,
        antiText,
        text,
        grayButton,
        ligthText,
        label,
        background
      }
    }

export default useColors