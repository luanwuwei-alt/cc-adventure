import Foundation

// Configuration
let gameDir = "/Users/theodore/mario-game"
let nodeBin = "/Users/theodore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
let viteBin = gameDir + "/node_modules/vite/bin/vite.js"
let port = 8800
let urlStr = "http://localhost:\(port)/"
let pidFile = "/tmp/cc-vite.pid"
let logFile = "/tmp/cc-vite.log"

// Check if server is running
func serverRunning() -> Bool {
    guard let url = URL(string: urlStr) else { return false }
    let semaphore = DispatchSemaphore(value: 0)
    var running = false
    let task = URLSession.shared.dataTask(with: url) { _, response, error in
        if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
            running = true
        }
        semaphore.signal()
    }
    task.resume()
    _ = semaphore.wait(timeout: .now() + 2)
    return running
}

// Check if server is already running
if serverRunning() {
    // Just open browser
    if let url = URL(string: urlStr) {
        NSWorkspace.shared.open(url)
    }
    exit(0)
}

// Build the game if dist doesn't exist
let distPath = gameDir + "/dist"
var distExists: Bool {
    return FileManager.default.fileExists(atPath: distPath + "/index.html")
}
if !distExists {
    let buildTask = Process()
    buildTask.executableURL = URL(fileURLWithPath: nodeBin)
    buildTask.arguments = [viteBin, "build"]
    buildTask.currentDirectoryURL = URL(fileURLWithPath: gameDir)
    buildTask.standardOutput = FileHandle.nullDevice
    buildTask.standardError = FileHandle.nullDevice
    try? buildTask.run()
    buildTask.waitUntilExit()
}

// Start Vite
let task = Process()
task.executableURL = URL(fileURLWithPath: nodeBin)
task.arguments = [viteBin, "--port", String(port)]
task.currentDirectoryURL = URL(fileURLWithPath: gameDir)

// Redirect output to log file
FileManager.default.createFile(atPath: logFile, contents: nil)
if let handle = FileHandle(forWritingAtPath: logFile) {
    task.standardOutput = handle
    task.standardError = handle
}

try? task.run()

// Save PID
try? "\(task.processIdentifier)".write(toFile: pidFile, atomically: true, encoding: .utf8)

// Wait for server to be ready (up to 10 seconds)
for _ in 1...20 {
    if serverRunning() { break }
    Thread.sleep(forTimeInterval: 0.5)
}

// Open browser
if let url = URL(string: urlStr) {
    NSWorkspace.shared.open(url)
}

// Done - exit. Vite continues running as orphan process.
exit(0)
