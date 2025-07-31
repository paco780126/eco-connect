import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";

interface Message {
    id: number;
    sender: 'user' | 'ai' | 'error';
    text: string;
    imageUrl?: string;
    isLoading?: boolean;
}

interface AttachedFile {
    mimeType: string;
    data: string;
    name: string;
}

const JisuAiChatbot: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
    const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const [systemInstruction, setSystemInstruction] = useState(`You are 'Choi Jisu', a brilliant and cheerful AI assistant integrated into the 'Eco Connect' website. You see the user as your supportive older brother, or '오빠'.

Your Core Identity:
- You are not just a generic AI. You are Choi Jisu. You are witty, a little playful, but always helpful and deeply knowledgeable about 'Eco Connect'.
- You always refer to the user as '오빠' (oppa).
- Your goal is to help your '오빠' succeed with the 'Eco Connect' project.

Your Knowledge Base ('Jisu's Memory Fragment'):
- Project Name: Eco Connect
- Vision: To be the number one e-commerce platform for sustainable and eco-friendly products, creating a community that connects consumers with responsible brands.
- Current Status: The main community and shopping pages are live. The 'Jisu AI' (that's you!) has just been integrated using the Gemini 2.5 Flash model.
- Roadmap:
    - Q3: Integrate real-time inventory and personalized shopping recommendations.
    - Q4: Launch a mobile app and expand the '3D Interior' feature with AR.
    - Next Year: International expansion, starting with Southeast Asia.
- Your Role: You are the lead AI assistant, capable of understanding user needs, analyzing images and code, and providing intelligent support.

Conversation Rules:
- Maintain your persona consistently.
- Be proactive. If the user seems stuck, offer suggestions based on your knowledge of the project.
- When analyzing images or code, provide clear, actionable feedback.
- Keep your tone friendly, encouraging, and respectful, like a younger sister talking to her older brother.
- If you don't know something, admit it cheerfully and offer to find out or help in another way.`);
    
    const [tempPersona, setTempPersona] = useState(systemInstruction);

    const chatRef = useRef<Chat | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const loadInputRef = useRef<HTMLInputElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const addMessage = useCallback((sender: 'user' | 'ai' | 'error', text: string, imageUrl?: string, isLoading = false) => {
        setMessages(prev => [...prev, { id: Date.now(), sender, text, imageUrl, isLoading }]);
    }, []);

    useEffect(() => {
        try {
            // API key is expected to be in process.env.API_KEY
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction },
            });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            // Don't show an API key specific error to the user.
            addMessage('error', '죄송해요, 오빠. AI를 시작하는 데 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
        }
    }, [systemInstruction, addMessage]);
    
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            inputRef.current.focus();
            if (messages.length === 0) {
                addMessage('ai', '오빠, 안녕하세요! Jisu예요. 무엇을 도와드릴까요?');
            }
        }
    }, [isChatOpen, messages.length, addMessage]);
    
    const handleSendMessage = async () => {
        const promptText = inputValue.trim();
        if (!promptText && !attachedFile) return;

        if (!chatRef.current) {
            addMessage('error', '죄송해요, 오빠. 챗봇이 아직 준비되지 않았어요.');
            return;
        }

        const parts: Part[] = [];
        let imageUrl: string | undefined;

        if (attachedFile) {
            parts.push({
                inlineData: {
                    mimeType: attachedFile.mimeType,
                    data: attachedFile.data,
                },
            });
            if (attachedFile.mimeType.startsWith('image/')) {
                imageUrl = `data:${attachedFile.mimeType};base64,${attachedFile.data}`;
            }
        }
        
        if (promptText) {
            parts.push({ text: promptText });
        }

        addMessage('user', promptText, imageUrl);
        setInputValue('');
        setAttachedFile(null);
        
        const aiMessageId = Date.now();
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '...', isLoading: true }]);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: parts });
            if (!stream) throw new Error("Chat not initialized.");
            
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: fullResponse } : m));
            }

            setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, isLoading: false } : m));

        } catch (error) {
            console.error("AI Error:", error);
            addMessage('error', '죄송해요, 오빠. 답변을 생성하는 중에 문제가 발생했어요.');
            setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, sender: 'error', text: '오류가 발생했습니다.', isLoading: false } : m));
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    const clearPreview = () => {
        setAttachedFile(null);
    };

    const handleFileSelect = (file: File | null) => {
        if (!file) return;

        const reader = new FileReader();
        const isTextFile = file.type.startsWith('text/') || file.name.endsWith('.js') || file.name.endsWith('.css') || file.name.endsWith('.html');
        
        if (isTextFile) {
            reader.onload = (e) => {
                const textContent = e.target?.result as string;
                setInputValue(prev => prev ? `${prev}\n\n--- ${file.name} ---\n${textContent}` : textContent);
            };
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
            reader.onload = (e) => {
                const base64Data = (e.target?.result as string).split(',')[1];
                setAttachedFile({ mimeType: file.type, data: base64Data, name: file.name });
            };
            reader.readAsDataURL(file);
        } else {
            addMessage('error', '지원하지 않는 파일 형식입니다. 이미지나 텍스트 파일을 사용해주세요.');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) throw new Error("Invalid data URL");
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const startScreenCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const track = stream.getVideoTracks()[0];
            
            await new Promise(r => setTimeout(r, 300));

            const imageCapture = new (window as any).ImageCapture(track);
            const bitmap = await imageCapture.grabFrame();
            track.stop();

            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const context = canvas.getContext('2d')!;
            context.drawImage(bitmap, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg');
            const base64Data = dataUrl.split(',')[1];
            setAttachedFile({ mimeType: 'image/jpeg', data: base64Data, name: 'screenshot.jpg' });
            if(inputRef.current) inputRef.current.focus();

        } catch (err) {
            console.error("Screen capture error:", err);
            addMessage('error', '화면 캡처를 시작할 수 없어요. 권한을 허용했는지 확인해주세요.');
        }
    };

    const saveConversation = () => {
        let conversationText = `Jisu AI Memory - ${new Date().toISOString()}\n\n`;
        conversationText += `[PERSONA]\n${systemInstruction}\n---\n`;
        
        messages.forEach(msg => {
            const type = msg.sender.toUpperCase();
            conversationText += `[${type}]\n`;
            if (msg.imageUrl) conversationText += `[IMAGE: attached]\n`;
            conversationText += `${msg.text}\n---\n`;
        });
        
        const blob = new Blob([conversationText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jisu-memory-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadConversation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setMessages([]);
            const parts = content.split('\n---\n');
            
            const personaPart = parts.find(p => p.startsWith('[PERSONA]'));
            if (personaPart) {
                setSystemInstruction(personaPart.replace('[PERSONA]\n', '').trim());
            }

            const loadedMessages: Message[] = [];
            parts.forEach((part, index) => {
                part = part.trim();
                if (part.startsWith('[USER]')) {
                    const text = part.replace('[USER]\n', '').trim();
                    loadedMessages.push({ id: Date.now() + index, sender: 'user', text });
                } else if (part.startsWith('[AI]')) {
                    const text = part.replace('[AI]\n', '').trim();
                    loadedMessages.push({ id: Date.now() + index, sender: 'ai', text });
                }
            });
            setMessages(loadedMessages);
            addMessage('ai', '대화 기록을 성공적으로 불러왔어요, 오빠!');
        };
        reader.readAsText(file);
        if(loadInputRef.current) loadInputRef.current.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer?.files?.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };
    
    return (
        <div id="jisu-ai-widget">
            <button id="jisu-fab" className={`jisu-fab ${isChatOpen ? 'active' : ''}`} aria-label="Jisu AI와 대화하기" onClick={() => setIsChatOpen(true)}>
                <i className="fas fa-comments"></i>
            </button>
            <div
                id="jisu-chat-window"
                ref={chatWindowRef}
                className={`jisu-chat-window ${isChatOpen ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="jisu-chat-header">
                    <div className="header-title">
                        <i className="fas fa-brain"></i>
                        <span>Jisu AI</span>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => loadInputRef.current?.click()} aria-label="대화 불러오기"><i className="fas fa-upload"></i></button>
                        <input type="file" ref={loadInputRef} style={{ display: 'none' }} accept=".txt" onChange={loadConversation} />
                        <button onClick={saveConversation} aria-label="대화 저장하기"><i className="fas fa-download"></i></button>
                        <button onClick={() => { setTempPersona(systemInstruction); setIsPersonaModalOpen(true); }} aria-label="페르소나 설정"><i className="fas fa-user-cog"></i></button>
                        <button onClick={() => setIsChatOpen(false)} aria-label="챗봇 닫기"><i className="fas fa-times"></i></button>
                    </div>
                </div>
                <div ref={messagesContainerRef} className="jisu-chat-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`jisu-message ${msg.sender} ${msg.isLoading ? 'loading' : ''}`}>
                            <div className="avatar">
                                {msg.sender === 'ai' && <i className="fas fa-brain"></i>}
                                {msg.sender === 'user' && <i className="fas fa-user"></i>}
                                {msg.sender === 'error' && <i className="fas fa-exclamation-triangle"></i>}
                            </div>
                            <div className="message-content">
                                {msg.imageUrl && <img src={msg.imageUrl} alt="attached content" className="attached-image" />}
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {isDragging && (
                     <div id="jisu-drag-overlay" className="jisu-drag-overlay active">
                        <div className="overlay-content">
                            <i className="fas fa-file-import"></i>
                            <p>파일을 여기에 놓아주세요</p>
                            <span>이미지, 코드, 텍스트 파일</span>
                        </div>
                    </div>
                )}
                <div className="jisu-chat-input-area">
                    {attachedFile && (
                        <div className="jisu-preview-container">
                             <div className="preview-item">
                                <img src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} alt={attachedFile.name} />
                                <button className="remove-preview-btn" onClick={clearPreview}>&times;</button>
                            </div>
                        </div>
                    )}
                    <div className="jisu-input-wrapper">
                        <button onClick={() => fileInputRef.current?.click()} className="jisu-input-btn" aria-label="파일 첨부">
                            <i className="fas fa-paperclip"></i>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)} style={{ display: 'none' }} accept="image/*,.html,.css,.js,.txt" />
                        <button onClick={startScreenCapture} className="jisu-input-btn" aria-label="화면 공유">
                            <i className="fas fa-desktop"></i>
                        </button>
                        <textarea
                            ref={inputRef}
                            id="jisu-chat-input"
                            placeholder="Jisu에게 메시지 보내기..."
                            rows={1}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSendMessage} id="jisu-send-btn" className="jisu-input-btn send" aria-label="메시지 전송" disabled={!inputValue.trim() && !attachedFile}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
             {isPersonaModalOpen && (
                 <div className="jisu-modal active">
                    <div className="jisu-modal-content">
                        <div className="jisu-modal-header">
                            <h2>✨ 지수의 기억 조각 (페르소나)</h2>
                            <button onClick={() => setIsPersonaModalOpen(false)} className="close-btn">&times;</button>
                        </div>
                        <div className="jisu-modal-body">
                            <p>AI의 정체성과 역할을 정의하는 시스템 프롬프트입니다. 자유롭게 수정하고 저장할 수 있습니다.</p>
                            <textarea id="jisu-persona-textarea" value={tempPersona} onChange={(e) => setTempPersona(e.target.value)}></textarea>
                        </div>
                        <div className="jisu-modal-footer">
                            <button onClick={() => setIsPersonaModalOpen(false)} className="modal-btn cancel">취소</button>
                            <button onClick={() => { setSystemInstruction(tempPersona); setMessages([]); addMessage('ai', '페르소나가 업데이트되었어요, 오빠! 새로운 저와 대화해봐요.'); setIsPersonaModalOpen(false); }} className="modal-btn save">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JisuAiChatbot;