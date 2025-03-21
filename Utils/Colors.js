import { useColorScheme } from "react-native"

function useColors () {

    const isDark = useColorScheme() == "dark"

    const mainBlue = "#385DAE"

    const yellow = "#E2EB0C"

    const errorRed = isDark ? "hsla(0, 100%, 62%, 0.702)" : "hsla(0, 100%, 50%, 0.42)"

    const placeholder = isDark ? "#c6c6c6c8" : "#a3a3a3ff"

    const text = isDark ? "white" : "black"

    const antiText = !isDark ? "white" : "black"

    const ligthText = isDark ? "#ffffffe1" : "#000000bc"

    const label = isDark ? "#dddddd" : "#0000007e"

    const background = isDark ? "#282828" : "#ffffff"

    const ligthBackground = isDark ? "#2a2b2a" : "#ffffff"

    return {
        mainBlue,
        yellow,
        ligthBackground,
        placeholder,
        errorRed,
        antiText,
        text,
        ligthText,
        label,
        background
      }
    }

export default useColors