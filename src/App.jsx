import { Toaster } from "react-hot-toast"
import JKBMSApp from "./components/JKBMSApp"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <JKBMSApp />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  )
}

export default App
