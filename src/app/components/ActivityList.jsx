"use client";
export default function ActivityList({ templates = [], messages = [] }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold mb-2">Template Terbaru</h4>
        <ul className="space-y-2">
          {templates.map(t => (
            <li key={t.id} className="bg-white/5 p-3 rounded-md flex justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-gray-400">{t.category} • {new Date(t.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2">Pesan Terbaru</h4>
        <ul className="space-y-2">
          {messages.map(m => (
            <li key={m.id} className="bg-white/5 p-3 rounded-md">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-300">{m.message}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
