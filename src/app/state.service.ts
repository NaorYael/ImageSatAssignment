import {Injectable} from '@angular/core';
import {DataObject} from "./data";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private arr: number[] = [];

  public saveShipToLocalStorage(shipId: number) {
    this.arr.push(shipId)
    localStorage.setItem("selectedShips", JSON.stringify(this.arr));
  }

  public retrievedData(shipArr: DataObject[]): DataObject[] {
    const retrievedData = localStorage.getItem("selectedShips");
    const arr = JSON.parse(retrievedData!) as number[];
    arr.forEach(id => {
      const shipIndex =
        shipArr.findIndex(s => s.ship.mmsi === id);
      if (shipIndex !== -1) {
        shipArr[shipIndex].ship.selected = true;
      }
    })
    return shipArr;
  }
}

