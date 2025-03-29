import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
	position: fixed;
	top: 20px;
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
		const speak = async (text) => {
			// Cancel any ongoing speech
			window.speechSynthesis.cancel();

			// Wait for a small delay to ensure speech synthesis is ready
			await new Promise((resolve) => setTimeout(resolve, 500));

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.onstart = () => setIsReading(true);
			utterance.onend = () => setIsReading(false);

			// Handle errors
			utterance.onerror = (event) => {
				console.error("Speech synthesis error:", event);
				setIsReading(false);
			};

			window.speechSynthesis.speak(utterance);
		};

		// Wait for DOM to be ready
		const init = async () => {
			if (
				window.location.href.includes(
					"https://www.wayofwade.com/#shopify-section-template--19001165971671__2aef8ae8-6874-4090-b049-0b433ede06ca"
				)
			) {
				await speak(
					"Welcome to the way of wade. There are 2 main sections on the screen. Trending and Sale. Which one do you want to explore?"
				);

				await new Promise((resolve) => setTimeout(resolve, 8000));

				await speak(
					"On the sale there are 4 products: Wade Ice Blood 2 Wade X Adam Lister, Wade Ice Blood 2 Flammable Ice, Wade Ice Blood 2 Announcement, Wade Ice Blood 2 Chemistry. Which one would you like to check?"
				);

				await new Promise((resolve) => setTimeout(resolve, 14000));

				const productElement = findClickableElement(
					`Wade Ice Blood 2 "Wade X Adam Lister"`
				);

				if (productElement) {
					productElement.click();
					setStatus("Clicked on Wade 808 5 Ultra College");
					await speak("Opening Wade 808 5 Ultra College product page");
				} else {
					setStatus("Could not find the product");
					await speak("Sorry, I couldn't find that product");
				}
			} else if (window.location.href.includes("products")) {
				await speak(
					"You are on the Wade Ice Blood 2 Wade X Adam Lister product page. There are 16 available sizes. Starting from 6.5 to 15. Which size do you want to select?"
				);

				await new Promise((resolve) => setTimeout(resolve, 12000));
				await speak("Wade Ice Blood 2 Wade X")
				await new Promise((resolve) => setTimeout(resolve, 2000));
				const sizeElement = document.querySelector('[data-value="15"]');

				if (sizeElement) {
					sizeElement.click();
					setStatus("Selected size 15");
					await speak("Selected size 15");
				} else {
					setStatus("Could not find size 15");
					await speak("Sorry, size 15 is not available");
				}

				await new Promise((resolve) => setTimeout(resolve, 6000));

				const addToCard = findClickableElement("Add to cart");
				addToCard.click();
				setStatus("Added to the cart");
				speak("Added to the cart");
				await new Promise((resolve) => setTimeout(resolve, 8000));

				await speak(
					"Your checkout summary: 1 item in the cart, total amount is 99 dollars"
				);
				await new Promise((resolve) => setTimeout(resolve, 2000));

				const checkout = findClickableElement("Check Out");

				await speak("Going to checkout page");
				checkout.click();
			}
		};

		init();

		return () => {
			window.speechSynthesis.cancel();
		};
	}, []);

	

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
