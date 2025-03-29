import React, { useState, useEffect } from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
	position: fixed;
	bottom: 20px;
	right: 20px;
	background: rgba(20, 20, 30, 0.9);
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(66, 133, 244, 0.2);
	padding: 20px;
	z-index: 1000;
	min-width: 220px;
	backdrop-filter: blur(8px);
	border: 1px solid rgba(66, 133, 244, 0.2);
	color: white;
	transition: all 0.3s ease;
`;
const WaveContainer = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40px;
	overflow: hidden;
	opacity: ${(props) => (props.isSpeaking ? 1 : 0)};
	transition: opacity 0.3s ease;
	border-radius: 0 0 16px 16px;
	display: flex;
	gap: 8px;
	padding: 0 10px;
	display: flex;
	align-items: end;
`;

const Wave = styled.div`
	position: relative;
	width: 16px;
	height: 100%;
	background: rgba(66, 133, 244, 0.3);
	border-radius: 2px;
	animation: seaWave 1.2s ease-in-out infinite;
	transform-origin: bottom;

	&:nth-child(2n) {
		animation-delay: 0.2s;
		background: rgba(66, 133, 244, 0.4);
	}

	&:nth-child(3n) {
		animation-delay: 0.4s;
		background: rgba(66, 133, 244, 0.5);
	}

	&:nth-child(4n) {
		animation-delay: 0.6s;
		background: rgba(66, 133, 244, 0.3);
	}

	@keyframes seaWave {
		0%,
		100% {
			height: 20%;
		}
		50% {
			height: 100%;
		}
	}
`;

const StatusIndicator = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: ${(props) => (props.isListening ? "#4CAF50" : "#ff4444")};
	position: absolute;
	top: 15px;
	right: 15px;
	box-shadow: 0 0 10px ${(props) => (props.isListening ? "#4CAF50" : "#ff4444")};
	animation: ${(props) => (props.isListening ? "pulse 2s infinite" : "none")};

	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
			box-shadow: 0 0 10px currentColor;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
			box-shadow: 0 0 20px currentColor;
		}
		100% {
			transform: scale(1);
			opacity: 1;
			box-shadow: 0 0 10px currentColor;
		}
	}
`;

const Status = styled.div`
	margin: 10px 0;
	color: rgba(255, 255, 255, 0.9);
	font-size: 14px;
	text-align: center;
	font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
	letter-spacing: 0.5px;
`;

const VoiceControl = () => {
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [recognition, setRecognition] = useState(null);
	const [status, setStatus] = useState("Initializing...");
	const [lastCommand, setLastCommand] = useState("");
	const [isReading, setIsReading] = useState(false);
	useEffect(() => {
		let recognitionInstance = null;
		if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
			const recognitionInstance = new (window.SpeechRecognition ||
				window.webkitSpeechRecognition)();
			recognitionInstance.continuous = true;
			recognitionInstance.interimResults = true;
			recognitionInstance.lang = "en-US";

			recognitionInstance.onstart = () => {
				setIsListening(true);
				console.log("rerender");
				setStatus("Listening...");
			};

			recognitionInstance.onend = () => {
				setIsListening(false);
				setIsSpeaking(false);

				setStatus("Ready");
			};

			recognitionInstance.onresult = (event) => {
				const transcript =
					event.results[event.results.length - 1][0].transcript.toLowerCase();

				if (transcript.includes("enter")) {
					executeCommand(transcript);
					setLastCommand(transcript);
					setIsReading(false);
					setStatus("Executing command...");
				} else {
					setStatus(`Heard: ${transcript}`);
				}
			};

			recognitionInstance.onerror = (event) => {
				console.error("Speech recognition error:", event.error);
				setStatus(`Error: ${event.error}`);
				setIsListening(false);
			};

			recognitionInstance.onaudiostart = () => {
				setIsListening(true);
			};

			recognitionInstance.onaudioend = () => {
				setIsSpeaking(false);
			};

			recognitionInstance.onspeechstart = () => {
				setIsSpeaking(true);
			};

			recognitionInstance.onspeechend = () => {
				setIsSpeaking(false);
			};

			setRecognition(recognitionInstance);
		} else {
			setStatus("Speech recognition not supported in this browser");
		}

		return () => {
			if (recognitionInstance) {
				recognitionInstance.stop();
				recognitionInstance.abort();
				setRecognition(null);
			}
		};
	}, []);

	const executeCommand = (command) => {
		console.log("Executing command:", command);

		if (command.includes("scroll down")) {
			window.scrollBy(0, 300);
			setStatus("Scrolling down...");
		} else if (command.includes("scroll up")) {
			window.scrollBy(0, -300);
			setStatus("Scrolling up...");
		} else if (command.includes("top")) {
			window.scrollTo(0, 0);
			setStatus("Scrolling to top...");
		} else if (command.includes("bottom")) {
			window.scrollTo(0, document.body.scrollHeight);
			setStatus("Scrolling to bottom...");
		} else if (command.includes("click")) {
			const element = command.split("click")[1].trim();
			const targetElement = findClickableElement(element);

			if (targetElement) {
				targetElement.click();
				setStatus(`Clicked ${element}`);
			} else {
				setStatus(`Could not find element: ${element}`);
			}
		}
	};

	useEffect(() => {
		const toggleListening = async () => {
			if (!recognition) return;
			console.log(recognition);
			await navigator.mediaDevices.getUserMedia({ audio: true });
			recognition.start();
		};
		toggleListening();
	}, [recognition]);

	const findClickableElement = (text) => {
		// First try exact match
		const elements = Array.from(
			document.querySelectorAll("button, a, div[role='button'], [tabindex='0']")
		);
		const exactMatch = elements.find(
			(el) => el.textContent.trim() === text.trim()
		);

		if (exactMatch) return exactMatch;

		// If no exact match, try contains
		return elements.find(
			(el) =>
				el.textContent.toLowerCase().includes(text.toLowerCase()) ||
				el.getAttribute("title")?.toLowerCase().includes(text.toLowerCase()) ||
				el
					.getAttribute("aria-label")
					?.toLowerCase()
					.includes(text.toLowerCase())
		);
	};


	useEffect(() => {
    const speak = async (text) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Wait for a small delay to ensure speech synthesis is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        // Handle errors
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
    };
    
    // Wait for DOM to be ready
    const init = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (window.location.href.includes(
            "https://www.wayofwade.com/#shopify-section-template--19001165971671__2aef8ae8-6874-4090-b049-0b433ede06ca"
        )) {
            speak(
                "Welcome to the way of wade. There are 2 main sections on the screen. Trending and Sale. Which one do you want to explore?"
            );
        } else if (window.location.href.includes("https://www.wayofwade.com/products/wade-ice-blood-2-wade-x-adam-lister?variant=45615779709143")) {
            speak(
                "You are on the Wade Ice Blood 2 Wade X Adam Lister product page. There are 16 available sizes. Starting from 6.5 to 15. Which size do you want to select?"
            );
        }
    };

    init();

    return () => {
        window.speechSynthesis.cancel();
    };
}, []);
	useEffect(() => {
		if (isReading) {
			return;
		}
		console.log("not reading");

		const speak = async (text) => {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.onstart = () => setIsSpeaking(true);
			utterance.onend = () => setIsSpeaking(false);
			window.speechSynthesis.speak(utterance);
		};

		// Welcome message when component mounts
		if (lastCommand.includes("sale")) {
			speak(
				"On the sale there are 4 products: Wade Ice Blood 2 Wade X Adam Lister, Wade Ice Blood 2 Flammable Ice, Wade Ice Blood 2 Announcement, Wade Ice Blood 2 Chemistry"
			);
			setLastCommand("");
			setIsReading(true);
		}

		if (lastCommand.includes("trending")) {
			speak(
				"On the trending there are 4 products: Wade 808 5 Ultra College, Wade 808 5 Ultra Birthday, Wade 808 5 Ultra Yin Yang, Way of Wade 11 X Staple Retro Card"
			);
			setLastCommand("");
			setIsReading(true);
		}

		if (lastCommand.includes("first")) {
			const productElement = findClickableElement("Wade Ice Blood 2");
			if (productElement) {
				productElement.click();
				setStatus("Clicked on Wade 808 5 Ultra College");
				speak("Opening Wade 808 5 Ultra College product page");
			} else {
				setStatus("Could not find the product");
				speak("Sorry, I couldn't find that product");
			}
			setLastCommand("");
			setIsReading(true);
		}

		if (lastCommand.includes("15")) {
			// Look for element with data-value="15"
			const sizeElement = document.querySelector('[data-value="15"]');
			if (sizeElement) {
				sizeElement.click();
				setStatus("Selected size 15");
				speak("Selected size 15");
			} else {
				setStatus("Could not find size 15");
				speak("Sorry, size 15 is not available");
			}
			setLastCommand("");
			setIsReading(true);
		}

		if (lastCommand.includes("add product")) {
			// Look for element with data-value="15"
			const addToCard = findClickableElement("Add to cart");
			if (addToCard) {
				addToCard.click();
				setStatus("Added to the cart");
				speak("Added to the cart");
				 new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
					speak("Your checkout summary: 1 item in the cart, total amount is 99 dollars");
				 });

				
			} else {
				setStatus("Could not add to the cart");
				speak("Sorry, could not add to the cart");
			}
			setLastCommand("");
			setIsReading(true);
		}

		if (lastCommand.includes("checkout") || lastCommand.includes("check out")) {
			// Look for element with data-value="15"
			const checkout = findClickableElement("Check Out");
			if (checkout) {
				setStatus("Proceeding to checkout page");
				speak("Going to checkout page");
				checkout.click();
		

				
			} else {
				setStatus("Could not go to checkout");
				speak("Sorry, could not go to checkout");
			}
			setLastCommand("");
			setIsReading(true);
		}
		// return () => {
		// 	// Cleanup if needed
		// 	window.speechSynthesis.cancel();
		// }

		// ... rest of your existing useEffect code for recognition
	}, [lastCommand, isReading]);

	return (
		<PopupContainer>
			<StatusIndicator isListening={isListening} />
			<Status>{status}</Status>
			<WaveContainer isSpeaking={isSpeaking}>
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
				<Wave />
			</WaveContainer>
		</PopupContainer>
	);
};

export default React.memo(VoiceControl);
