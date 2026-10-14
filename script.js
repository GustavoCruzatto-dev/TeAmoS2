(() => {
    const corpo = document.body;
    const liquido = document.querySelector('.liquido');
    const botao = document.getElementById('de-novo');
    const canvas = document.getElementById('particulas');
    const ctx = canvas.getContext('2d');
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let particulas = [];
    let rafId = null;

    function ajustar() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function nova(espalhada) {
        return {
            x: Math.random() * W,
            y: espalhada ? Math.random() * H : H + 10,
            r: 0.8 + Math.random() * 1.8,
            v: 0.15 + Math.random() * 0.35,
            fase: Math.random() * 6.28
        };
    }

    function quadro(t) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffb3c8';
        for (const p of particulas) {
            p.y -= p.v;
            p.x += Math.sin(t / 2000 + p.fase) * 0.25;
            if (p.y < -10) Object.assign(p, nova(false));
            ctx.globalAlpha = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t / 900 + p.fase));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 6.2832);
            ctx.fill();
        }
        rafId = requestAnimationFrame(quadro);
    }

    function iniciarParticulas() {
        if (reduzir || rafId) return;
        particulas = Array.from({ length: 36 }, () => nova(true));
        rafId = requestAnimationFrame(quadro);
    }

    function pararParticulas() {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    function completar() {
        corpo.classList.add('completo');
        iniciarParticulas();
    }

    function reiniciar() {
        corpo.classList.remove('rodando', 'completo');
        pararParticulas();
        void corpo.offsetWidth; // força o navegador a reiniciar as animações
        corpo.classList.add('rodando');
    }

    liquido.addEventListener('animationend', (e) => {
        if (e.animationName === 'subir') completar();
    });

    botao.addEventListener('click', reiniciar);
    window.addEventListener('resize', ajustar);

    ajustar();
})();