import { useState } from 'react'
import { sendChatMessage } from '../api/client'
import AppNavbar from '../components/AppNavbar'

function Chatbot() {
    const [chatInput, setChatInput] = useState('')
    const [chatReply, setChatReply] = useState('Ask me about watering, low light, or pet-safe picks.')
    const [chatLoading, setChatLoading] = useState(false)

    async function handleChatSubmit(event) {
        event.preventDefault()
        if (!chatInput.trim()) return
        setChatLoading(true)
        try {
            const reply = await sendChatMessage(chatInput)
            setChatReply(reply || 'I can help with care tips and plant picks.')
        } catch {
            setChatReply('The assistant is currently unavailable, please try again shortly.')
        } finally {
            setChatLoading(false)
            setChatInput('')
        }
    }

    return (
        <>
            <AppNavbar />
            <main>
                <section className="py-5 bg-success-subtle">
                    <div className="container-fluid px-5">
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                    <h1 className="fw-bold mb-3">Plant assistant</h1>
                                    <p className="text-secondary mb-0">Ask simple care questions and get quick guidance from Plantiz.</p>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <div className="p-3 rounded-3 bg-light mb-3 border">
                                        <p className="mb-0">{chatReply}</p>
                                    </div>
                                    <form onSubmit={handleChatSubmit} className="d-flex gap-2 flex-wrap">
                                        <input className="form-control" placeholder="How often should I water this plant?" value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
                                        <button className="btn btn-success rounded-4" type="submit" disabled={chatLoading}>{chatLoading ? 'Thinking...' : 'Ask'}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Chatbot
