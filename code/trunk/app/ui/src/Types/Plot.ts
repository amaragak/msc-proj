import { Fred, Alice } from "./UserInfo";

export interface Plot {
  identifier: string;
  farmer: string;
  plotNumber: number;
  username: string;
}

export const Plots: Plot[] = [
  { identifier: "fred_plot1", plotNumber: 1, username: Fred.username, farmer: "Jimmeh Jim" },
  { identifier: "fred_plot2", plotNumber: 2, username: Fred.username, farmer: "John Doe" },
  { identifier: "fred_plot3", plotNumber: 3, username: Fred.username, farmer: "Dr Seuss" },
  { identifier: "fred_plot4", plotNumber: 4, username: Fred.username, farmer: "Mary M" },
  { identifier: "fred_plot5", plotNumber: 5, username: Fred.username, farmer: "Santa Claus" },
  { identifier: "alice_plot1", plotNumber: 1, username: Alice.username, farmer: "Satan" },
  { identifier: "alice_plot2", plotNumber: 2, username: Alice.username, farmer: "God" },
  { identifier: "alice_plot3", plotNumber: 3, username: Alice.username, farmer: "Dante" },
  { identifier: "alice_plot4", plotNumber: 4, username: Alice.username, farmer: "Beatrice" },
  { identifier: "alice_plot5", plotNumber: 5, username: Alice.username, farmer: "Virgil" },
  { identifier: "felicity_plot1", plotNumber: 1, username: Fred.username, farmer: "Tigger" },
  { identifier: "felicity_plot2", plotNumber: 2, username: Fred.username, farmer: "Betty" },
  { identifier: "felicity_plot3", plotNumber: 3, username: Fred.username, farmer: "Timmy" },
  { identifier: "felicity_plot4", plotNumber: 4, username: Fred.username, farmer: "Bugs" },
  { identifier: "felicity_plot5", plotNumber: 5, username: Fred.username, farmer: "Chip" },
  { identifier: "alex_plot1", plotNumber: 1, username: Alice.username, farmer: "Helen" },
  { identifier: "alex_plot2", plotNumber: 2, username: Alice.username, farmer: "Vasilis" },
  { identifier: "alex_plot3", plotNumber: 3, username: Alice.username, farmer: "Gabs" },
  { identifier: "alex_plot4", plotNumber: 4, username: Alice.username, farmer: "Andreas" },
  { identifier: "alex_plot5", plotNumber: 5, username: Alice.username, farmer: "Alex" }
]

export function plotFromPlotId(plotId: string): Plot | undefined {
  const result = Plots.find(plot => plot.identifier === plotId);
  return result;
}

export function plotsForUser(username: string): Plot[] {
  return Plots.filter(plot => plot.username === username);
}
