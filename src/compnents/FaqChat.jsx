import React, { useState, useEffect, useRef } from 'react';

// --- Predefined Questions and Answers ---
const qaData = {
    'koi': [
        { q: "What is the Kepler KOI dataset?", a: "The Kepler Object of Interest (KOI) dataset is a public catalog released by NASA containing a list of <strong>potential exoplanet candidates</strong> identified by the Kepler Space Telescope. It's a treasure trove for astronomers and data scientists! 🔭" },
        { q: "What is a 'Kepler Object of Interest' (KOI)?", a: "A KOI is a star that the Kepler telescope observed to have a <strong>periodic dimming</strong> of its light. This dimming, called a <strong>transit</strong>, is a clue that a planet might be passing in front of the star." },
        { q: "How did Kepler detect these KOIs?", a: "Kepler used the <em>transit method</em>. It stared at over 150,000 stars, continuously measuring their brightness. When it detected tiny, brief, and repeating dips in brightness, it flagged the star as a KOI." },
        { q: "Are all KOIs confirmed exoplanets?", a: "<em>No, and this is a crucial point!</em> Each KOI is assigned a status:<br><br><strong>CONFIRMED:</strong> Vetted and confirmed to be a real exoplanet. 🎉<br><strong>CANDIDATE:</strong> The signal looks promising but isn't confirmed.<br><strong>FALSE POSITIVE:</strong> The signal was caused by something else." },
        { q: "What key information is in the dataset?", a: "Some of the most interesting columns include:<ul><li><code>koi_disposition</code>: The status (Confirmed, Candidate, or False Positive).</li><li><code>koi_period</code>: The orbital period in Earth days.</li><li><code>koi_prad</code>: The radius of the planet in Earth radii.</li><li><code>koi_teq</code>: The planet's equilibrium temperature.</li></ul>" },
        { q: "Where can I download the KOI dataset?", a: "The official source is the <strong>NASA Exoplanet Archive</strong>. The data is available in user-friendly formats like CSV.<br><br>➡️ <a href='https://exoplanetarchive.ipac.caltech.edu/docs/data.html' target='_blank' class='text-sky-400 hover:underline'>NASA Exoplanet Archive - Kepler Data</a>" },
    ],
    'tess': [
        { q: "What is the TESS TOI dataset?", a: "The TESS Objects of Interest (TOI) dataset is a public catalog from NASA listing <strong>potential exoplanet candidates</strong> found by the Transiting Exoplanet Survey Satellite (TESS). It's a modern collection of possible new worlds orbiting stars close to us. 🛰️" },
        { q: "How is TESS different from Kepler?", a: "While both use the <strong>transit method</strong>, their strategies differ:<ul><li><strong>Kepler:</strong> Stared at one small patch of the sky.</li><li><strong>TESS:</strong> Scans almost the entire sky, focusing on the <strong>brightest and nearest stars</strong>.</li></ul>" },
        { q: "What kind of data will I find in the TESS dataset?", a: "The TOI catalog includes many parameters, such as:<ul><li><code>toi_id</code>: The unique identifier for the TOI.</li><li><code>tfopwg_disp</code>: The official disposition (Confirmed, Candidate, etc.).</li><li><code>pl_orbper</code>: The orbital period in Earth days.</li><li><code>pl_rade</code>: The radius of the planet.</li></ul>" },
        { q: "Where can I get the TESS data?", a: "The best place to get the latest version is the <strong>NASA Exoplanet Archive</strong>, typically in a simple CSV format.<br><br>➡️ <a href='https://exoplanetarchive.ipac.caltech.edu/docs/data.html' target='_blank' class='text-sky-400 hover:underline'>NASA Exoplanet Archive - TESS Data</a>" },
    ],
    'k2': [
        { q: "What is the K2 dataset?", a: "The K2 dataset is the collection of <strong>potential exoplanet candidates</strong> discovered during the second mission of the Kepler Space Telescope, after a mechanical failure required a new observation strategy. 🔭" },
        { q: "What's the difference between Kepler and K2?", a: "The primary difference is the observation strategy:<ul><li><strong>Original Kepler Mission:</strong> Stared at a single, fixed patch of sky.</li><li><strong>K2 Mission:</strong> Observed different sections of the sky in 'campaigns' lasting about 80 days each.</li></ul>This means K2 looked at a more diverse set of stars." },
        { q: "Are all K2 objects confirmed planets?", a: "<strong>No, they are not.</strong> Every detection must be analyzed. Objects are classified with a disposition status like CONFIRMED, CANDIDATE, or FALSE POSITIVE." },
        { q: "What info is in the K2 dataset?", a: "The K2 dataset contains parameters like:<ul><li><code>pl_name</code>: The official name (e.g., \"K2-18 b\").</li><li><code>disposition</code>: The status of the candidate.</li><li><code>pl_orbper</code>: The orbital period in Earth days.</li><li><code>pl_rade</code>: The planet's radius.</li></ul>" },
    ]
};

const categories = [
    { id: 'koi', label: 'KOI Dataset' },
    { id: 'tess', label: 'TESS Dataset' },
    { id: 'k2', label: 'K2 Dataset' }
];


const FaqChat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! Please select a category and then choose a question from the dropdown below.", sender: 'bot' }
    ]);
    const [currentCategory, setCurrentCategory] = useState('koi');
    const [selectedQuestion, setSelectedQuestion] = useState(qaData['koi'][0].q);
    const [isTyping, setIsTyping] = useState(false);
    const messagesContainerRef = useRef(null);

    // Effect to auto-scroll to the bottom when new messages are added
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Effect to update the selected question when the category changes
    useEffect(() => {
        if (qaData[currentCategory]?.length > 0) {
            setSelectedQuestion(qaData[currentCategory][0].q);
        }
    }, [currentCategory]);

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedQuestion) return;

        // 1. Add the user's question to the chat
        const userMessage = { id: Date.now(), text: selectedQuestion, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // 2. Find the corresponding answer
        const answer = qaData[currentCategory].find(item => item.q === selectedQuestion)?.a;

        // 3. Simulate bot typing and then display the answer
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            if (answer) {
                const botMessage = { id: Date.now() + 1, text: answer, sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
            }
        }, 800); // 0.8-second delay
    };

    return (
        // Main container with background image and blur
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('./public/1.jpeg')" }}>
            <div className="absolute inset-0 backdrop-blur-md"></div>
            
            {/* Chat Wrapper with Glassmorphism Effect */}
            <div className="relative w-full max-w-lg h-[80vh] max-h-[700px] bg-gradient-to-br from-sky-500/20 to-fuchsia-700/20 p-1 rounded-3xl border border-sky-500/40 shadow-2xl">
                
                {/* Main Chat Container */}
                <div className="w-full h-full bg-[#000022] text-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-inner shadow-black/40">
                    
                    {/* Category Selector Header */}
                    <div className="flex justify-around p-3 border-b border-white/10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`flex-grow py-2.5 px-4 mx-1.5 rounded-lg text-sm font-medium transition-all duration-300 border ${
                                    currentCategory === cat.id
                                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/30'
                                    : 'bg-[#000033] text-gray-400 border-[#333344] hover:border-sky-500'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Messages Area */}
                    <div ref={messagesContainerRef} className="flex-1 p-5 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[80%] inline-block px-4 py-2.5 rounded-2xl leading-relaxed ${
                                    msg.sender === 'user'
                                        ? 'bg-sky-500 text-white rounded-br-lg'
                                        : 'bg-gray-800 text-gray-200 rounded-bl-lg'
                                    }`}
                                    // Use dangerouslySetInnerHTML because our static data contains HTML tags
                                    dangerouslySetInnerHTML={{ __html: msg.text }}
                                />
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex flex-col items-start">
                                <div className="max-w-[80%] inline-block px-4 py-2.5 rounded-2xl rounded-bl-lg bg-gray-800 text-gray-400 italic">
                                    Bot is typing...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex items-center p-4 border-t border-white/10">
                        <select
                            value={selectedQuestion}
                            onChange={(e) => setSelectedQuestion(e.target.value)}
                            className="flex-1 p-2.5 pr-8 border border-[#333344] rounded-full outline-none text-base bg-[#000033] text-white cursor-pointer appearance-none focus:ring-2 focus:ring-sky-500"
                        >
                            {qaData[currentCategory]?.map((item, index) => (
                                <option key={index} value={item.q}>{item.q}</option>
                            ))}
                        </select>
                        <button type="submit" className="ml-2.5 py-2.5 px-5 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#000022]">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FaqChat;