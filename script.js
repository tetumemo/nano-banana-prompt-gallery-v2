document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.getElementsByClassName('close')[0];

    // プロンプトカードを生成して表示
    if (typeof prompts !== 'undefined' && Array.isArray(prompts)) {
        prompts.forEach(item => {
            const card = createCard(item);
            galleryGrid.appendChild(card);
        });
    } else {
        console.error('Data source (prompts) is not defined.');
        galleryGrid.innerHTML = '<p style="text-align:center; width:100%;">データの読み込みに失敗しました。</p>';
    }

    // カード生成関数
    function createCard(item) {
        const card = document.createElement('article');
        card.className = 'card';

        // 画像エリア
        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-image-container';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.className = 'card-image';
        img.loading = 'lazy'; // 遅延読み込み

        // 画像クリックイベント（モーダル表示）
        imgContainer.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = item.image;
        });

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        // コンテンツエリア
        const content = document.createElement('div');
        content.className = 'card-content';

        // タイトル
        const title = document.createElement('h2');
        title.className = 'card-title';
        title.textContent = item.title;
        content.appendChild(title);

        // プロンプトコードブロック
        const pre = document.createElement('div');
        pre.className = 'prompt-block';
        const code = document.createElement('pre');
        const codeInner = document.createElement('code');
        codeInner.textContent = item.prompt;
        code.appendChild(codeInner);
        pre.appendChild(code);
        content.appendChild(pre);

        // コピーボタン
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = '📋 プロンプトをコピー';

        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(item.prompt);
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ コピーしました！';
                btn.classList.add('copied');

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Copy failed:', err);
                btn.innerHTML = '❌ 失敗しました';
                setTimeout(() => {
                    btn.innerHTML = '📋 プロンプトをコピー';
                }, 2000);
            }
        });

        content.appendChild(btn);
        card.appendChild(content);

        return card;
    }

    // モーダル制御
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // モーダルの外側クリックで閉じる
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // ESCキーで閉じる
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });
});
