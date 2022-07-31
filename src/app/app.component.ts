import {Component, OnInit, ViewChild} from '@angular/core';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ApiService} from "./api.service";
import {Ship} from "./data";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {StateService} from "./state.service";
import {MatSort} from "@angular/material/sort";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ships: Ship[] = [];
  data: Ship[] = [];
  shipToDisplay!: Ship[];
  selection = new SelectionModel<Ship>(true, []);
  displayedColumns: string[] = ["select", "country", "callsign", "width"];
  dataSource = new MatTableDataSource(this.ships);
  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService,
              private state: StateService) {
  }

  public ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.fetchShips();
    }, 1500);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public selectHandler(row: Ship) {
    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }
    this.selection.toggle(row);

    let id = row.mmsi;
    if (id) {
      row.selected = true;
      this.state.saveShipToLocalStorage(id);
    }
  }

  public getShipDetailsById(id: number) {
    if (id) {
      this.shipToDisplay = this.ships.filter(item => item.mmsi === id);
    }
  }

  private fetchShips() {
    this.api.getDataObjects()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        data.filter(x => this.ships.push(x.ship));
        this.data = this.state.retrievedData(this.ships);
        this.dataSource = new MatTableDataSource<Ship>(this.ships);
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      })
  }
}

