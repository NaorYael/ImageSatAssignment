import {Injectable} from '@angular/core';
import {Ship} from "./data";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private arr: number[] = [];

  public saveShipToLocalStorage(shipId: number) {
    this.arr.push(shipId);
    localStorage.setItem("selectedShips", JSON.stringify(this.arr));
  }

  public retrievedData(shipArr: Ship[]): Ship[] {
    const retrievedData = localStorage.getItem("selectedShips");
    const arr = JSON.parse(retrievedData!) as number[];

    if (arr) {
      arr.forEach(id => {
        const shipIndex =
          shipArr.findIndex(s => s.mmsi === id);
        if (shipIndex !== -1) {
          shipArr[shipIndex].selected = true;
        }
      })
    }
    return shipArr;
  }
}

