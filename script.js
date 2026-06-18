document.getElementById('summarizeBtn').addEventListener('click', async () => {
    const transcript = document.getElementById('transcriptInput').value.trim();
    
    if (!transcript) {
        alert("Bhai, pehle transcript toh paste karo!");
        return;
    }

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('outputSection').classList.add('hidden');

    try {
        const response = await fetch('http://localhost:8080/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: transcript })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('summaryText').innerText = data.summary;
            
            const listContainer = document.getElementById('actionItemsList');
            listContainer.innerHTML = '';
            data.actionItems.forEach(item => {
                const li = document.createElement('li');
                li.innerText = `✔️ ${item}`;
                listContainer.appendChild(li);
            });

            document.getElementById('outputSection').classList.remove('hidden');
        } else {
            alert("Backend se connect karne me lafda hua!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server network error! Pehle Java backend chalu karo.");
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
});


document.getElementById('copyBtn').addEventListener('click', () => {
    const summary = document.getElementById('summaryText').innerText;
    
    const items = [];
    document.querySelectorAll('#actionItemsList li').forEach(li => items.push(li.innerText));
    
    const fullText = `📊 SUMMARY:\n${summary}\n\n✔️ ACTION ITEMS:\n${items.join('\n')}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.innerText = "✅ Copied!";
        setTimeout(() => { copyBtn.innerText = "📋 Copy Full Brief"; }, 2000);
    }).catch(err => {
        alert("Copy karne me dikkat hui: ", err);
    });
});
