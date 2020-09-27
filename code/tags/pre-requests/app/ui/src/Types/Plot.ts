export interface Plot {
  identifier: string;
  farmer: string;
  plotNumber: number;
  username: string;
}

export const Plots: Plot[] = [
  { identifier: "producer_plot1", plotNumber: 1, username: "producer", farmer: "Jimmeh Jim" },
  { identifier: "producer_plot2", plotNumber: 2, username: "producer", farmer: "John Doe" },
  { identifier: "producer_plot3", plotNumber: 3, username: "producer", farmer: "Dr Seuss" },
  { identifier: "producer_plot4", plotNumber: 4, username: "producer", farmer: "Mary M" },
  { identifier: "producer_plot5", plotNumber: 5, username: "producer", farmer: "Santa Claus" },
  { identifier: "alice_plot1", plotNumber: 1, username: "Alice", farmer: "Satan" },
  { identifier: "alice_plot2", plotNumber: 2, username: "Alice", farmer: "God" },
  { identifier: "alice_plot3", plotNumber: 3, username: "Alice", farmer: "Dante" },
  { identifier: "alice_plot4", plotNumber: 4, username: "Alice", farmer: "Beatrice" },
  { identifier: "alice_plot5", plotNumber: 5, username: "Alice", farmer: "Virgil" }
]

export function plotFromPlotId(plotId: string): Plot | undefined {
  const result = Plots.find(plot => plot.identifier === plotId);
  return result;
}

export function plotsForUser(username: string): Plot[] {
  return Plots.filter(plot => plot.username === username);
}
