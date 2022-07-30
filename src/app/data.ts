export interface Position {
  coordinates: any[];
  extensions: string[];
  type: string;
}

export interface Ship {
  callsign?: string;
  country?: string;
  destination?: string;
  draught?: number;
  eta?: string;
  imo?: number;
  length?: number;
  mmsi?: number;
  name?: string;
  rot?: number;
  type?: string;
  width?: number;
  heading?: number;
  cargo?: string;
  tom?: string;
  selected?: boolean
}

export interface DataObject {
  position: Position;
  ship: Ship;
}

export interface DataObjects {
  records: DataObject[];
}
