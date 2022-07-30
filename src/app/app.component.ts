import {Component, OnInit} from '@angular/core';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ApiService} from "./api.service";
import {DataObject, Ship} from "./data";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {StateService} from "./state.service";
import {Sort} from "@angular/material/sort";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  data$: DataObject[] = [];
  shipToDisplay!: DataObject[];
  dataSource = new MatTableDataSource<DataObject>([]);
  selection = new SelectionModel<Ship>(true, []);
  displayedColumns: string[] = ["select", "mmsi", "country", "callsign", "width"];

  sortedData: DataObject[] = [];

  constructor(private api: ApiService,
              private state: StateService) {
  }

  public ngOnInit(): void {
    this.fetchShips();

    this.sortedData = this.data$.slice();
  }


  public selectHandler(row: DataObject) {
    if (!this.selection.isSelected(row.ship)) {
      this.selection.clear();
    }
    this.selection.toggle(row.ship);

    let id = row.ship.mmsi;
    if (id) {
      this.state.saveShipToLocalStorage(id);
    }
  }

  public getShipDetailsById(id: number | undefined) {
    this.shipToDisplay = this.data$.filter(x => x.ship.mmsi === id);
  }

  private fetchShips() {
    this.api.getDataObjects()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.data$ = this.state.retrievedData(data);
        ;
        this.dataSource = new MatTableDataSource<DataObject>(this.data$);
      })
  }

  sortData(sort: Sort) {
    const data = this.data$.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'mmsi':
          return compare(a.ship.mmsi!, b.ship.mmsi!, isAsc);
        case 'country':
          return compare(a.ship.country!, b.ship.country!, isAsc);
        case 'callsign':
          return compare(a.ship.callsign!, b.ship.callsign!, isAsc);
        case 'width':
          return compare(a.ship.width!, b.ship.width!, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
