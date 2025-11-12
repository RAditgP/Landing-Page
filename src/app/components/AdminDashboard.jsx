import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", users: 3 },
  { name: "Feb", users: 8 },
  { name: "Mar", users: 12 },
];

<LineChart width={400} height={200} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="users" stroke="#2563eb" />
</LineChart>
