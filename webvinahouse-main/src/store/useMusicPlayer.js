import { create } from 'zustand'

export const useMusicPlayer = create((set) => ({
    music: {    id: 't1',
        title: 'Cảm giác lúc ấy sẽ ra sao',
        artist: 'LOU Hoàng',
        image: 'https://i.ytimg.com/vi/9u1wkvVY7jc/maxresdefault.jpg', // Placeholder image path
        src: '/audio/CamGiacLucAySeRaSao-KyLanLangTu-11590656.mp3', // Placeholder src - Ideally set this when a song is selected
        isFavorite: false},
    setMusic: (newMusic) => set(() => ({ music:newMusic })),
}))
