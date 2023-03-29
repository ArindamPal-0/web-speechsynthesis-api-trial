import { useEffect, useState } from "react";
import pauseIcon from "./assets/player-pause.svg";
import playIcon from "./assets/player-play.svg";
import stopIcon from "./assets/player-stop.svg";
import waveGif from "./assets/wave.gif";
import { stories } from "./story_db/db";

const speechSynthesis = window.speechSynthesis;

type PlayState = "playing" | "paused" | "stopped";

function App() {
    const [playState, setPlayState] = useState<PlayState>("stopped");
    const [selectedVoice, setSelectedVoice] = useState("");
    const [selectedStory, setSelectedStory] = useState(0);

    useEffect(() => {
        setPlayState("stopped");
        speechSynthesis.cancel();
        setSelectedVoice(speechSynthesis.getVoices()[0].name);

        return () => {
            speechSynthesis.cancel();
            setPlayState("stopped");
            setSelectedVoice("");
            setSelectedStory(0);
        };
    }, []);

    useEffect(() => {
        console.log(`Voice changed to: [${selectedVoice}]`);
    }, [selectedVoice]);

    useEffect(() => {
        console.log(playState);
        // console.table([
        //     speechSynthesis.paused,
        //     speechSynthesis.speaking,
        //     speechSynthesis.pending,
        // ]);
    }, [playState]);

    function handleChangeVoice(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedVoice(e.currentTarget.value);
    }

    function handleStoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedStory(parseInt(e.currentTarget.value));
    }

    function handlePlayOrResume() {
        if (playState === "paused") {
            speechSynthesis.resume();
        } else {
            const utterance = new SpeechSynthesisUtterance(
                stories[selectedStory].content
            );
            for (const voice of speechSynthesis.getVoices()) {
                if (voice.name === selectedVoice) {
                    utterance.voice = voice;
                    break;
                }
            }
            speechSynthesis.speak(utterance);
        }
        setPlayState("playing");
    }

    function handlePause() {
        if (playState === "playing") {
            speechSynthesis.pause();
            setPlayState("paused");
        }
    }

    function handleStop() {
        speechSynthesis.cancel();
        setPlayState("stopped");
    }

    return (
        <div className="container mx-auto flex min-h-screen touch-none select-none flex-col items-center justify-center gap-5 md:gap-10">
            <header>
                <h1 className="text-xl font-bold text-slate-600 underline md:text-3xl">
                    Speech Synthesis!
                </h1>
            </header>
            <main className="container flex flex-col gap-3 md:gap-5">
                {/* Form Section */}
                <form className="flex w-full flex-col items-center justify-start gap-3 md:gap-5">
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600 md:flex-row">
                        <label htmlFor="selectVoice">Select Voice:</label>
                        <select
                            className=" rounded border-2 border-slate-400 p-1 text-sm font-semibold text-slate-600 disabled:border-slate-200 disabled:text-slate-300"
                            title="Select voice"
                            id="selectVoice"
                            onChange={handleChangeVoice}
                            disabled={playState !== "stopped"}
                        >
                            {speechSynthesis.getVoices().map((voice) => (
                                <option key={voice.name} value={voice.name}>{`${
                                    voice.name
                                } (${voice.lang}) ${
                                    voice.default ? "- DEFAULT" : ""
                                }`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600 md:flex-row">
                        <label htmlFor="selectStory">Select Story:</label>
                        <select
                            className=" rounded border-2 border-slate-400 p-1 text-sm font-semibold text-slate-600 disabled:border-slate-200 disabled:text-slate-300"
                            title="Select story"
                            id="selectStory"
                            onChange={handleStoryChange}
                            disabled={playState !== "stopped"}
                        >
                            {stories.map((story, index) => (
                                <option
                                    key={story.id}
                                    value={index}
                                    selected={selectedStory === index}
                                >
                                    {story.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
                {/* Story Image */}
                <section className="mx-auto flex h-40 w-3/4 items-center justify-center rounded-lg border-2 border-slate-200 p-1 md:h-64 md:w-1/3">
                    <img
                        className="max-h-full max-w-full rounded-lg"
                        src={stories[selectedStory].imageUrl}
                        alt={`${stories[selectedStory].title}`}
                    />
                </section>
                {/* Control Section */}
                <section className="mx-auto flex items-center justify-center gap-4 rounded border-2 border-slate-400 px-3 py-1">
                    <h3 className="text-md font-semibold text-slate-600 md:text-xl">
                        Controls:
                    </h3>
                    {/* Play Button */}
                    <button
                        className="rounded-full bg-slate-500 p-2 hover:bg-slate-700 disabled:bg-slate-300"
                        onClick={handlePlayOrResume}
                        disabled={playState === "playing"}
                    >
                        <img
                            className="w-8"
                            src={playIcon}
                            title="play"
                            alt="play"
                        />
                    </button>
                    {/* Pause Button */}
                    <button
                        className="rounded-full bg-slate-500 p-2 hover:bg-slate-700 disabled:bg-slate-300"
                        disabled={playState !== "playing"}
                        onClick={handlePause}
                    >
                        <img
                            className="w-8"
                            src={pauseIcon}
                            title="pause"
                            alt="pause"
                        />
                    </button>
                    {/* Stop Button */}
                    <button
                        className="rounded-full bg-slate-500 p-2 hover:bg-slate-700 disabled:bg-slate-300"
                        disabled={playState === "stopped"}
                        onClick={handleStop}
                    >
                        <img
                            className="w-8"
                            src={stopIcon}
                            title="stop"
                            alt="stop"
                        />
                    </button>
                </section>
                {/* Wave viz */}
                <section
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-neutral-900 md:h-40 md:w-40"
                    title="sound wave indicator"
                >
                    {playState === "playing" ? (
                        <img
                            className="h-full rounded-full"
                            src={waveGif}
                            alt="wave"
                        />
                    ) : (
                        <div className="h-[.1rem] w-full bg-gray-200" />
                    )}
                </section>

                <span
                    className="mx-auto text-lg text-slate-600 md:text-xl"
                    title="play state"
                >
                    {playState}
                </span>
            </main>
        </div>
    );
}

export default App;
