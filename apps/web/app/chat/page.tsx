"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { API } from "@/lib/api"

export default function ChatPage() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!prompt) return
    setLoading(true)
    const res = await API.chat(prompt)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Chat with Data</h2>
      <div className="flex gap-2">
        <Input placeholder="Ask something about your data..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Analyzing..." : "Send"}
        </Button>
      </div>

      {result && (
        <div className="border rounded-lg p-4 space-y-3">
          <p className="text-sm text-muted-foreground font-mono">SQL: {result.sql}</p>
          <pre className="bg-muted/10 p-2 rounded text-sm overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
