document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatBox = document.getElementById("chatBox");
  const promptInput = document.getElementById("promptInput");
  const fileInput = document.getElementById("fileInput");
  const themeToggle = document.getElementById("themeToggle");

  let currentTab = "gpt";

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // Tab switch
  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      chatBox.innerHTML = "";
      promptInput.value = "";
      if (currentTab === "about") {
        showAbout();
        chatForm.style.display = "none";
      } else {
        chatForm.style.display = "flex";
      }
    });
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = promptInput.value;
    const file = fileInput.files[0];

    addBubble("🧑 Kamu", text);
    promptInput.value = "";

    try {
      if (currentTab === "ghibli" && file) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("https://api.siputzx.my.id/api/image2ghibli", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        addBubble("🎨 Ghibli", `<img src="${data.result}" width="300"/>`);
        return;
      }

      const endpointMap = {
        gpt: "api/ai/gpt",
        gemini: "api/ai/gemini-pro",
        llama: "api/ai/llama33",
        deepseek: "api/ai/deepseek",
      };

      const apiUrl = `https://api.siputzx.my.id/${endpointMap[currentTab]}?text=${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      const output = data.result || data.response || "Tidak ada respons.";
      addBubble("🤖 AI", renderMarkdown(output));
    } catch (err) {
      addBubble("⚠️ Error", "Terjadi kesalahan koneksi.");
    }
  });

  function addBubble(sender, message) {
    const div = document.createElement("div");
    div.className = "chat-bubble";
    div.innerHTML = `<strong>${sender}:</strong><br>${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showAbout() {
    const about = `
      <div class="chat-bubble">
        <strong>🧾 Tentang Project:</strong><br>
        G4NGGAAA AI adalah web sederhana menggunakan berbagai API AI dari <a href="https://api.siputzx.my.id" target="_blank">siputzx.my.id</a>.<br><br>
        📌 Fitur:<br>
        - GPT Chat<br>
        - Gemini Pro<br>
        - LLaMA 3.3B<br>
        - DeepSeek AI coder<br>
        - Ghibli image generator<br><br>
        🔧 Dibuat oleh <strong>G4NGGAAA</strong> - 2025
      </div>`;
    chatBox.innerHTML = about;
  }

  function renderMarkdown(text) {
    return text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code>${escapeHTML(code)}</code></pre>`
    );
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[c]));
  }
});
