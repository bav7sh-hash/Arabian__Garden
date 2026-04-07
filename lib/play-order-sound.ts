export function playOrderSound(): void {
  if (typeof window === 'undefined') return
  const audio = new Audio('/sounds/order.mp3')
  audio.volume = 0.35
  void audio.play().catch(() => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0.12
    osc.frequency.value = 880
    osc.type = 'sine'
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
  })
}
