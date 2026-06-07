// audio setup
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];


function useKeyboardSound() {
    const playRamdomKeyStrokeSound = () => {
        const randomIndex = Math.floor(Math.random() * keyStrokeSounds.length);
        const sound = keyStrokeSounds[randomIndex];
        sound.currentTime = 0;
        sound.play().catch((error) => console.log("Audio play failed:", error));
    };

    return {playRamdomKeyStrokeSound};
}
export default useKeyboardSound;