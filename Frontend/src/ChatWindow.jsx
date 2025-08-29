import './ChatWindow.css';
import Chat from './Chat';
import { MyContext } from './MyContext';
import { useContext , useState , useEffect} from 'react';
import { ScaleLoader } from "react-spinners"; 

function ChatWindow() {
    let {prompt , setPrompt,reply , setReply , currThreadId , prevChats , setPrevChats, setNewChat} = useContext(MyContext);
    let [loader, setLoader] = useState(false);

    const getReply = async () => {
        setLoader(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            }),
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const data = await response.json();
            console.log(data.reply);
            setReply(data.reply);
        } catch (err) {
            console.log(err);
        }
        setLoader(false);
    };

    //Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
            [...prevChats, {
                role: "user",
                content: prompt
            }, {
                role: "assistant",
                content: reply
            }]
            ));
        }
        setPrompt("");
    }, [reply]);


    return (
        <div className='chatWindow'>
            <div className="navbar">
                <span>PromptPilot <i className="fa-solid fa-chevron-down fa-xs"></i></span>
                <div className="userIconDiv">
                    <span><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            <Chat></Chat>
            <ScaleLoader color='white' loading={loader}/>

            <div className="chatInput">
                <div className="inputBox">
                    <input type="text" 
                    placeholder='Ask Anything' 
                    value={prompt} 
                    onChange={(e) => {setPrompt(e.target.value); }}
                    onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className='info'>
                    PromptPilot can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;