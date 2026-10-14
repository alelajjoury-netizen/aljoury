type PlantArtProps = {
  potColor: string;
  type?: 'monstera' | 'snake' | 'pothos' | 'pot' | 'kit';
};

export function PlantArt({ potColor, type = 'monstera' }: PlantArtProps) {
  if (type === 'kit') {
    return <svg viewBox="0 0 300 280" aria-hidden="true">
      <ellipse cx="150" cy="244" rx="92" ry="12" fill="#68766a" opacity=".12" />
      <path d="M68 138h104l-9 93H77z" fill="#c87d55" />
      <path d="M68 138h104v14H68z" fill="#b56a49" />
      <path d="M183 157h45v74h-45z" rx="5" fill="#d6d8c9" />
      <path d="M183 157h45v13h-45z" fill="#b7c3b6" />
      <path d="M93 120h24v-35h-24zM119 120h25V65h-25z" fill="#7d907e" />
      <path d="M100 90c0-7 10-7 10 0v11h-10zM126 75c0-7 10-7 10 0v12h-10z" fill="#e9e4d5" />
      <path d="M81 176h77" stroke="#e5b492" strokeWidth="2" opacity=".55" />
      <path d="M196 188h19" stroke="#f3f0e7" strokeWidth="4" strokeLinecap="round" />
    </svg>;
  }
  if (type === 'pot') {
    return <svg viewBox="0 0 300 280" aria-hidden="true">
      <ellipse cx="150" cy="236" rx="78" ry="11" fill="#68766a" opacity=".13" />
      <path d="M84 107h132l-14 119H98z" fill={potColor} />
      <path d="M78 98h144v22H78z" fill={potColor} />
      <path d="M93 126h112" stroke="#fff" strokeOpacity=".26" strokeWidth="3" />
      <path d="M109 101c3 31 2 80 4 112" stroke="#fff" strokeOpacity=".15" strokeWidth="2" />
      <path d="M187 101c-3 32-2 80-4 112" stroke="#593e31" strokeOpacity=".12" strokeWidth="2" />
    </svg>;
  }
  const leafColors = ['#516d59', '#6d886f', '#829984', '#3d5948', '#94a58d'];
  return <svg viewBox="0 0 300 280" aria-hidden="true">
    <ellipse cx="150" cy="245" rx="72" ry="10" fill="#68766a" opacity=".14" />
    {type === 'snake' ? <>
      <path d="M139 169c-6-47-6-102 0-137 12 11 17 34 15 62l-2 75z" fill="#57745c" />
      <path d="M155 170c-1-59 7-104 24-133 9 22 6 48-1 71l-12 63z" fill="#82967a" />
      <path d="M129 174c7-44-1-81-18-105-12 20-10 48-3 68l10 39z" fill="#6f896d" />
      <path d="M148 111l3-65M168 118l8-65M118 132l-7-44" stroke="#c8c68f" strokeWidth="3" opacity=".8" />
    </> : <>
      <path d="M150 177C130 132 125 83 144 39c20 23 29 64 15 116 12-51 35-84 65-91 1 42-21 87-65 112" fill={leafColors[0]} />
      <path d="M148 178c-25-23-59-36-91-31 13 34 43 52 93 51-44 8-72 29-84 59 38 5 71-10 99-45" fill={leafColors[1]} />
      <path d="M151 179c19-30 50-49 86-47-10 32-37 53-80 65 40-8 70-1 92 21-30 21-65 21-101 2" fill={leafColors[2]} />
      <path d="M150 178c-12-38-9-81 12-123 17 29 19 68-4 116 20-37 44-57 76-60-4 37-25 67-71 86" fill={leafColors[3]} />
      <path d="M151 182c-9-32-30-55-62-66-3 35 13 63 54 85-39-17-69-15-97 6 23 27 56 37 101 17" fill={leafColors[4]} />
      <path d="M150 189C148 130 149 89 154 54" stroke="#b6c2a4" strokeWidth="2" fill="none" opacity=".62" />
    </>}
    <path d="M111 171h78l-9 69h-60z" fill={potColor} />
    <path d="M107 165h86v15h-86z" fill={potColor} />
    <path d="M121 186h56" stroke="#fff" strokeOpacity=".24" strokeWidth="2" />
  </svg>;
}
